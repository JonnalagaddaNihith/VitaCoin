"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Badge, UserData } from '@/lib/types';
import { getBadges, purchaseBadge, getUserData } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Coins, ShoppingCart, Award, Star, Zap, Crown, Trophy, Target, Sparkles, Gift, Lock } from 'lucide-react';
import { sampleBadges } from '@/scripts/initializeTestData';

const iconMap = {
  coins: Coins,
  award: Award,
  star: Star,
  zap: Zap,
  crown: Crown,
  trophy: Trophy,
  target: Target
};

export function BadgeStore() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        const [badgeData, userDataResult] = await Promise.all([
          getBadges(),
          getUserData(user.uid)
        ]);
        
        // Use sample data if Firebase collection is empty
        const finalBadgeData = badgeData.length > 0 ? badgeData : sampleBadges;
        setBadges(finalBadgeData);
        setUserData(userDataResult);
      } catch (error) {
        console.error('Error fetching badge data:', error);
        // Fallback to sample data on error
        setBadges(sampleBadges);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handlePurchase = async (badgeId: string) => {
    if (!user || !userData) return;
    
    setPurchasing(badgeId);
    try {
      await purchaseBadge(user.uid, badgeId);
      const updatedUserData = await getUserData(user.uid);
      setUserData(updatedUserData);
      
      toast({
        title: "Badge Purchased!",
        description: "You've successfully purchased this badge.",
      });
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to purchase badge.",
        variant: "destructive",
      });
    } finally {
      setPurchasing(null);
    }
  };

  const purchasableBadges = badges?.filter(badge => badge.price && badge.price > 0) || [];
  const achievementBadges = badges?.filter(badge => !badge.price && badge.requirement) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-16 h-16 bg-primary/40 rounded-full animate-ping"></div>
          </div>
          <p className="text-muted-foreground font-medium">Loading badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User's Current Badges */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="relative">
              <Award className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping opacity-75"></div>
            </div>
            Your Badges ({userData?.badges?.length || 0})
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Badges you've earned and purchased - show off your achievements! 🏆
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          {userData?.badges?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userData.badges.map(badgeId => {
                const badge = badges.find(b => b.id === badgeId);
                if (!badge) return null;
                
                const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award;
                
                return (
                  <div key={badgeId} className="group/item text-center p-4 bg-gradient-to-br from-white/50 to-white/30 rounded-xl border border-white/40 hover:border-primary/30 transition-all duration-200 hover:scale-105 hover:shadow-lg">
                    <div className="relative">
                      <IconComponent className={`h-10 w-10 mx-auto mb-3 text-${badge.color}-500 group-hover/item:scale-110 transition-transform duration-200`} />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping opacity-75"></div>
                    </div>
                    <h4 className="font-semibold text-sm text-foreground/90 mb-1">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 bg-secondary/30 rounded-full flex items-center justify-center">
                <Gift className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium mb-2">No badges earned yet</p>
              <p className="text-sm text-muted-foreground">Complete quizzes and maintain streaks to earn badges!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchasable Badges */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-accent/5 shadow-xl shadow-accent/10 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="relative">
              <ShoppingCart className="h-6 w-6 text-accent group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping opacity-75"></div>
            </div>
            Badge Store
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Purchase exclusive badges with your hard-earned coins! 💰
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasableBadges.map(badge => {
              const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award;
              const isOwned = userData?.badges?.includes(badge.id) || false;
              const canAfford = userData && userData.coins >= (badge.price || 0);
              
              return (
                <Card 
                  key={badge.id} 
                  className={`group/item relative overflow-hidden border-0 transition-all duration-300 hover:scale-105 ${
                    isOwned 
                      ? 'bg-gradient-to-br from-green-50 to-green-100 opacity-75' 
                      : 'bg-gradient-to-br from-white/50 to-white/30 hover:shadow-xl'
                  }`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <IconComponent className={`h-16 w-16 mx-auto text-${badge.color}-500 group-hover/item:scale-110 transition-transform duration-200`} />
                        {isOwned && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-foreground/90">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{badge.description}</p>
                      <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                        <Coins className="h-5 w-5 text-primary" />
                        <span className="font-bold text-lg text-primary">{badge.price?.toLocaleString()}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(badge.id)}
                        disabled={isOwned || !canAfford || purchasing === badge.id}
                        className={`w-full h-11 font-semibold transition-all duration-200 ${
                          isOwned 
                            ? 'bg-green-500 hover:bg-green-600 text-white' 
                            : !canAfford 
                              ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed' 
                              : 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30'
                        }`}
                      >
                        {purchasing === badge.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Purchasing...
                          </div>
                        ) : isOwned ? (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Owned
                          </div>
                        ) : !canAfford ? (
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Insufficient Coins
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4" />
                            Purchase
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievement Badges */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="relative">
              <Trophy className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-ping opacity-75"></div>
            </div>
            Achievement Badges
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Earn these prestigious badges by completing challenges and reaching milestones! 🎯
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievementBadges.map(badge => {
              const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award;
              const isOwned = userData?.badges?.includes(badge.id) || false;
              
              return (
                <Card 
                  key={badge.id} 
                  className={`group/item relative overflow-hidden border-0 transition-all duration-300 hover:scale-105 ${
                    isOwned 
                      ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300' 
                      : 'bg-gradient-to-br from-white/50 to-white/30 hover:shadow-xl'
                  }`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <IconComponent className={`h-16 w-16 mx-auto text-${badge.color}-500 group-hover/item:scale-110 transition-transform duration-200`} />
                        {isOwned && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-lg text-foreground/90">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{badge.description}</p>
                      {badge.requirement && (
                        <BadgeUI variant={isOwned ? "default" : "secondary"} className="font-semibold">
                          {badge.requirement.type === 'streak' && `🔥 ${badge.requirement.value} day streak`}
                          {badge.requirement.type === 'perfect' && `⭐ ${badge.requirement.value} perfect scores`}
                          {badge.requirement.type === 'coins' && `💰 ${badge.requirement.value} coins earned`}
                        </BadgeUI>
                      )}
                      {isOwned && (
                        <BadgeUI className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg">
                          ✓ Earned
                        </BadgeUI>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
