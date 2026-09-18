import { redirect } from 'next/navigation';

// 'Beleid' is opgegaan in /informatie als tabblad. Deze route blijft
// bestaan zodat oude links (menu's, bookmarks) blijven werken.
export default function PoliciesRedirect() {
  redirect('/informatie?tab=preventief');
}
