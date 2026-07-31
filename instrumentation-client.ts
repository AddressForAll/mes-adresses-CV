// Runs before Next hydrates the page. Keep this file's imports side-effect
// only, and keep the delegation fix first: it has to beat `hydrateRoot`.
import "./src/lib/react-event-delegation-fix";
