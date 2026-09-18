import { redirect } from 'next/navigation';

// De clubrecords zijn opgegaan in /statistieken als tabblad. Deze route
// blijft bestaan zodat oude links (menu's, bookmarks) blijven werken.
export default function ClubrecordsRedirect() {
  redirect('/statistieken?tab=clubrecords');
}
