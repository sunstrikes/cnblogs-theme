"""Verify the publisher's CLI using only files delivered to the blog owner."""
import subprocess
import sys

from .site import ROOT


def build(out, *args, script=ROOT / 'scripts/build.py'):
    return subprocess.run([sys.executable, '-I', '-S', str(script), '--out', str(out), *args],
                          capture_output=True, text=True, check=False)


def test_clean_release_contains_both_paste_modes(tmp_path):
    out = tmp_path / 'dist'
    made = build(out)
    assert made.returncode == 0, made.stderr
    assert {p.relative_to(out).as_posix() for p in out.rglob('*') if p.is_file()} == {
        'ctp-docs.css', 'ctp-docs.min.css', 'ctp-docs.js', 'paste/样式.min.css', 'paste/页首.html',
        'fallback/样式-内联备份.css'}
    assert (out/'ctp-docs.min.css').stat().st_size < (out/'ctp-docs.css').stat().st_size
    assert ':root{' in (out/'paste/样式.min.css').read_text()
    assert '--ctp-field:2' in (out/'paste/样式.min.css').read_text()
    assert '--ctp-field:1' in (out/'fallback/样式-内联备份.css').read_text()


def test_check_is_read_only_reproducible_and_rejects_stale_or_missing_bytes(tmp_path):
    out = tmp_path/'dist'
    assert build(out, '--check').returncode != 0
    assert not out.exists()
    assert build(out).returncode == 0
    assert build(out, '--check').returncode == 0
    other = tmp_path/'again'
    assert build(other).returncode == 0
    for path in out.rglob('*'):
        if path.is_file():
            assert path.read_bytes() == (other/path.relative_to(out)).read_bytes()
    field = out/'paste/页首.html'
    field.write_text('changed')
    check = build(out, '--check')
    assert check.returncode != 0 and '页首.html' in check.stderr
    assert field.read_text() == 'changed'


def test_coordinates_select_both_mirrors_and_require_matching_source_versions(tmp_path):
    import re
    import shutil
    out = tmp_path/'dist'
    boot = 'src/js/core/boot.js'
    version = re.search(r'ctp-docs v([\d.]+)', (ROOT/boot).read_text())[1]
    args = ['--repo', 'paper-test/reader', '--version', version, '--ref', 'release-candidate']
    assert build(out, *args).returncode == 0
    head = (out/'paste/页首.html').read_text()
    for host in ['cdn', 'fastly']:
        assert f'https://{host}.jsdelivr.net/gh/paper-test/reader@release-candidate/dist/' in head
    assert build(out, *args, '--check').returncode == 0
    assert build(out, '--version', version + '.0', '--check').returncode != 0
    for part in ['scripts', 'src']:
        shutil.copytree(ROOT/part, tmp_path/part)
    (tmp_path/boot).write_text((ROOT/boot).read_text().replace('ctp-docs v' + version, 'ctp-docs v0.0.1', 1))
    mismatch = build(out, *args, script=tmp_path/'scripts/build.py')
    assert mismatch.returncode != 0 and 'version' in mismatch.stderr.lower()
