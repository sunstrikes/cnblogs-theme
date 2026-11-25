from playwright.sync_api import expect

from .site import POST


def test_reader_sees_blog_name_and_theme_before_runtime(site_page):
    page = site_page(html=lambda s: s.replace('</div><div id="home">', '''<script>
        window.parserBar = document.querySelector('.ctp-nav');
        window.firstFrame = [document.documentElement.dataset.theme,
          document.querySelector('.ctp-brand')?.textContent, document.readyState];
        </script></div><div id="home">''', 1), color_scheme='dark')
    assert page.evaluate('firstFrame') == ['mocha', '纸页手记', 'loading']
    expect(page.get_by_role('banner')).to_have_count(1)
    assert page.evaluate("parserBar === document.querySelector('.ctp-nav')")


def test_desktop_navigates_only_body_sections_in_centered_workbench(site_page):
    page = site_page()
    rail = page.get_by_role('navigation', name='文章目录')
    expect(rail.get_by_role('link')).to_have_count(9)
    expect(rail.get_by_role('link', name='纸面实验', exact=True)).to_be_visible()
    expect(rail.get_by_role('link', name='把页边空白留给注释')).to_have_count(0)
    assert page.locator('.ctp-nav').bounding_box()['height'] == 52
    assert page.locator('#main').bounding_box()['x'] == 40
    assert page.locator('.ctp-rail').bounding_box()['width'] == 264
    assert page.locator('#cnblogs_post_body').bounding_box()['width'] <= 840
    expect(page.locator('#main > #sideBar #leftcontentcontainer #blog-sidecolumn')).to_be_hidden()
    expect(page.locator('#blog-sidecolumn')).to_contain_text('随笔档案')
    rail.get_by_role('link', name='尺上的刻度', exact=True).click()
    active = rail.locator('[aria-current="location"]')
    expect(active).to_have_text('尺上的刻度')
    expect(active).to_have_css('background-color','rgba(0, 0, 0, 0)')
    assert active.evaluate("e => getComputedStyle(e, '::before').width") == '3px'
    assert 51 <= page.locator('#cnblogs_post_body h4', has_text='尺上的刻度').bounding_box()['y'] < 130
    rail.get_by_role('link', name='下一步', exact=True).click()
    expect(active).to_have_text('下一步')
    page.evaluate('scrollTo(0,0)')
    expect(active).to_have_text('纸面实验')


def test_mobile_keyboard_navigation_opens_two_different_drawers(site_page):
    page = site_page(viewport={'width':959, 'height':760}, reduced_motion='reduce')
    menu = page.get_by_role('button', name='导航', exact=True)
    menu.focus(); page.keyboard.press('Enter')
    dialog = page.get_by_role('dialog', name='站点导航')
    expect(dialog).to_be_visible()
    assert dialog.bounding_box()['x'] > 0
    page.keyboard.press('Escape'); expect(menu).to_be_focused()
    toc = page.get_by_role('button', name='目录', exact=True)
    toc.focus(); page.keyboard.press('Space')
    sheet = page.get_by_role('dialog', name='文章目录')
    expect(sheet).to_be_visible()
    assert sheet.bounding_box()['y'] > 0
    assert sheet.evaluate("e => getComputedStyle(e).animationDuration") == '0s'
    link = sheet.get_by_role('link', name='记录方法', exact=True)
    link.focus(); page.keyboard.press('Enter')
    expect(sheet).to_have_count(0)
    heading = page.get_by_role('heading',name='记录方法',exact=True)
    assert 52 <= heading.bounding_box()['y'] < 135
    expect(heading).to_be_focused()
    page.set_viewport_size({'width':960,'height':760})
    expect(page.get_by_role('navigation', name='文章目录')).to_be_visible()
    expect(toc).to_be_hidden()


def test_archive_link_uses_latest_nonempty_native_month(site_page):
    page = site_page()
    expect(page.get_by_role('navigation', name='站点导航').get_by_role('link', name='归档')).to_have_attribute('href', '/sample/p/archive/2025/06')


def test_saved_choice_wins_site_default_then_system_and_toggle_survives_reload(site_page):
    page = site_page(color_scheme='light', init='''window.THEME_CONFIG = {
        defaultTheme:'mocha', siteName:'窄页', accent:'teal',
        favicon:'/sample/mark.svg', nav:[{label:'实验',href:'/tags'}]
    }''')
    expect(page.locator('html')).to_have_attribute('data-theme', 'mocha')
    expect(page.get_by_role('link', name='窄页')).to_have_attribute('href', '/sample/')
    expect(page.get_by_role('link', name='实验', exact=True)).to_have_attribute('href', 'https://ctp.test/sample/tags')
    expect(page.locator('link[rel=icon]')).to_have_attribute('href', '/sample/mark.svg')
    page.get_by_role('button', name='切换明暗主题').click()
    page.emulate_media(color_scheme='dark')
    page.reload()
    expect(page.locator('html')).to_have_attribute('data-theme', 'latte')
    expect(page.locator('.ctp-theme')).to_have_text('Latte')
    expect(page.locator('.ctp-nav input[type=color]')).to_have_count(0)


def test_rail_accent_is_configurable_but_not_a_nav_control(site_page):
    for accent, rgb in [('mauve','136, 57, 239'), ('blue','30, 102, 245'),
                       ('teal','18, 108, 113'), ('lavender','79, 88, 170')]:
        init = f"window.THEME_CONFIG={{accent:'{accent}'}}" if accent != 'mauve' else None
        page = site_page(init=init, color_scheme='light')
        expect(page.get_by_role('navigation', name='文章目录').locator('[aria-current]')).to_have_css('color', f'rgb({rgb})')
        expect(page.locator('.ctp-nav select, .ctp-nav input')).to_have_count(0)


def test_native_content_or_sidebar_can_arrive_after_boot(site_page):
    page = site_page(html=lambda s: s.replace('id="cnblogs_post_body"','id="pending-body"')
                     .replace('id="leftcontentcontainer"','id="pending-side"')
                     .replace('<div id="blog-sidecolumn"></div>', ''))
    assert page.locator('#home').evaluate('e=>getComputedStyle(e).opacity') == '0'
    page.evaluate('''() => {
      const copy = document.getElementById('pending-body').cloneNode(true);
      copy.id = 'cnblogs_post_body'; document.getElementById('pending-body').replaceWith(copy);
    }''')
    rail = page.get_by_role('navigation', name='文章目录')
    expect(rail.get_by_role('link', name='记录方法')).to_have_count(1)
    page.evaluate('''() => {const side = document.getElementById('pending-side');
      side.id='leftcontentcontainer'; const div = document.createElement('div');
      div.id='blog-sidecolumn'; side.append(div); div.innerHTML='<p>侧栏已到</p>';
      document.getElementById('cnblogs_post_body').insertAdjacentHTML('beforeend','<h3>补记</h3>');}''')
    expect(page.locator('#home')).to_have_css('opacity','1')
    expect(rail.get_by_role('link', name='补记')).to_have_count(1)
    expect(page.locator('#main > #sideBar #leftcontentcontainer > #blog-sidecolumn')).to_have_text('侧栏已到')


def test_missing_data_and_missing_js_each_have_a_reveal_deadline(site_page):
    # With no native async response the JS timer, not a successful sidebar fill, opens the gate.
    page = site_page(routes={'/sample/ajax/sidebar-lists':('application/json','{"sideColumn":"","topLists":""}')})
    assert page.locator('#home').evaluate('e=>getComputedStyle(e).opacity') == '0'
    page.wait_for_function("getComputedStyle(document.querySelector('#home')).opacity === '1'", timeout=1900)
    # Without any script the independent CSS timer must work even in reduced motion mode.
    bare = site_page(java_script_enabled=False, reduced_motion='reduce')
    assert bare.locator('#home').evaluate('e=>getComputedStyle(e).opacity') == '0'
    expect(bare.locator('#home')).to_have_css('opacity', '1', timeout=3000)
    expect(bare.locator('#cnblogs_post_body')).to_be_visible()


def test_same_origin_navigation_adopts_static_bar_without_white_transition(browser, local_site):
    with browser.new_context(color_scheme='dark') as ctx:
        ctx.add_init_script('''window.THEME_CONFIG = {nav:[{label:'下一页', href:'/p/1001?part=2'}]};
          addEventListener('pagereveal', event => {
            window.reveal = {transition:Boolean(event.viewTransition), navs:document.querySelectorAll('.ctp-nav').length};
          });''')
        page = ctx.new_page()
        page.goto(local_site + POST)
        # The old document must actually have presented a frame to be snapshotted.
        page.evaluate('new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)))')
        page.get_by_role('link', name='下一页').click()
        page.wait_for_url('**/1001?part=2')
        bar = page.get_by_role('banner')
        expect(bar).to_have_count(1)
        expect(bar).to_have_css('background-color', 'rgb(17, 17, 27)')
        expect(bar).to_have_css('view-transition-name','ctp-nav')
        if page.evaluate("'onpagereveal' in window"):
            page.wait_for_function('Boolean(window.reveal)')
            assert page.evaluate('reveal') == {'transition':True, 'navs':1}
            for pseudo in ['old','new']:
                assert page.evaluate("p => getComputedStyle(document.documentElement, `::view-transition-${p}(ctp-nav)`).animationName", pseudo) == 'none'
