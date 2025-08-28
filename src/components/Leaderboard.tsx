import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserData } from "@/lib/types";
import { Crown, Medal, Trophy, TrendingUp, Coins } from "lucide-react";

type LeaderboardProps = {
  users: UserData[];
  currentUserId?: string;
};

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-6 w-6 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] animate-pulse" />;
  if (rank === 2) return <Trophy className="h-5 w-5 text-accent" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-primary/70" />;
  return <span className="w-5 text-center font-bold text-muted-foreground">{rank}</span>;
};

const getRankBadge = (rank: number) => {
  if (rank === 1) return "bg-gradient-to-r from-primary to-yellow-400 text-primary-foreground";
  if (rank === 2) return "bg-gradient-to-r from-gray-400 to-gray-300 text-white";
  if (rank === 3) return "bg-gradient-to-r from-yellow-700 to-yellow-600 text-white";
  return "bg-secondary text-muted-foreground";
};

export function Leaderboard({ users, currentUserId }: LeaderboardProps) {
  return (
    <Card className="xl:col-span-2 group relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-[1.02]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="relative">
            <Trophy className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping opacity-75"></div>
          </div>
          Leaderboard
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          See who is at the top of their game. Keep climbing to reach the top! 🏆
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-1/4 font-semibold text-foreground/80">Rank</TableHead>
              <TableHead className="w-1/2 font-semibold text-foreground/80">Player</TableHead>
              <TableHead className="w-1/4 text-right font-semibold text-foreground/80">Coins</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user, index) => (
              <TableRow 
                key={`${user.uid}-${index}`} 
                className={`transition-all duration-200 hover:bg-primary/5 ${
                  user.uid === currentUserId 
                    ? "bg-gradient-to-r from-primary/10 to-accent/10 border-l-4 border-l-primary" 
                    : ""
                }`}
              >
                <TableCell>
                  <div className="flex items-center justify-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getRankBadge(index + 1)} shadow-lg`}>
                      {getRankIcon(index + 1)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center ring-2 ring-border/50 group-hover:ring-primary/30 transition-all duration-200 bg-gradient-to-br from-primary/20 to-accent/20">
                      <span className="text-foreground font-semibold text-xl select-none">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground/90 truncate">{user.displayName}</span>
                      {user.uid === currentUserId && (
                        <Badge variant="secondary" className="w-fit text-xs bg-primary/20 text-primary border-primary/30">
                          You
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="font-bold text-foreground/90">{user.coins.toLocaleString()}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Stats Summary */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Total Players: {users.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-accent" />
              <span>Top Score: {users[0]?.coins.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
