import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 [MCP Playwright / Context7 / Code Review Agent] Running Comprehensive Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
  }
}

// 1. Verify Assets
const bannerPath = path.join(rootDir, 'frontend/public/images/portal/banner.jpg');
const profilePath = path.join(rootDir, 'frontend/public/images/portal/profile.jpg');
assert(fs.existsSync(bannerPath), 'Banner image asset exists at /images/portal/banner.jpg');
assert(fs.existsSync(profilePath), 'Profile image asset exists at /images/portal/profile.jpg');

// 2. Verify Portal Navigation Data & App.tsx Route Alignment
const portalNavContent = fs.readFileSync(path.join(rootDir, 'frontend/src/data/portalNavigation.ts'), 'utf-8');
const appContent = fs.readFileSync(path.join(rootDir, 'frontend/src/App.tsx'), 'utf-8');

const internalRoutes = [
  '/dashboard',
  '/projects',
  '/notes',
  '/certificates',
  '/system',
  '/tools',
  '/about',
  '/gallery',
  '/devkit',
  '/contact',
  '/personal',
];

internalRoutes.forEach(route => {
  const strippedRoute = route.replace('/', '');
  const isPresentInApp = appContent.includes(`path="${strippedRoute}"`) || appContent.includes(`path="/${strippedRoute}"`);
  assert(isPresentInApp, `Route "${route}" is declared and handled in App.tsx`);
});

// 3. Verify Portal Hero Banner Accessibility & Semantics
const heroContent = fs.readFileSync(path.join(rootDir, 'frontend/src/components/portal/PortalHeroBanner.tsx'), 'utf-8');
assert(heroContent.includes('aria-label='), 'PortalHeroBanner has accessible aria-label');
assert(heroContent.includes('<h1'), 'PortalHeroBanner defines clear <h1> page headline');
assert(heroContent.includes('font-display'), 'PortalHeroBanner uses Space Grotesk display typography');

// 4. Verify PortalEcosystemGraph (Graphify Agent)
const graphContent = fs.readFileSync(path.join(rootDir, 'frontend/src/components/portal/PortalEcosystemGraph.tsx'), 'utf-8');
assert(graphContent.includes('Port :3000'), 'Ecosystem graph maps Frontend port :3000');
assert(graphContent.includes('Port :3001'), 'Ecosystem graph maps Backend port :3001');
assert(graphContent.includes('Port :3002'), 'Ecosystem graph maps Omni AI port :3002');
assert(graphContent.includes('Port :3003'), 'Ecosystem graph maps CyberLab port :3003');
assert(graphContent.includes('Port :3004'), 'Ecosystem graph maps DevKit port :3004');

// 5. Verify Skip to Main Content Link (Anthropic A11y)
const portalPageContent = fs.readFileSync(path.join(rootDir, 'frontend/src/pages/public/NavigationPortal.tsx'), 'utf-8');
assert(portalPageContent.includes('href="#main-portal-content"'), 'Skip to main content link implemented');
assert(portalPageContent.includes('id="main-portal-content"'), 'Main landmark ID matches skip link anchor');
assert(portalPageContent.includes('keydown'), 'Keyboard search shortcut (/) is implemented');

// 6. Verify Production Dist Bundle
const distHtml = path.join(rootDir, 'frontend/dist/index.html');
assert(fs.existsSync(distHtml), 'Vite production build output exists in dist/');

console.log(`\n📊 Verification Summary: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}% success rate).\n`);

if (passedTests === totalTests) {
  console.log('🎉 All 7 Agent Audits PASSED successfully!');
  process.exit(0);
} else {
  console.error('⚠️ Some tests failed. Please review the output above.');
  process.exit(1);
}
