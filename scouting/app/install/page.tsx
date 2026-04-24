"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  Share,
  MoreHorizontal,
  Chrome,
  Globe,
} from "lucide-react"

export default function InstallPage() {
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | "unknown">("unknown")

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios")
    else if (/android/.test(ua)) setPlatform("android")
    else setPlatform("desktop")
  }, [])

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Install RoboScout</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Install this app on your device to use it offline, from your home screen, and without a browser bar.
        </p>
        {platform !== "unknown" && (
          <Badge variant="secondary" className="mt-2 capitalize">
            Detected: {platform}
          </Badge>
        )}
      </div>

      {/* ── iPhone / iPad ─────────────────────────────────────── */}
      <Card className={platform === "ios" ? "ring-2 ring-blue-500" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Smartphone className="h-5 w-5" />
            iPhone / iPad (Safari)
            {platform === "ios" && <Badge className="text-xs bg-blue-500">Your device</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Step n={1}>
            Open this page in <strong>Safari</strong> (not Chrome or Firefox — iOS only supports PWA install from Safari).
          </Step>
          <Step n={2}>
            Tap the <strong>Share button</strong>{" "}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
              <Share className="h-3 w-3" /> Share
            </span>{" "}
            at the bottom of the screen (the box with an arrow pointing up).
          </Step>
          <Step n={3}>
            Scroll down in the share sheet and tap{" "}
            <strong className="font-semibold">"Add to Home Screen"</strong>.
          </Step>
          <Step n={4}>
            Tap <strong>Add</strong> in the top-right. The RoboScout icon will appear on your home screen.
          </Step>
          <Step n={5}>
            Open the app from the home screen icon. On first launch while online, the app will automatically cache all
            data for offline use.
          </Step>
          <Notice>
            If you see a "Not Installable" message, make sure you are opening the live deployed URL (not localhost) and
            that you are using Safari.
          </Notice>
        </CardContent>
      </Card>

      {/* ── Android ───────────────────────────────────────────── */}
      <Card className={platform === "android" ? "ring-2 ring-green-500" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Smartphone className="h-5 w-5" />
            Android (Chrome)
            {platform === "android" && <Badge className="text-xs bg-green-500">Your device</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Step n={1}>
            Open this page in <strong>Chrome</strong> on your Android phone.
          </Step>
          <Step n={2}>
            Look for the <strong>"Add to Home screen"</strong> banner that Chrome shows automatically at the bottom of
            the screen. Tap it.
          </Step>
          <Step n={3}>
            If the banner does not appear, tap the{" "}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
              <MoreHorizontal className="h-3 w-3" /> Menu
            </span>{" "}
            (three dots, top-right) and select <strong>"Add to Home screen"</strong> or{" "}
            <strong>"Install app"</strong>.
          </Step>
          <Step n={4}>
            Tap <strong>Install</strong> in the dialog. The app opens in its own window without the browser bar.
          </Step>
          <Step n={5}>
            On first launch while online, the app automatically syncs and caches all data from the remote database.
          </Step>
          <Notice>
            Samsung Internet browser also supports PWA install — tap the menu and look for "Add page to" or "Install as
            web app".
          </Notice>
        </CardContent>
      </Card>

      {/* ── Desktop ───────────────────────────────────────────── */}
      <Card className={platform === "desktop" ? "ring-2 ring-purple-500" : ""}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Monitor className="h-5 w-5" />
            Windows / Mac / Linux (Chrome or Edge)
            {platform === "desktop" && <Badge className="text-xs bg-purple-500 text-white">Your device</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Step n={1}>
            Open this page in <strong>Chrome</strong> or <strong>Microsoft Edge</strong>.
          </Step>
          <Step n={2}>
            In the address bar, look for the{" "}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
              <Chrome className="h-3 w-3" /> Install
            </span>{" "}
            icon (a screen with a down-arrow) on the right side. Click it.
          </Step>
          <Step n={3}>
            If not visible, click the{" "}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-muted rounded text-xs font-mono">
              <MoreHorizontal className="h-3 w-3" /> Menu
            </span>{" "}
            and choose <strong>"Install RoboScout…"</strong> or <strong>"Apps &gt; Install this site as an app"</strong>
            .
          </Step>
          <Step n={4}>Click <strong>Install</strong>. The app opens as a standalone window.</Step>
        </CardContent>
      </Card>

      {/* ── Running locally on your own computer ─────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-5 w-5" />
            Run on Your Own Computer (self-hosted)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Follow these steps to run the full app locally with your own database.
          </p>

          <div className="space-y-4">
            <Section title="1. Prerequisites">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Node.js 18 or newer — download from <code className="code">nodejs.org</code></li>
                <li>Git — download from <code className="code">git-scm.com</code></li>
                <li>A free Supabase account — <code className="code">supabase.com</code></li>
              </ul>
            </Section>

            <Section title="2. Clone the repository">
              <CodeBlock>{`git clone https://github.com/eldad10/scouting.git
cd scouting/scouting`}</CodeBlock>
            </Section>

            <Section title="3. Install dependencies">
              <CodeBlock>{`npm install`}</CodeBlock>
            </Section>

            <Section title="4. Set up Supabase environment variables">
              <p className="text-muted-foreground mb-2">
                Create a file named <code className="code">.env.local</code> in the{" "}
                <code className="code">scouting/</code> folder with:
              </p>
              <CodeBlock>{`NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY`}</CodeBlock>
              <p className="text-muted-foreground mt-2">
                Get these from your Supabase project under <strong>Settings &gt; API</strong>.
              </p>
            </Section>

            <Section title="5. Create the database tables">
              <p className="text-muted-foreground mb-2">
                In Supabase, open the <strong>SQL Editor</strong> and run the following. This creates all required
                tables including <code className="code">team_info</code>:
              </p>
              <CodeBlock>{`-- Teams
create table if not exists teams (
  teamnumber text primary key,
  teamname text not null
);

-- Scouting forms
create table if not exists forms (
  id serial primary key,
  scoutername text,
  matchnumber integer,
  teamnumber text references teams(teamnumber),
  auto_balls text,
  auto_climb boolean default false,
  auto_labels text,
  teleop_balls text,
  teleop_climb_level integer default 0,
  defence_rating integer default 0,
  delivery_rating integer default 0,
  teleop_labels text,
  comments text,
  created_at timestamptz default now()
);

-- Robot intelligence / team info
create table if not exists team_info (
  team_number text primary key references teams(teamnumber),
  shooter_type text,
  shooter_width text,
  shooting_position text,
  shooting_description text,
  delivery_rating integer default 0,
  defence_rating integer default 0,
  speed_balance_rating integer default 0,
  advantages text,
  disadvantages text,
  additional_info text,
  statbotics_rank int
  updated_at timestamptz default now()
);`}</CodeBlock>
            </Section>

            <Section title="6. Start the development server">
              <CodeBlock>{`npm run dev`}</CodeBlock>
              <p className="text-muted-foreground mt-2">
                Open <code className="code">http://localhost:3000</code> in your browser.
              </p>
            </Section>

            <Section title="7. Build and run for production (optional)">
              <CodeBlock>{`npm run build
npm start`}</CodeBlock>
            </Section>
          </div>
        </CardContent>
      </Card>

      {/* ── How offline works ─────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <WifiOff className="h-5 w-5" />
            How Offline Works
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-1 gap-3">
            <InfoRow icon={<Database className="h-4 w-4 text-blue-500" />} label="Local database">
              All teams, forms and rankings are stored locally on your device using IndexedDB (via Dexie.js). The data
              survives app restarts and browser closes.
            </InfoRow>
            <Separator />
            <InfoRow icon={<WifiOff className="h-4 w-4 text-amber-500" />} label="While offline">
              You can browse all cached data (teams, forms, rankings, statistics) and submit new scouting forms. New
              forms are saved locally and marked as pending.
            </InfoRow>
            <Separator />
            <InfoRow icon={<Wifi className="h-4 w-4 text-green-500" />} label="When back online">
              The app automatically detects the connection, pushes all pending forms to the remote database, and pulls
              any new data added by other scouts. A sync banner appears at the top if manual sync is needed.
            </InfoRow>
            <Separator />
            <InfoRow icon={<RefreshCw className="h-4 w-4 text-purple-500" />} label="Manual sync">
              Go to the <strong>Offline Viewer</strong> page and tap <strong>Sync Now</strong> at any time while online
              to force a full push + pull cycle.
            </InfoRow>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Small helper sub-components ────────────────────────────────────────────

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold mt-0.5">
        {n}
      </span>
      <p className="leading-relaxed">{children}</p>
    </div>
  )
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-semibold mb-1">{title}</p>
      {children}
    </div>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-muted rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre leading-relaxed">
      {children}
    </pre>
  )
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="font-semibold capitalize mb-0.5">{label}</p>
        <p className="text-muted-foreground leading-relaxed">{children}</p>
      </div>
    </div>
  )
}
