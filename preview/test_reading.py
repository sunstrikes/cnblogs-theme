"""Article reader behavior on the native post shell, not private theme helpers."""
import re

from playwright.sync_api import expect


def contents(markup):
    """Replace only the authored body of the anonymized native post."""
    def apply(html):
        return re.sub(r'(id="cnblogs_post_body">).*?(</div>\s*<div class="clear">)',
                      lambda m: m[1] + markup + m[2], html, count=1, flags=re.S)
    return apply


def test_reader_sees_date_count_and_time_before_body(site_page):
    page = site_page(html=contents('<p>' + '排版' * 350 + ' paper sample纸样</p>'))
    header = page.locator('.postTitle + .ctp-post-meta')
    expect(header).to_contain_text('2025-06-23')
    expect(header).to_contain_text('704 字')
    expect(header).to_contain_text('约 2 分钟')


def test_article_typography_links_callouts_and_math_follow_the_palette(site_page):
    types = ['success', 'info', 'tip', 'warning', 'danger']
    elements = ''.join(f'<div class="ctp-callout-{kind}">{kind}</div>' for kind in types)
    page = site_page(html=contents('<h2>观察</h2><h3>记录</h3><a href="#end">图注</a>'
                          '<blockquote>引文</blockquote><mjx-container>x</mjx-container>'
                          '<span class="katex">y</span>' + elements), color_scheme='light')
    body = page.locator('#cnblogs_post_body')
    expect(page.locator('.postTitle')).to_have_css('font-size', '31px')
    expect(body.locator('h2')).to_have_css('margin-top', '49.5px')
    expect(body.locator('h2')).to_have_css('border-bottom-width', '0px')
    expect(body.locator('h3')).to_have_css('font-size', '18px')
    assert 'IBM Plex Sans' in body.evaluate('e => getComputedStyle(e).fontFamily')
    for ink, blue in [('rgb(76, 79, 105)', 'rgb(30, 102, 245)'), ('rgb(205, 214, 244)', 'rgb(137, 180, 250)')]:
        expect(body.locator('a')).to_have_css('color', blue)
        expect(body.locator('a')).to_have_css('text-decoration-line', 'underline')
        colors = set()
        for selector in ['blockquote', *(f'.ctp-callout-{kind}' for kind in types)]:
            block = body.locator(selector)
            expect(block).to_have_css('border-left-width', '3px')
            expect(block).to_have_css('color', ink)
            colors.add(block.evaluate('e => getComputedStyle(e).borderLeftColor'))
        assert len(colors) == 6
        for selector in ['mjx-container', '.katex']:
            expect(body.locator(selector)).to_have_css('color', ink)
        page.get_by_role('button', name='切换明暗主题').click()
    page.set_viewport_size({'width':390, 'height':844})
    expect(page.locator('.postTitle')).to_have_css('font-size', '25px')


def test_wide_content_scrolls_locally_on_phone_and_late_images_are_lazy(site_page):
    page = site_page(viewport={'width':390, 'height':844})
    page.locator('#cnblogs_post_body').evaluate('''e => e.insertAdjacentHTML('beforeend',
        `<table aria-label="尺寸表"><tr>${'<th>宽度</th>'.repeat(35)}</tr></table>
        <pre><code class="language-text">${'paper'.repeat(120)}</code></pre>
        <img alt="纸样" width="1600" height="400" src="/preview/fixtures/paper.svg">`)''')
    img = page.get_by_role('img', name='纸样')
    expect(img).to_have_attribute('loading', 'lazy')
    assert img.bounding_box()['width'] <= 350
    for locator in [page.get_by_role('table', name='尺寸表'), page.get_by_text('paper' * 120, exact=True)]:
        assert locator.evaluate('''e => {for (;e && e.id !== 'mainContent';e=e.parentElement) {
            if (['auto','scroll'].includes(getComputedStyle(e).overflowX) && e.scrollWidth>e.clientWidth) return true;
        } return false;}''')
    assert page.evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth')


def test_each_engine_copies_source_not_plugin_controls_or_line_numbers(site_page):
    # Highlight.js's optional table is already rendered on this visit; Prism's
    # toolbar and decorative rows arrive after the article has been enhanced.
    rows = ''.join(f'<tr><td class="hljs-ln-numbers">{n}</td><td class="hljs-ln-code">{line}</td></tr>'
                   for n, line in enumerate(['if True:', '    print(&quot;纸样&quot;)'], 1))
    page = site_page(html=contents('<pre><code class="hljs language-python"><table class="hljs-ln">' + rows +
                     '</table></code></pre><pre class="language-js"><code>const p = 1;\nwrite(p);\n</code></pre>'
                     '<div class="cnblogs_code"><pre><code>一行原生富文本</code></pre></div>'),
                     permissions=['clipboard-read', 'clipboard-write'])
    page.locator('pre.language-js').evaluate('''e=>{e.querySelector('code').insertAdjacentHTML('beforeend',
        '<span class="line-numbers-rows" aria-hidden="true"><span>1</span></span>');
        e.insertAdjacentHTML('beforeend','<div class="cnb-code-toolbar"><button>平台复制</button></div>');}''')
    copies = page.get_by_role('button', name='复制代码')
    expect(copies).to_have_count(2)
    for i, (language, source) in enumerate([('python', 'if True:\n    print("纸样")'), ('js', 'const p = 1;\nwrite(p);\n')]):
        expect(page.get_by_text(language, exact=True)).to_be_visible()
        copies.nth(i).click()
        expect(copies.nth(i)).to_have_text('已复制')
        assert page.evaluate('navigator.clipboard.readText()') == source
    expect(page.get_by_role('button', name='平台复制')).to_have_count(0)
    expect(page.locator('.cnblogs_code button, .cnblogs_code .line-numbers-rows')).to_have_count(0)


def test_both_highlighters_keep_syntax_roles_in_both_themes(site_page):
    page = site_page(color_scheme='light')
    body = page.locator('#cnblogs_post_body')
    for bg, keyword, function, number in [('230, 233, 239', '136, 57, 239', '30, 102, 245', '254, 100, 11'),
                                          ('24, 24, 37', '203, 166, 247', '137, 180, 250', '250, 179, 135')]:
        for sel, rgb in [('.hljs-keyword, .token.keyword', keyword), ('.hljs-title.function_, .token.function', function),
                         ('.hljs-number, .token.number', number)]:
            for token in body.locator(sel).all():
                expect(token).to_have_css('color', f'rgb({rgb})')
        for sample in body.locator('pre > code').all():
            expect(sample).to_have_css('background-color', f'rgb({bg})')
            assert 'JetBrains Mono' in sample.evaluate('e=>getComputedStyle(e).fontFamily')
        page.get_by_role('button', name='切换明暗主题').click()


def test_only_over_threshold_folds_and_copy_keeps_the_hidden_tail(site_page):
    for limit, init in [(34, None), (3, 'window.THEME_CONFIG={code:{collapseLines:3}}')]:
        lines = [f'line {n:02}' for n in range(1, limit+2)]
        source = '\n'.join(lines) + '\n'
        samples = ('<pre><code class="language-python">' + '\n'.join(lines[:-1]) + '\n</code></pre>' +
                   '<pre class="language-js"><code>' + source + '</code></pre>')
        page = site_page(html=contents(samples), init=init, permissions=['clipboard-read', 'clipboard-write'])
        expand = page.get_by_role('button', name=re.compile('展开'))
        expect(expand).to_have_count(1)
        expect(expand).to_have_attribute('aria-expanded', 'false')
        expect(expand).to_contain_text(f'{limit+1} 行')
        pre = page.locator('#cnblogs_post_body pre').nth(1)
        folded = pre.bounding_box()['height']
        page.get_by_role('button', name='复制代码').nth(1).click()
        assert page.evaluate('navigator.clipboard.readText()') == source
        expand.click()
        expect(page.get_by_role('button', name='收起')).to_have_attribute('aria-expanded','true')
        assert pre.bounding_box()['height'] > folded


def test_custom_or_absent_copyright_does_not_replace_native_previous_link(site_page):
    for config, license in [('{}', 'CC BY-NC-SA 4.0'), ('{license:"仅供阅读"}', '仅供阅读'), ('{show:false}', None)]:
        page = site_page(init='window.THEME_CONFIG={copyright:' + config + '}')
        block = page.locator('#cnblogs_post_body ~ .ctp-copyright')
        if license:
            expect(block).to_contain_text(license)
            expect(block).to_contain_text('纸页实验室')
            expect(block).to_have_css('border-left-width', '2px')
            expect(block.get_by_role('link', name='把页边空白留给注释')).to_have_attribute('href', re.compile('/sample/p/1001$'))
        else:
            expect(block).to_have_count(0)
        previous = page.locator('#post_next_prev').get_by_role('link', name='用行距标出段落')
        expect(previous).to_be_visible()
        expect(previous).to_have_attribute('href', '/sample/p/1002')


def test_native_comment_floor_and_editor_remain_usable_when_inserted_late(site_page):
    # The anonymous capture contains a login prompt. Supply a separate signed-in
    # form state in the same native slots; no platform script or credentials needed.
    page = site_page(color_scheme='light')
    expect(page.get_by_text('登录后才能查看或发表评论。')).to_be_visible()
    page.locator('#blog-comments-placeholder').evaluate('e=>e.innerHTML=`<div class="feedbackItem"><div class="feedbackListSubtitle">一楼</div><div class="feedbackCon">这条注释很清楚。</div></div>`')
    page.locator('#comment_form_container').evaluate('''e=>{e.innerHTML=`<form><label>评论<textarea id="tbCommentBody" class="comment_textarea"></textarea></label><button id="btn_comment_submit">发表</button><output></output></form>`;
        e.querySelector('form').onsubmit=event=>{event.preventDefault();e.querySelector('output').textContent=e.querySelector('textarea').value;};}''')
    floor, editor = page.locator('.feedbackItem'), page.get_by_role('textbox',name='评论')
    for ink, bg in [('rgb(76, 79, 105)','rgb(230, 233, 239)'), ('rgb(205, 214, 244)','rgb(24, 24, 37)')]:
        expect(floor).to_have_css('border-bottom-width','1px')
        for el in [floor, editor]:
            expect(el).to_have_css('background-color', bg)
            expect(el).to_have_css('color', ink)
        editor.fill(ink); page.get_by_role('button',name='发表').click()
        expect(page.locator('output')).to_have_text(ink)
        page.get_by_role('button',name='切换明暗主题').click()


def test_desktop_progress_and_both_top_controls_follow_the_reader(site_page):
    page = site_page()
    progress = page.get_by_role('progressbar', name='文章阅读进度')
    expect(progress).to_be_visible()
    expect(progress).to_have_attribute('value','0')
    expect(page.locator('.ctp-rail-foot')).to_contain_text('0%')
    for width in [1440, 390]:
        page.set_viewport_size({'width':width,'height':844})
        page.evaluate('scrollTo(0,600)')
        top = page.get_by_role('button',name='回到顶部')
        expect(top).to_be_in_viewport()
        if width == 1440:
            expect(progress).not_to_have_attribute('value','0')
            value = int(progress.get_attribute('value'))
            assert 0 < value < 100
            expect(page.locator('.ctp-rail-foot')).to_contain_text(f'{value}%')
            page.evaluate('scrollTo(0,document.documentElement.scrollHeight)')
            expect(progress).to_have_attribute('value','100')
        top.click()
        page.wait_for_function('scrollY === 0')


def test_reopening_same_post_restores_and_offers_dismiss_top_or_timed_close(site_page):
    from .site import render
    other = render('post.html').replace('/sample/p/1001','/sample/p/2002')
    page = site_page(routes={'/sample/p/2002':('text/html',other)})
    post = page.url
    page.evaluate('scrollTo(0,720)')
    page.goto('about:blank')  # pagehide flush; avoid native history restoration on reload/back.
    page.goto(post.replace('1001','2002'))
    assert page.evaluate('scrollY') < 3
    notice = page.get_by_role('status').filter(has_text='上次')
    expect(notice).to_have_count(0)
    for action in ['关闭','等待','回到开头']:
        page.goto('about:blank'); page.goto(post)
        expect(notice).to_be_visible()
        assert abs(page.evaluate('scrollY') - 720) <= 2
        if action == '等待':
            page.wait_for_function("!document.querySelector('.ctp-resume')", timeout=5500)
            assert page.evaluate('scrollY') >= 718
        else:
            notice.get_by_role('button',name=action).click()
            expect(notice).to_be_hidden()
            if action == '回到开头':
                page.wait_for_function('scrollY === 0')
            else:
                assert page.evaluate('scrollY') >= 718


def test_disabling_resume_ignores_an_existing_position(site_page):
    page = site_page(); post = page.url
    page.evaluate('scrollTo(0,720)'); page.goto('about:blank'); page.goto(post)
    expect(page.get_by_role('status').filter(has_text='上次')).to_be_visible()
    page.add_init_script('window.THEME_CONFIG={resume:{show:false}}')
    page.goto('about:blank'); page.goto(post)
    page.wait_for_function('document.documentElement.classList.contains("ctp-ready")')
    assert page.evaluate('scrollY') == 0
    expect(page.get_by_role('status').filter(has_text='上次')).to_have_count(0)


def test_print_open_mobile_drawer_in_dark_theme_outputs_only_the_unfolded_article(site_page):
    page = site_page(color_scheme='dark',viewport={'width':390,'height':844}, html=contents(
        '<h2>纸样</h2><p>纸面正文</p><pre><code class="language-python">' + 'print(1)\n'*40 + '</code></pre>'))
    page.get_by_role('button',name='目录').click()
    expect(page.get_by_role('dialog')).to_be_visible()
    page.emulate_media(media='print')
    for sel in ['.ctp-nav','.ctp-rail','.ctp-drawer','.ctp-mobile-top','.ctp-mobile-toc','.ctp-code-head','.ctp-code-fold']:
        expect(page.locator(sel)).to_be_hidden()
    expect(page.locator('body')).to_have_css('background-color','rgb(255, 255, 255)')
    expect(page.get_by_text('纸面正文')).to_have_css('color','rgb(17, 17, 17)')
    expect(page.locator('#cnblogs_post_body pre')).to_have_css('max-height','none')
    expect(page.locator('#cnblogs_post_body')).to_be_visible()
