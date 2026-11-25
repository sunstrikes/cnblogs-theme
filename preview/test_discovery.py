from playwright.sync_api import expect


HOME = '/sample/'
FIRST = '把页边空白留给注释'
SECOND = '用行距标出段落'
THIRD = '整理纸页上的索引'
FOURTH = '校对一份索引'


def test_home_lists_each_post_and_rebuilds_quick_index_on_pagination(site_page):
    page = site_page(HOME)
    rows = page.get_by_role('article')
    expect(rows).to_have_count(3)
    expect(rows.nth(0)).to_contain_text('对照窄屏和宽屏')
    expect(rows.nth(0)).to_contain_text('阅读(7)')
    expect(rows.nth(1)).to_contain_text('调整行与行之间的距离')
    expect(rows.nth(1)).to_contain_text('阅读(14)')
    rail = page.get_by_role('navigation', name='本页文章')
    expect(rail.get_by_role('link')).to_have_text([FIRST, SECOND, THIRD])
    rail.get_by_role('link', name=SECOND).click()
    expect(page.locator(':target')).to_contain_text(SECOND)
    expect(rows.nth(1).get_by_role('link', name=SECOND)).to_have_attribute('href', '/sample/p/1002')
    box = rows.first.bounding_box(); main = page.locator('#mainContent').bounding_box()
    assert box['width'] <= 880 and abs(box['x'] + box['width']/2 - main['x'] - main['width']/2) < 1
    page.get_by_role('link', name='下一页').click()
    expect(rows).to_have_count(1)
    expect(rail.get_by_role('link')).to_have_text([FOURTH])
    rail.get_by_role('link', name=FOURTH).click()
    expect(page.locator(':target')).to_contain_text(FOURTH)


def test_delayed_announcement_is_not_the_native_profile_or_a_second_sidebar(site_page):
    pause = """const fetchNative=window.fetch; let release; const ready = new Promise(r => release=r);
      window.releaseNews=release; window.fetch=async (...a) => {
        if(String(a[0]).endsWith('/news')) await ready; return fetchNative(...a); };"""
    page = site_page(HOME, init=pause)
    expect(page.get_by_role('article').first).to_be_visible()
    expect(page.locator('#home')).to_have_css('opacity','1')
    expect(page.get_by_text('本周整理纸页目录', exact=False)).to_have_count(0)
    page.evaluate('releaseNews()')
    rail = page.get_by_role('complementary')
    expect(rail).to_contain_text('本周整理纸页目录，欢迎翻阅旧稿。')
    expect(rail).not_to_contain_text('昵称')
    expect(page.locator('#sideBar')).to_be_hidden()
    page = site_page(HOME, init="window.THEME_CONFIG={notice:{html:'<em>来信请附页码</em>'}}")
    expect(page.locator('#sidebar_news_content')).to_contain_text('本周整理纸页目录')
    expect(page.get_by_role('complementary').get_by_text('来信请附页码')).to_have_count(1)
    expect(page.get_by_role('complementary')).not_to_contain_text('本周整理纸页目录')


def test_category_bar_filters_by_config_and_opens_native_results(site_page):
    page = site_page(HOME, init="window.THEME_CONFIG={categories:{include:['样式实验'],max:1}}")
    bar = page.get_by_role('navigation', name='分类筛选')
    expect(bar.get_by_role('link')).to_have_count(2)
    expect(bar.get_by_role('link', name='全部')).to_be_visible()
    expect(bar.get_by_role('link', name='阅读笔记')).to_have_count(0)
    bar.get_by_role('link', name='样式实验').click()
    expect(page.get_by_role('heading', name=THIRD)).to_be_visible()
    limited = site_page(HOME, init='window.THEME_CONFIG={categories:{max:1}}')
    expect(limited.get_by_role('navigation', name='分类筛选').get_by_role('link')).to_have_count(2)
    hidden = site_page(HOME, init='window.THEME_CONFIG={categories:{show:false}}')
    expect(hidden.get_by_role('complementary')).to_contain_text('本周整理纸页目录')
    expect(hidden.get_by_role('navigation', name='分类筛选')).to_have_count(0)


def test_post_header_uses_known_keywords_then_authoritative_late_accessories(site_page):
    import json
    from .site import FIXTURES
    # This second native state changes both items and includes a collection. The title
    # links must update, not accumulate old/duplicate values or classify the collection.
    accessories = json.loads((FIXTURES / 'post-accessories.json').read_text())
    accessories['categoriesTags'] = accessories['categoriesTags'].replace('阅读笔记', '样式实验').replace('21.html', '22.html').replace('排版', '间距').replace('%E6%8E%92%E7%89%88', '%E9%97%B4%E8%B7%9D')
    page = site_page(init="""const load=window.fetch; let release; const gate=new Promise(r=>release=r);
        window.releaseAccessories=release; window.fetch=async (...a) => {
          if(String(a[0]).includes('post-accessories')) await gate; return load(...a); };""",
        routes={'/sample/ajax/post-accessories':('application/json', json.dumps(accessories))})
    categories = page.get_by_role('navigation', name='文章分类')
    tags = page.get_by_role('navigation', name='文章标签')
    expect(categories.get_by_role('link')).to_have_text(['阅读笔记'])
    expect(tags.get_by_role('link')).to_have_text(['排版'])
    expect(page.locator('#EntryTag')).to_have_count(0)
    page.evaluate('releaseAccessories()')
    expect(categories.get_by_role('link')).to_have_text(['样式实验'])
    expect(tags.get_by_role('link')).to_have_text(['间距'])
    expect(categories.get_by_role('link')).to_have_attribute('href', 'https://ctp.test/sample/category/22.html')
    tags.get_by_role('link').click()
    expect(page.get_by_role('heading', name='当前标签：间距')).to_be_visible()


def test_flat_directories_lead_through_different_native_results_to_posts(site_page):
    for path, rail_name, name, post in [('/sample/categories', '随笔分类','阅读笔记', FIRST),
                                        ('/sample/tag/', '我的标签','排版', SECOND)]:
        page = site_page(path)
        expect(page.get_by_role('navigation', name=rail_name).get_by_role('link', name=name)).to_be_visible()
        link = page.locator('#mainContent').get_by_role('link', name=name)
        first, second = page.locator('#mainContent').get_by_role('link').all()[:2]
        assert first.bounding_box()['y'] == second.bounding_box()['y']
        assert second.bounding_box()['x'] - first.bounding_box()['x'] > 150
        link.click()
        result = page.locator('#mainContent').get_by_role('link', name=post, exact=True)
        if result.get_attribute('target') == '_blank':
            with page.expect_popup() as popup:
                result.click()
            page = popup.value
        else:
            result.click()
        expect(page.locator('#cb_post_title_url')).to_have_text(post)


def test_archive_starts_with_published_month_and_loads_next_month_on_scroll(site_page):
    requests = []
    page = site_page(HOME, viewport={'width':1280, 'height':360}, before=lambda p:
                     p.on('request', lambda r: requests.append(r.url)))
    page.get_by_role('navigation', name='站点导航').get_by_role('link', name='归档').click()
    page.wait_for_url('**/archive/2025/06')
    rail = page.get_by_role('navigation', name='归档月份')
    expect(rail.get_by_role('link')).to_have_text(['2025年6月','2025年5月'])
    expect(page.get_by_role('region', name='2025年6月').get_by_role('link', name=FIRST, exact=True)).to_be_visible()
    assert not any('/archive/2025/05' in url for url in requests)
    page.get_by_role('region', name='2025年5月').scroll_into_view_if_needed()
    may = page.get_by_role('region', name='2025年5月')
    expect(may.get_by_role('link', name=THIRD, exact=True)).to_be_visible()
    expect(may.get_by_role('link', name=FOURTH, exact=True)).to_be_visible()
    expect(may).to_contain_text('给不同月份的纸页编一个可查找的目录')
    may.get_by_role('link', name=THIRD, exact=True).click()
    expect(page.locator('#cb_post_title_url')).to_have_text(THIRD)


def test_archive_nav_never_points_at_an_unpublished_month_while_sidebar_is_late(site_page):
    page = site_page(HOME, init="""const load=window.fetch; let done; const wait=new Promise(r=>done=r);
      window.publishMonths=done; window.fetch=async(...a)=>{
        if(String(a[0]).includes('/ajax/sidebar-lists')) await wait; return load(...a); };""")
    archive = page.get_by_role('navigation', name='站点导航').get_by_text('归档')
    expect(archive).to_have_attribute('href','/sample/p/archive/2025/06')
    page.evaluate('publishMonths()')
    expect(archive).to_have_attribute('href','/sample/p/archive/2025/06')
    archive.click()
    expect(page.locator('.entrylist').get_by_role('link', name=FIRST, exact=True)).to_be_visible()


def test_delayed_and_failed_months_do_not_block_each_other_or_native_posts(site_page):
    import json
    from .site import FIXTURES
    sidebar = json.loads((FIXTURES / 'sidebar-lists.json').read_text())
    sidebar['sideColumn'] = sidebar['sideColumn'].replace('2025年5月(2)</a>',
        '2025年5月(2)</a></li><li><a href="/sample/p/archive/2025/04">2025年4月(1)</a>')
    page = site_page('/sample/p/archive/2025/06', viewport={'width':1240,'height':400},
        init="""const load=window.fetch; let done; const wait=new Promise(r=>done=r);
        window.releaseMay=done; window.fetch=async(...a)=>{
          if(String(a[0]).endsWith('/archive/2025/05')) await wait; return load(...a); };""",
        routes={'/sample/ajax/sidebar-lists': ('application/json', json.dumps(sidebar))})
    rail = page.get_by_role('navigation', name='归档月份')
    rail.get_by_role('link', name='2025年5月').click()
    expect(page.get_by_role('region', name='2025年5月')).to_contain_text('正在加载')
    rail.get_by_role('link', name='2025年4月').click()
    failed = page.get_by_role('region', name='2025年4月')
    expect(failed.get_by_role('link', name='打开原始月份')).to_be_visible()
    expect(failed.get_by_role('button', name='重试')).to_be_visible()
    rail.get_by_role('link', name='2025年6月').click()
    expect(page.get_by_role('region', name='2025年6月').get_by_role('link', name=FIRST, exact=True)).to_be_visible()
    page.evaluate('releaseMay()')
    expect(page.get_by_role('region', name='2025年5月').get_by_role('link', name=FOURTH)).to_be_visible()


def test_home_receives_successive_native_day_groups_in_the_same_container(site_page):
    # Keep the real native groups inert until two separate platform deliveries.
    page = site_page(HOME, html=lambda s: s.replace('<div class="day"', '<template id="pending-days"><div class="day"', 1)
                     .replace('<div class="topicListFooter">', '</template><div class="topicListFooter">', 1))
    index = page.get_by_role('navigation', name='本页文章')
    publish = "() => { const t = document.querySelector('#pending-days'); t.before(t.content.firstElementChild); }"
    page.evaluate(publish)
    expect(index.get_by_role('link')).to_have_text([FIRST, SECOND])
    first_id = index.get_by_role('link').first.get_attribute('href')
    # The platform can insert a group shell separately from its child posts.
    page.evaluate('''async () => { const t = document.querySelector('#pending-days');
        const shell = document.createElement('div'); shell.className = 'day'; t.before(shell);
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        shell.append(...Array.from(t.content.firstElementChild.children)); }''')
    expect(index.get_by_role('link')).to_have_text([FIRST, SECOND, THIRD])
    expect(page.get_by_role('article')).to_have_count(3)
    expect(index.get_by_role('link').first).to_have_attribute('href', first_id)
    index.get_by_role('link', name=THIRD).click()
    expect(page.locator(':target')).to_contain_text(THIRD)
    expect(page.get_by_role('navigation', name='分类筛选')).to_have_count(1)
    expect(page.get_by_role('complementary').get_by_role('heading', name='公告')).to_have_count(1)


def test_unrelated_native_widget_does_not_reveal_home_before_categories(site_page):
    import json
    from .site import FIXTURES
    sidebar = json.loads((FIXTURES / 'sidebar-lists.json').read_text())
    # Archive data is ready, but the only other sidebar child is an unrelated ranking.
    sidebar['sideColumn'] = sidebar['sideColumn'][sidebar['sideColumn'].index('<div class="catListPostArchive'):]
    page = site_page(HOME, routes={'/sample/ajax/sidebar-lists': ('application/json', json.dumps(sidebar))},
        init="""const load = window.fetch; let resume; const next = new Promise(r => resume = r);
        window.publishCategories = resume; window.fetch = async (...args) => {
          if (String(args[0]).endsWith('/categories')) await next; return load(...args); };""")
    expect(page.locator('#sidebar_topviewedposts')).to_be_attached()
    assert page.locator('#home').evaluate('e => getComputedStyle(e).opacity') == '0'
    page.evaluate('publishCategories()')
    expect(page.get_by_role('navigation', name='分类筛选')).to_contain_text('样式实验')
    expect(page.locator('#home')).to_have_css('opacity','1')


def test_archive_navigation_without_month_widget_uses_only_published_evidence(site_page):
    missing = {'/sample/ajax/sidebar-lists':('application/json','{"sideColumn":"","topLists":""}')}
    # The month comes from the current archive, the publication date, or the native home document.
    for path, month in [('/sample/p/archive/2025/05','05'),('/sample/p/1001','06'),('/sample/tag/','06')]:
        page = site_page(path, routes=missing)
        archive = page.get_by_role('navigation',name='站点导航').get_by_role('link',name='归档',exact=True)
        expect(archive).to_have_attribute('href','/sample/p/archive/2025/' + month)
        archive.click()
        expect(page.locator('#mainContent .entrylistItemTitle').first).to_be_visible()
    # With an empty/inaccessible home there is no month to assert; keep a truthful usable route.
    page = site_page('/sample/tag/', routes={**missing, '/sample/':('text/html; charset=utf-8','<p>还没有文章</p>')})
    expect(page.locator('#home')).to_have_css('opacity','1')
    fallback = page.get_by_role('navigation',name='站点导航').get_by_role('link',name='返回首页',exact=True)
    expect(fallback).to_have_attribute('href','/sample/')
    fallback.click()
    expect(page.get_by_text('还没有文章')).to_be_visible()


def test_shared_keyword_is_only_inferred_as_category_unless_both_post_slots_name_it(site_page):
    import json
    from .site import FIXTURES
    shared = '阅读笔记'
    tags = (FIXTURES / 'tags.html').read_text().replace('>间距<', '>' + shared + '<')
    accessories = json.loads((FIXTURES / 'post-accessories.json').read_text())
    accessories['categoriesTags'] = accessories['categoriesTags'].replace('>排版<','>' + shared + '<').replace('%E6%8E%92%E7%89%88',shared)
    page = site_page(init="""const load=window.fetch; let resume; const wait=new Promise(r=>resume=r);
        window.publishPostSlots=resume; window.fetch=async(...args)=>{
          if(String(args[0]).includes('post-accessories')) await wait; return load(...args); };""",
        routes={'/sample/tag/':('text/html',tags), '/sample/ajax/post-accessories':('application/json',json.dumps(accessories))})
    expect(page.locator('#home')).to_have_css('opacity','1')
    header = page.locator('.postTitle + .ctp-post-meta')
    expect(header).to_have_count(1)
    expect(header).to_contain_text('分钟')
    expect(header.get_by_role('navigation',name='文章分类').get_by_role('link')).to_have_text([shared])
    post_tags = header.get_by_role('navigation',name='文章标签').get_by_role('link')
    expect(post_tags).to_have_text(['排版'])
    page.evaluate('publishPostSlots()')
    expect(post_tags).to_have_text([shared])
    expect(header.get_by_role('navigation',name='文章分类').get_by_role('link')).to_have_text([shared])


def test_image_only_notices_keep_the_safe_image_link_and_fit_inside_rail(site_page):
    import json
    markup = ('<a href="/sample/categories" onclick="return false"><img src="/preview/fixtures/paper.svg" '
              'alt="纸样目录" width="900" height="400" onload="void 0" style="width:900px"></a>'
              '<img alt="无效协议" src="data:text/plain,bad">')
    for options in [dict(init='window.THEME_CONFIG={notice:{html:' + json.dumps(markup) + '}}'),
                    dict(routes={'/sample/ajax/news':('text/html','<div id="sidebar_news_content">' + markup + '</div>')})]:
        page = site_page(HOME, **options)
        notice = page.locator('.ctp-notice')
        link = notice.get_by_role('link',name='纸样目录')
        expect(link).to_be_visible()
        img = link.get_by_role('img')
        expect(img).to_have_attribute('loading','lazy')
        expect(notice.locator('[onclick],[onload],[style],img[alt="无效协议"]')).to_have_count(0)
        assert img.bounding_box()['width'] <= notice.bounding_box()['width']
        link.click()
        expect(page.locator('.category-block-title')).to_be_visible()


def test_archive_parallel_limit_and_clicked_month_priority_survive_retry(site_page):
    import json
    from .site import FIXTURES
    sidebar = json.loads((FIXTURES / 'sidebar-lists.json').read_text())
    sidebar['sideColumn'] = sidebar['sideColumn'].replace('2025年5月(2)</a>', '2025年5月(2)</a>' + ''.join(
        f'</li><li><a href="/sample/p/archive/2025/{n:02}">2025年{n}月(1)</a>' for n in [4,3,2,1]))
    page = site_page('/sample/p/archive/2025/06', viewport={'width':1440,'height':2200},
        routes={'/sample/ajax/sidebar-lists':('application/json',json.dumps(sidebar))},
        init="""const load=window.fetch; window.monthCalls=[]; window.gates={};
          window.fetch=async(href,...rest)=>{
            const m=String(href).match(/archive\\/2025\\/(\\d\\d)$/);
            if(!m) return load(href,...rest);
            monthCalls.push(m[1]); await new Promise(resolve=>gates[m[1]]=resolve);
            if(m[1]==='01' && monthCalls.filter(n=>n==='01').length===1) return new Response('',{status:503});
            return load('/sample/p/archive/2025/05',...rest);
          };""")
    page.wait_for_function('monthCalls.length===3')
    assert page.evaluate('monthCalls') == ['05','04','03']
    page.get_by_role('navigation',name='归档月份').get_by_role('link',name='2025年1月').click()
    page.evaluate("gates['05']()")
    page.wait_for_function('monthCalls.length===4')
    assert page.evaluate('monthCalls[3]') == '01'
    page.evaluate("gates['01']()")
    january = page.get_by_role('region',name='2025年1月')
    january.get_by_role('button',name='重试').click()
    page.evaluate("gates['04']()")
    page.wait_for_function("monthCalls.filter(n=>n==='01').length===2")
    page.evaluate("gates['01']()")
    expect(january.get_by_role('link',name=THIRD,exact=True)).to_be_visible()
