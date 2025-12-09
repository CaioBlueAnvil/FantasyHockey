import React, { useState, useMemo, useEffect } from "react";

// ---------------------------
// Design tokens
// ---------------------------
const colors = {
  navy: "#0C2A4A",
  navyDeep: "#091B33",
  steel: "#B7C2D0",
  ice: "#9FD3FF",
  gold: "#D4AF37",
};

// ---------------------------
// Badge SVG Component
// ---------------------------
const Badge = ({ className = "" }) => (
  <svg viewBox="0 0 600 260" className={className}>
    <defs>
      <linearGradient id="glow" x1="0" x2="1">
        <stop offset="0%" stopColor={colors.ice} stopOpacity="0.0" />
        <stop offset="50%" stopColor={colors.ice} stopOpacity="0.6" />
        <stop offset="100%" stopColor={colors.ice} stopOpacity="0.0" />
      </linearGradient>
    </defs>
    <path 
      d="M20,30 L580,30 L560,200 L300,240 L40,200 Z" 
      fill={colors.navyDeep} 
      stroke={colors.gold} 
      strokeWidth="6" 
    />
    <rect x="30" y="42" width="540" height="7" fill="url(#glow)" />
    <text 
      x="50%" 
      y="110" 
      textAnchor="middle" 
      fill={colors.gold} 
      fontWeight="800" 
      fontSize="44" 
      letterSpacing="1.5"
    >
      TLC × BLUE ANVIL
    </text>
    <text 
      x="50%" 
      y="170" 
      textAnchor="middle" 
      fill={colors.gold} 
      fontWeight="700" 
      fontSize="38"
    >
      HOCKEY PICKS
    </text>
  </svg>
);

// ---------------------------
// Reusable Components
// ---------------------------
const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl p-5 shadow-xl border border-white/15 ${className}`}
    style={{ 
      background: `linear-gradient(180deg, ${colors.navy} 0%, ${colors.navyDeep} 100%)`,
      boxShadow: "0 20px 60px rgba(0,0,0,.35)"
    }}
  >
    {children}
  </div>
);

const Pill = ({ children, icon }) => (
  <span 
    className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5" 
    style={{ background: colors.ice, color: colors.navyDeep }}
  >
    {icon && <span>{icon}</span>}
    {children}
  </span>
);

const ProgressBar = ({ value }) => (
  <div className="w-full h-2 rounded-full bg-white/10">
    <div 
      className="h-2 rounded-full transition-all duration-500" 
      style={{ 
        width: `${Math.max(0, Math.min(100, value))}%`, 
        background: colors.gold 
      }} 
    />
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
      active 
        ? "bg-white/15 text-white shadow-lg" 
        : "text-white/75 hover:text-white hover:bg-white/5"
    }`}
    aria-pressed={active}
  >
    {children}
  </button>
);

// ---------------------------
// Mock data (replace with API calls)
// ---------------------------
const mockLeaders = [
  { rank: 1, client: "North Shore GC", site: "Lot A", weekPts: 9.2, month: 33.4, season: 121.7 },
  { rank: 2, client: "Harbour Build", site: "Pier 3", weekPts: 8.6, month: 30.1, season: 118.2 },
  { rank: 3, client: "Cedar + Steel", site: "Block 7", weekPts: 7.9, month: 28.0, season: 109.5 },
  { rank: 4, client: "RidgeWorks", site: "South Yard", weekPts: 7.2, month: 25.2, season: 95.6 },
  { rank: 5, client: "Orca Developments", site: "Cove Rd.", weekPts: 6.8, month: 22.9, season: 90.4 },
  { rank: 6, client: "Cascade Homes", site: "River View", weekPts: 6.3, month: 21.5, season: 87.2 },
  { rank: 7, client: "Summit Builders", site: "Peak Ave", weekPts: 5.9, month: 19.8, season: 82.1 },
  { rank: 8, client: "Bayside Construction", site: "Marina Lot", weekPts: 5.4, month: 18.2, season: 76.3 },
];

const mockGames = [
  { time: "Sat 4:00 PM", home: "Lightning", away: "Panthers", score: "—", status: "scheduled" },
  { time: "Sat 4:00 PM", home: "Ducks", away: "Wild", score: "—", status: "scheduled" },
  { time: "Sat 4:30 PM", home: "Bruins", away: "Canadiens", score: "—", status: "scheduled" },
  { time: "Sat 4:30 PM", home: "Rangers", away: "Blue Jackets", score: "—", status: "scheduled" },
  { time: "Sat 5:00 PM", home: "Oilers", away: "Hurricanes", score: "—", status: "scheduled" },
  { time: "Sat 5:00 PM", home: "Devils", away: "Capitals", score: "—", status: "scheduled" },
  { time: "Sat 6:00 PM", home: "Kings", away: "Senators", score: "—", status: "scheduled" },
  { time: "Sat 6:00 PM", home: "Sabres", away: "Red Wings", score: "—", status: "scheduled" },
  { time: "Sat 7:00 PM", home: "Maple Leafs", away: "Blackhawks", score: "—", status: "scheduled" },
  { time: "Sat 7:00 PM", home: "Golden Knights", away: "Blues", score: "—", status: "scheduled" },
  { time: "Sat 7:30 PM", home: "Flyers", away: "Stars", score: "—", status: "scheduled" },
  { time: "Sat 7:30 PM", home: "Sharks", away: "Kraken", score: "—", status: "scheduled" },
  { time: "Sat 8:00 PM", home: "Jets", away: "Flames", score: "—", status: "scheduled" },
];

const mockMeta = {
  weekNumber: 12,
  lastUpdated: "Monday, Nov 18, 2024 at 9:00 AM",
  prizes: {
    monthly: "Site lunch or jobsite speaker",
    grand: "Houseboat trip for 15",
    tiebreaker: "Guess total score"
  }
};

// ---------------------------
// Main App Component
// ---------------------------
export default function App() {
  // ============================================
  // CONFIGURATION - n8n Backend
  // ============================================
  
  // Your n8n self-hosted URL
  // Change this to your actual n8n server address
  const API_BASE_URL = 'http://YOUR-N8N-SERVER-IP:5678/webhook';
  
  // For production with domain/SSL:
  // const API_BASE_URL = 'https://n8n.yourdomain.com/webhook';
  
  // For local development:
  // const API_BASE_URL = 'http://localhost:5678/webhook';
  
  const [tab, setTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hockeyPicksTab') || 'leaderboard';
    }
    return 'leaderboard';
  });
  
  const [scope, setScope] = useState("Month");
  const [leaders, setLeaders] = useState(mockLeaders);
  const [games, setGames] = useState(mockGames);
  const [meta, setMeta] = useState(mockMeta);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save tab preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hockeyPicksTab', tab);
    }
  }, [tab]);

  // Fetch leaderboard data from n8n
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = `${API_BASE_URL}/leaderboard?scope=${scope.toLowerCase()}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        
        const result = await response.json();
        
        // Handle n8n response format
        if (result.success && result.data) {
          setLeaders(result.data);
          
          // Update meta info if available
          if (result.lastUpdated) {
            setMeta(prev => ({
              ...prev,
              lastUpdated: new Date(result.lastUpdated).toLocaleString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit'
              })
            }));
          }
          
          if (result.weekNumber) {
            setMeta(prev => ({ ...prev, weekNumber: result.weekNumber }));
          }
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data. Showing cached data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchLeaderboard, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [scope]);

  // Fetch games data from n8n
  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Let n8n decide which Saturday to show (no date parameter)
        const url = `${API_BASE_URL}/games`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to fetch games');
        
        const result = await response.json();
        
        // Handle n8n response
        if (result.success && result.games) {
          setGames(result.games);
        }
      } catch (err) {
        console.error('Error fetching games:', err);
        // Keep showing mock data on error
      }
    };

    fetchGames();
    
    // Refresh every 2 minutes during game days
    const interval = setInterval(fetchGames, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [API_BASE_URL]);

  // Fetch meta data from n8n
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/meta`);
        if (!response.ok) throw new Error('Failed to fetch meta');
        
        const result = await response.json();
        
        if (result.success) {
          setMeta({
            weekNumber: result.weekNumber || meta.weekNumber,
            lastUpdated: result.lastUpdated 
              ? new Date(result.lastUpdated).toLocaleString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit'
                })
              : meta.lastUpdated,
            prizes: result.prizes || meta.prizes
          });
        }
      } catch (err) {
        console.error('Error fetching meta:', err);
        // Keep default meta on error
      }
    };

    fetchMeta();
  }, []);

  const sortedLeaders = useMemo(() => {
    return [...leaders].sort((a, b) => {
      const key = scope === "Week" ? "weekPts" : scope === "Month" ? "month" : "season";
      return b[key] - a[key];
    });
  }, [leaders, scope]);

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `radial-gradient(1200px 600px at 70% -10%, ${colors.ice}22, transparent 60%), radial-gradient(900px 500px at -10% 110%, ${colors.ice}22, transparent 60%), linear-gradient(0deg, ${colors.navyDeep}, ${colors.navy})`
      }}
    >
      {/* Navigation */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-black/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center gap-6 flex-wrap">
          <div className="w-48 md:w-64">
            <Badge className="w-full h-auto" />
          </div>
          <nav className="ml-auto flex gap-2">
            <TabButton active={tab === "leaderboard"} onClick={() => setTab("leaderboard")}>
              Leaderboard
            </TabButton>
            <TabButton active={tab === "how"} onClick={() => setTab("how")}>
              How it works
            </TabButton>
            <TabButton active={tab === "games"} onClick={() => setTab("games")}>
              Saturday games
            </TabButton>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-5 pt-10 pb-6">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Hero Content */}
          <Card>
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Pill icon="📦">Delivered Tue</Pill>
              <Pill icon="✅">Picked Up Fri</Pill>
              <Pill icon="🔄">Updated Mondays</Pill>
            </div>
            
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-3" 
              style={{ color: colors.gold }}
            >
              Play. Score. Win big.
            </h1>
            
            <p className="text-white/85 text-base leading-relaxed mb-5">
              <strong>Eligibility:</strong> 5+ timesheets this week or 1 Blue Anvil worker. 
              Circle your Saturday winners. We score using: <em>workers ordered × % correct</em>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Monthly Prize</p>
                <p className="text-white font-semibold text-sm">{meta.prizes.monthly}</p>
              </div>
              <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Grand Prize</p>
                <p className="text-white font-semibold text-sm">{meta.prizes.grand}</p>
              </div>
              <div className="rounded-xl p-4 bg-white/5 border border-white/10">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Tie-breaker</p>
                <p className="text-white font-semibold text-sm">{meta.prizes.tiebreaker}</p>
              </div>
            </div>
          </Card>

          {/* Video Section */}
          <Card className="p-0 overflow-hidden">
            <div className="aspect-video w-full bg-black/40 flex items-center justify-center">
              <video 
                className="w-full h-full object-cover" 
                controls 
                poster=""
                aria-label="How it works - explainer video"
              >
                <source src="/videos/tlc-blueanvil-hockey-picks.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="px-5 py-3 text-white/80 text-sm">
              <strong>Watch:</strong> How it works in 60 seconds
            </div>
          </Card>
        </div>
      </section>

      {/* Main Content Tabs */}
      <main className="max-w-6xl mx-auto px-5 pb-20">
        {/* LEADERBOARD TAB */}
        {tab === "leaderboard" && (
          <Card>
            {loading && (
              <div className="mb-4 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-white text-sm">
                Loading latest data...
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-white text-sm">
                {error} - Showing cached data
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="flex gap-2">
                {["Week", "Month", "Season"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScope(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      scope === s 
                        ? "bg-white/15 text-white" 
                        : "text-white/75 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="ml-auto text-white/70 text-sm">
                Week {meta.weekNumber} • Updated {meta.lastUpdated}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-white/80">
                  <tr>
                    <th className="text-left p-3 font-semibold">Rank</th>
                    <th className="text-left p-3 font-semibold">Client</th>
                    <th className="text-left p-3 font-semibold">Site</th>
                    <th className="text-right p-3 font-semibold">Week pts</th>
                    <th className="text-right p-3 font-semibold">Month</th>
                    <th className="text-right p-3 font-semibold">Season</th>
                    <th className="text-left p-3 font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeaders.map((r, idx) => (
                    <tr 
                      key={r.rank} 
                      className={`text-white transition-colors ${
                        idx < 3 ? 'bg-white/[0.05]' : 'odd:bg-white/[0.02]'
                      } hover:bg-white/[0.08]`}
                    >
                      <td className="p-3">
                        <span className={idx < 3 ? 'font-bold' : ''}>
                          {idx < 3 && ['🥇', '🥈', '🥉'][idx]} {idx + 1}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">{r.client}</td>
                      <td className="p-3 text-white/80">{r.site}</td>
                      <td className="p-3 text-right font-mono">{r.weekPts.toFixed(1)}</td>
                      <td className="p-3 text-right font-mono">{r.month.toFixed(1)}</td>
                      <td className="p-3 text-right font-mono">{r.season.toFixed(1)}</td>
                      <td className="p-3">
                        <ProgressBar value={(r.month / 40) * 100} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-white/60 text-xs">
              <strong>Scoring formula:</strong> Weekly points = workers last week × (correct picks / total Saturday games)
            </div>
          </Card>
        )}

        {/* HOW IT WORKS TAB */}
        {tab === "how" && (
          <Card>
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-4" style={{ color: colors.gold }}>
              How it works
            </h2>
            
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Check eligibility",
                  desc: "You need either 5+ timesheets this week OR 1 Blue Anvil worker on site."
                },
                {
                  step: "2",
                  title: "Receive your card",
                  desc: "We deliver cards to eligible sites every Tuesday."
                },
                {
                  step: "3",
                  title: "Make your picks",
                  desc: "Circle winners for all Saturday games (listed on the card's back). Don't forget the tie-breaker: guess the total score!"
                },
                {
                  step: "4",
                  title: "Return your card",
                  desc: "Hand in your completed card by Friday. No late entries accepted."
                },
                {
                  step: "5",
                  title: "Watch & win",
                  desc: "Games play on Saturday. We score Monday using: workers ordered × % correct. Leaderboard updates with weekly, monthly, and season totals."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/10">
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: colors.gold, color: colors.navyDeep }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className="text-white font-semibold mb-2">Prize Structure</h3>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• <strong>Monthly winner:</strong> {meta.prizes.monthly}</li>
                <li>• <strong>Season champion:</strong> {meta.prizes.grand}</li>
                <li>• <strong>Tie-breaker:</strong> {meta.prizes.tiebreaker}</li>
              </ul>
            </div>
          </Card>
        )}

        {/* SATURDAY GAMES TAB */}
        {tab === "games" && (
          <Card>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <h2 className="text-white text-2xl font-bold">Saturday games</h2>
              <div className="ml-auto text-white/70 text-sm">
                All times local • Live scores update automatically
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {games.map((g, i) => (
                <div 
                  key={i} 
                  className="rounded-xl p-4 bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white/70 text-xs font-semibold">{g.time}</div>
                    <div 
                      className={`text-xs px-2 py-0.5 rounded ${
                        g.status === 'live' 
                          ? 'bg-red-500 text-white' 
                          : g.status === 'final'
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {g.status === 'live' ? '● LIVE' : g.status === 'final' ? 'FINAL' : 'UPCOMING'}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-white font-semibold">
                      {g.away} <span className="text-white/50">@</span> {g.home}
                    </div>
                    <div className="text-white/90 font-mono font-semibold text-lg">
                      {g.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/80 text-sm">
                <strong>Tip:</strong> Pick all games before Friday's deadline. The more workers you order, the higher your potential score!
              </p>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-3 gap-8 items-start text-white/80">
          <div>
            <Badge className="w-56 mb-3" />
            <p className="text-sm leading-relaxed">
              TLC × Blue Anvil Hockey Picks. A weekly on-site game for construction clients. 
              Circle Saturday winners, return by Friday, and climb the leaderboard.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-3">Prizes</h3>
            <ul className="text-sm space-y-2">
              <li>🏆 <strong>Monthly:</strong> {meta.prizes.monthly}</li>
              <li>🎉 <strong>Grand:</strong> {meta.prizes.grand}</li>
              <li>🎯 <strong>Tie-breaker:</strong> {meta.prizes.tiebreaker}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <button 
                  onClick={() => setTab('leaderboard')} 
                  className="hover:underline hover:text-white transition"
                >
                  View Leaderboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setTab('how')} 
                  className="hover:underline hover:text-white transition"
                >
                  How it works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setTab('games')} 
                  className="hover:underline hover:text-white transition"
                >
                  Saturday games
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-5 mt-8 pt-6 border-t border-white/10 text-center text-white/60 text-xs">
          <p>© 2024 TLC × Blue Anvil Hockey Picks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}