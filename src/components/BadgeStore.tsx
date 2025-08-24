"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Badge, UserData } from '@/lib/types';
import { getBadges, purchaseBadge, getUserData } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge as BadgeUI } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Coins, ShoppingCart, Award, Star, Zap, Crown, Trophy, Target } from 'lucide-react';
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
    return <div className="flex justify-center p-8">Loading badges...</div>;
  }

  return (
    <div className="space-y-6">
      {/* User's Current Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Badges ({userData?.badges?.length || 0})
          </CardTitle>
          <CardDescription>Badges you've earned and purchased</CardDescription>
        </CardHeader>
        <CardContent>
          {userData?.badges?.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userData.badges.map(badgeId => {
                const badge = badges.find(b => b.id === badgeId);
                if (!badge) return null;
                
                const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award;
                
                return (
                  <div key={badgeId} className="text-center p-4 border rounded-lg">
                    <IconComponent className={`h-8 w-8 mx-auto mb-2 text-${badge.color}-500`} />
                    <h4 className="font-semibold text-sm">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">No badges earned yet. Complete quizzes and maintain streaks to earn badges!</p>
          )}
        </CardContent>
      </Card>

      {/* Purchasable Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Badge Store
          </CardTitle>
          <CardDescription>Purchase badges with your coins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchasableBadges.map(badge => {
              const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award;
              const isOwned = userData?.badges?.includes(badge.id) || false;
              const canAfford = userData && userData.coins >= (badge.price || 0);
              
              return (
                <Card key={badge.id} className={isOwned ? 'opacity-50' : ''}>
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <IconComponent className={`h-12 w-12 mx-auto text-${badge.color}-500`} />
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      <div className="flex items-center justify-center gap-1">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">{badge.price}</span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(badge.id)}
                        disabled={isOwned || !canAfford || purchasing === badge.id}
                        className="w-full"
                        variant={isOwned ? "secondary" : "default"}
                      >
                        {purchasing === badge.id ? 'Purchasing...' : 
                         isOwned ? 'Owned' : 
                         !canAfford ? 'Insufficient Coins' : 'Purchase'}
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievement Badges
          </CardTitle>
          <CardDescription>Earn these badges by completing challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievementBadges.map(badge => {
              const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Award;
              const isOwned = userData?.badges?.includes(badge.id) || false;
              
              return (
                <Card key={badge.id} className={isOwned ? 'border-green-500' : 'border-muted'}>
                  <CardContent className="p-4">
                    <div className="text-center space-y-2">
                      <IconComponent className={`h-12 w-12 mx-auto text-${badge.color}-500`} />
                      <h3 className="font-semibold">{badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                      {badge.requirement && (
                        <BadgeUI variant={isOwned ? "default" : "secondary"}>
                          {badge.requirement.type === 'streak' && `${badge.requirement.value} day streak`}
                          {badge.requirement.type === 'perfect' && `${badge.requirement.value} perfect scores`}
                          {badge.requirement.type === 'coins' && `${badge.requirement.value} coins earned`}
                        </BadgeUI>
                      )}
                      {isOwned && (
                        <BadgeUI className="bg-green-500 text-white">
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
