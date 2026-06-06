import { useI18n } from '../../i18n';
import type { Mandir } from '../../lib/types';

const dayKeysHi: Record<string, string> = {
  monday: 'सोमवार', tuesday: 'मंगलवार', wednesday: 'बुधवार',
  thursday: 'गुरुवार', friday: 'शुक्रवार', saturday: 'शनिवार', sunday: 'रविवार',
};
const dayKeysEn: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

export function TimingTable({ mandir }: { mandir: Mandir }) {
  const { locale } = useI18n();
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const labels = locale === 'hi' ? dayKeysHi : dayKeysEn;

  return (
    <div className="overflow-x-auto rounded-lg border border-cream-dark">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-maroon text-white">
          <tr>
            <th className="px-4 py-2.5 font-semibold">{locale === 'hi' ? 'दिन' : 'Day'}</th>
            <th className="px-4 py-2.5 font-semibold">{locale === 'hi' ? 'दर्शन समय' : 'Darshan Timing'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cream-dark bg-white">
          {days.map((d) => (
            <tr key={d}>
              <td className="px-4 py-2.5 font-medium text-maroon">{labels[d]}</td>
              <td className="px-4 py-2.5 text-ink-soft">{mandir.weeklyTiming[d]?.[locale] || mandir.darshanTimingSummary[locale]}</td>
            </tr>
          ))}
          {mandir.specialOccasions && (
            <tr className="bg-saffron-50">
              <td className="px-4 py-2.5 font-bold text-saffron-700">{locale === 'hi' ? 'विशेष' : 'Special'}</td>
              <td className="px-4 py-2.5 text-ink">{mandir.specialOccasions[locale]}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
