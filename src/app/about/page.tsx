import { redirect } from 'next/navigation';

// 'Over ons' is opgegaan in /informatie als tabblad. Deze route blijft
// bestaan zodat oude links (menu's, bookmarks) blijven werken.
export default function AboutRedirect() {
  redirect('/informatie?tab=wie');
}
