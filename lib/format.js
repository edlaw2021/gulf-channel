// Converts a Postgres TIME value ('19:00:00' or '19:00') into a friendly
// 12-hour label ('7pm'), matching how times read in the original mockup —
// dropping the :00 minutes when there aren't any, keeping them when there are.
export function formatTime(t) {
    if (!t) return '';
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, '0')}${period}`;
}

export function formatTimeRange(start, end) {
    return `${formatTime(start)}–${formatTime(end)}`;
}
