"""Render the roles published by the two Catppuccin ports, including compound scopes."""
from playwright.sync_api import expect

from .test_reading import contents

# Keep engines separate: .token.symbol and .hljs-symbol intentionally have different inks.
PRISM = {
    'mauve':'keyword important prolog doctype atrule', 'red':'builtin entity deleted',
    'yellow':'class-name symbol attr-name namespace', 'blue':'function property tag selector',
    'peach':'boolean number constant', 'green':'string char url attr-value inserted', 'pink':'regex',
    'sky':'operator', 'text':'variable', 'overlay2':'punctuation comment', 'teal':'cdata',
}
HLJS = {
    'mauve':'keyword variable variable.language_ name selector-attr', 'red':'built_in doctag emphasis strong deletion',
    'yellow':'type title.class_ selector-tag', 'blue':'title title.function_ section attr selector-id',
    'peach':'literal number variable.constant_ meta', 'green':'string char.escape_ attribute code quote addition',
    'pink':'regexp', 'sky':'operator', 'text':'params', 'overlay2':'comment',
    'teal':'property tag bullet formula selector-class selector-pseudo', 'subtext1':'punctuation',
    'subtext0':'subst', 'flamingo':'symbol template-tag template-variable', 'sapphire':'link',
}


def test_published_tokens_and_type_styles_in_both_flavors(site_page):
    spans = ''.join(f'<span class="{prefix}{role.replace(".", " ")}" data-ink="{ink}">{role}</span>'
                    for prefix, roles in [('token ', PRISM), ('hljs-', HLJS)]
                    for ink, names in roles.items() for role in names.split())
    page = site_page(html=contents('<pre><code>' + spans + '<span class="token bold">b</span>'
                                   '<span class="token italic">i</span></code></pre>'), color_scheme='light')
    for theme in ['latte', 'mocha']:
        expect(page.locator('html')).to_have_attribute('data-theme', theme)
        assert page.locator('code [data-ink]').evaluate_all('''els => {
          const probe = document.body.appendChild(document.createElement('i'));
          const errors = els.filter(e => {
            probe.style.color = `var(--ctp-${e.dataset.ink})`;
            return getComputedStyle(e).color !== getComputedStyle(probe).color;
          }).map(e => e.className); probe.remove(); return errors;
        }''') == []
        for selector in ['.token.bold', '.token.important', '.hljs-strong']:
            expect(page.locator(selector)).to_have_css('font-weight', '700')
        for selector in ['.token.italic', '.hljs-emphasis', '.hljs-link', '.hljs-quote']:
            expect(page.locator(selector)).to_have_css('font-style', 'italic')
        for selector in ['.hljs-addition', '.hljs-deletion']:
            assert '0.15' in page.locator(selector).evaluate('e => getComputedStyle(e).backgroundColor')
        page.get_by_role('button', name='切换明暗主题').click()


def test_python_native_and_late_highlighting_only_decorates_method_calls(site_page):
    prism = ('F<span class="token punctuation">.</span>softmax<span class="token punctuation">(</span>x)'
             '<span class="token comment"># F.comment()</span><span class="token string">"F.string()"</span>')
    hljs = ('<table><tr><td class="hljs-ln-code">F.softmax(x).求和 (); F.attr '
            '<span class="hljs-string">"F.string()"</span><span class="hljs-comment"># F.comment()</span>'
            '</td></tr></table>')
    page = site_page(html=contents(f'<pre><code class="language-python">{prism}</code></pre>'
                                   '<pre><code class="language-python hljs">waiting</code></pre>'
                                   f'<pre><code class="language-js">{prism}</code></pre>'
                                   '<pre><code class="language-python">"F.raw()"</code></pre>'))
    blocks = page.locator('#cnblogs_post_body pre > code')
    expect(blocks.nth(0).locator('.token.function')).to_have_text(['softmax'])
    for _ in range(2):  # Simulate an async render and a subsequent platform redraw.
        original = blocks.nth(1).evaluate('(el,html)=>{el.innerHTML=html;return el.textContent}', hljs)
        expect(blocks.nth(1).locator('.hljs-title.function_')).to_have_text(['softmax', '求和'])
        assert blocks.nth(1).text_content() == original
        blocks.nth(0).evaluate('(el,html)=>el.innerHTML=html', prism)
        expect(blocks.nth(0).locator('.token.function')).to_have_text(['softmax'])
    for i in [2, 3]:
        expect(blocks.nth(i).locator('.function, .function_')).to_have_count(0)
