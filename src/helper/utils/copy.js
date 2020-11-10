import ClipboardJS from 'clipboard';
import { Toast } from 'zzc-design-mobile';
import { isApp } from './native';


export default function copy(e, text) {
    if (!text) {
        try {
            text = (e.target || e.currentTarget).innerText;
        } catch (error) {
            console.error('无可复制内容');
            return;
        }
    }
    if (isApp()) {
        zzc.call('setNativeClipboard', {
            content: text,
            success: function (response) {
                Toast.info('复制成功', 1);
            }
        });
    } else {
        const clipboard = new ClipboardJS(e.target);
        e.target.setAttribute('data-clipboard-text', text);
        clipboard.on('success', function (e) {
            e.clearSelection();
            Toast.info('复制成功', 1);
            clipboard.destroy();
        });
        e.target.click();
    }
}
