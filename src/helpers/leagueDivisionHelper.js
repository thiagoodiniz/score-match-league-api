
const leagueDivisionHelpers = {
    getPlayerDivisionPoints: (player, playerDivisionMatches) => {
        return playerDivisionMatches.reduce((prev, current) => {
            if(current.idPlayer1 == player.id_player){
               return current.scored_goals_player1 > current.scored_goals_player2 
                    ? prev + 3
                    : current.scored_goals_player1 == current.scored_goals_player2
                      ? prev + 1
                      : prev;
            } else {
                return current.scored_goals_player2 > current.scored_goals_player1
                    ? prev + 3
                    : current.scored_goals_player2 == current.scored_goals_player1
                    ? prev + 1
                    : prev;
            }
        },0);
    }

}

module.exports = leagueDivisionHelpers;