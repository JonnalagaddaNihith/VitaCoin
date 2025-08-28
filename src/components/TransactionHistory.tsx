import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Transaction } from "@/lib/types";
import { History, ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, Coins, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

type TransactionHistoryProps = {
  transactions: Transaction[];
};

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const totalCredits = transactions
    .filter(tx => tx.type === 'credit')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalDebits = transactions
    .filter(tx => tx.type === 'debit')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <Card className="group relative h-full flex flex-col overflow-hidden border-0 bg-gradient-to-br from-card via-card to-accent/5 shadow-xl shadow-accent/10 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 hover:scale-[1.02]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-xl font-bold">
          <div className="relative">
            <History className="h-6 w-6 text-accent group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping opacity-75"></div>
          </div>
          Transaction History
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          A detailed log of your recent coin activity and earnings.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative z-10 flex-1 flex flex-col p-0">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-b border-primary/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-muted-foreground">Total Earned</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {transactions
                .filter(tx => tx.type === 'credit')
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Quizzes: {transactions
                .filter(tx => tx.type === 'credit' && tx.category === 'quiz')
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Bonuses: {transactions
                .filter(tx => tx.type === 'credit' && tx.category === 'bonus')
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium text-muted-foreground">Total Spent</span>
            </div>
            <div className="text-lg font-bold text-red-600">
              {transactions
                .filter(tx => tx.type === 'debit')
                .reduce((sum, tx) => sum + tx.amount, 0)
                .toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Badges: {transactions
                .filter(tx => tx.type === 'debit' && tx.category === 'badge')
                .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
                .toLocaleString()}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground">Penalties</span>
            </div>
            <div className="text-lg font-bold text-amber-600">
              {transactions
                .filter(tx => tx.type === 'debit' && tx.category === 'penalty')
                .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)
                .toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {transactions.filter(tx => tx.category === 'penalty').length} incidents
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full w-full">
          {transactions.length > 0 ? (
            transactions.map((tx, index) => (
              <div key={tx.id} className="group/item">
                <div className="flex items-center gap-4 py-3 px-2 rounded-lg transition-all duration-200 hover:bg-secondary/50 group-hover/item:bg-secondary/30">
                  <div className={`p-2 rounded-full ${
                    tx.type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowUpCircle className="h-5 w-5" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="grid gap-1 flex-1">
                    <p className="text-sm font-semibold leading-none text-foreground/90">{tx.description}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {formatDistanceToNow(tx.timestamp.toDate(), { addSuffix: true })}
                    </p>
                  </div>
                  <div className={`font-bold text-lg ${
                    tx.type === 'credit' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()}
                  </div>
                </div>
                {index < transactions.length - 1 && (
                  <Separator className="mx-2 bg-border/50" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/30 rounded-full flex items-center justify-center">
                <Coins className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-1">Complete quizzes to start earning coins!</p>
            </div>
          )}
          </ScrollArea>
        </div>
        
        {/* Quick Actions */}
        {transactions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total Transactions: {transactions.length}</span>
              <span className="text-primary font-medium">
                Net: {totalCredits - totalDebits > 0 ? '+' : ''}{(totalCredits - totalDebits).toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
