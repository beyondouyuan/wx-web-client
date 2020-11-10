export default function gtagEvent(action, {
    category,
    label,
    value
}) {
    return window.gtag ? window.gtag('event', action, {
        'event_category': category,
        'event_label': label,
        'value': value
    }) : null;
}
