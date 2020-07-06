
const leagueDivisionHelpers = {
    getPlayerDivisionStats: (player, playerDivisionMatches) => {
        const stats = {
            completedMatches: 0,
            points: 0,
            wins: 0,
            draws: 0,
            loses: 0,
            scoredGoals: 0,
            concededGoals: 0,
            goalDifference: 0,
        }

        const setStats = (win, draw) => {
            stats.points += win ? 3 : draw ? 1 : 0;
            stats.wins += win ? 1 : 0;
            stats.draws += draw ? 1 : 0;
            stats.loses += (!win && !draw) ? 1 : 0;
        }

        playerDivisionMatches.map(match => {
            if(match.scored_goals_player1 && match.scored_goals_player2){

                stats.completedMatches += 1;

                if(match.idPlayer1 == player.id){
                    const win = match.scored_goals_player1 > match.scored_goals_player2;
                    const draw = match.scored_goals_player1 == match.scored_goals_player2;
                    setStats(win, draw);
                    stats.scoredGoals += match.scored_goals_player1;
                    stats.concededGoals += match.scored_goals_player2;
                } else {
                    const win = match.scored_goals_player2 > match.scored_goals_player1;
                    const draw = match.scored_goals_player2 == match.scored_goals_player1;
                    setStats(win, draw);
                    stats.scoredGoals += match.scored_goals_player2;
                    stats.concededGoals += match.scored_goals_player1;
                }
            }
        });

        stats.goalDifference = stats.scoredGoals - stats.concededGoals;

        return stats;
    }

}

module.exports = leagueDivisionHelpers;