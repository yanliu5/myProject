/**
 * Created by admin on 15-03-05.
 */

$(document).ready(function(){
    var statsX = 10;
    var statsY1 = -150;
    var statsY2 = -150;
    var statsY3 = -150;
    var statsY4 = -150;
    var statsY5 = -150;
    var statsY6 = -150;
    var statsY7 = -150;
    var statsY8 = -150;
    var statsY9 = -150;
    var statsY0 = -150;

    $('#msg' ).hide();
    $('.separateLine' ).hide();
    var count_load_rank = 0;
    var count_disable_sumbit = 0;
    var opts = {
        lines: 11, // 花瓣数目
        length: 8, // 花瓣长度
        width: 2, // 花瓣宽度
        radius: 10, // 花瓣距中心半径
        corners: 1, // 花瓣圆滑度 (0-1)
        rotate: 0, // 花瓣旋转角度
        direction: 1, // 花瓣旋转方向 1: 顺时针, -1: 逆时针
        color: '#000', // 花瓣颜色
        speed: 1, // 花瓣旋转速度
        trail: 60, // 花瓣旋转时的拖影(百分比)
        shadow: false, // 花瓣是否显示阴影
        hwaccel: false, //spinner 是否启用硬件加速及高速旋转
        className: 'spinner', // spinner css 样式名称
        zIndex: 2e9, // spinner的z轴 (默认是2000000000)
        top: '40%', // spinner 相对父容器Top定位 单位 px
        left: '50%'// spinner 相对父容器Left定位 单位 px
    };

    var spinner = new Spinner(opts);

    var localUrl = 'http://localhost:22000';

    function setTable(team, player, obj) {
        if (obj == undefined) {obj = {}};
        obj.championIcon = '#p_s_t'+team+'_p'+player+'_championIcon';
        obj.spell = '#p_s_t'+team+'_p'+player+'_spell';
        obj.champion = '#p_s_t'+team+'_p'+player+'_champion';
        obj.name = '#p_s_t'+team+'_p'+player+'_name';
        obj.mmr = '#p_s_t'+team+'_p'+player+'_mmr';
        obj.league = '#p_s_t'+team+'_p'+player+'_league';
        obj.winLoss = '#p_s_t'+team+'_p'+player+'_winLoss';
        obj.KDA = '#p_s_t'+team+'_p'+player+'_KDA';
        obj.runes = '#p_s_t'+team+'_p'+player+'_runes';
        obj.mastery = '#p_s_t'+team+'_p'+player+'_mastery';
        obj.last10matches = '#p_s_t'+team+'_p'+player+'_last10matches';

        return obj;
    }

    var grid_team1_player1 = setTable(1,1);
    var grid_team1_player2 = setTable(1,2);
    var grid_team1_player3 = setTable(1,3);
    var grid_team1_player4 = setTable(1,4);
    var grid_team1_player5 = setTable(1,5);

    var grid_team2_player1 = setTable(2,1);
    var grid_team2_player2 = setTable(2,2);
    var grid_team2_player3 = setTable(2,3);
    var grid_team2_player4 = setTable(2,4);
    var grid_team2_player5 = setTable(2,5);

    var t1_p1_runes = [];
    var t1_p2_runes = [];
    var t1_p3_runes = [];
    var t1_p4_runes = [];
    var t1_p5_runes = [];
    var t2_p1_runes = [];
    var t2_p2_runes = [];
    var t2_p3_runes = [];
    var t2_p4_runes = [];
    var t2_p5_runes = [];

    var t1_p1_stats = [];
    var t1_p2_stats = [];
    var t1_p3_stats = [];
    var t1_p4_stats = [];
    var t1_p5_stats = [];
    var t2_p1_stats = [];
    var t2_p2_stats = [];
    var t2_p3_stats = [];
    var t2_p4_stats = [];
    var t2_p5_stats = [];

    var t1_p1_stats_output = {str:'loading'};
    var t1_p2_stats_output = {str:'loading'};
    var t1_p3_stats_output = {str:'loading'};
    var t1_p4_stats_output = {str:'loading'};
    var t1_p5_stats_output = {str:'loading'};
    var t2_p1_stats_output = {str:'loading'};
    var t2_p2_stats_output = {str:'loading'};
    var t2_p3_stats_output = {str:'loading'};
    var t2_p4_stats_output = {str:'loading'};
    var t2_p5_stats_output = {str:'loading'};

    $('#btn_hello' ).click(function(){
        var url = localUrl;
        $.ajax({
            type: 'GET',
            url: url ,
            success: function(result) {
                var path = '';
                var str = '';
                var catStr = '';
                var finalStr = '';
                for (var i in result) {
                    var name = result[i].replace(/\s+/g,"");
                    path = "resources/4.4.3/img/champion/" + name + "\.png";
                    str = "<img src=" + path + ">";
                    catStr = catStr + str;
                    finalStr = "<p>"+catStr+"</p>";
                }
                $( '#p_s_champs' ).html(finalStr);
            },
            error: function(jqXHR, status, error){
                $('#p_s_hello' ).append('hello world failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>');
            }
        });
    });


    function getSummonerInfo(inObj) {
        $.ajax({
            type: 'GET',
            url: localUrl + '/summoner/id',
            data: inObj,
            success: function(result) {
                if (result.ret == 1) {
                    $('#p_s_feedbackInfo' ).append('Summoner does not exist');
                    spinner.stop();
                    recover();
                } else {
                    var name = fixName(inObj.summonerName);
                    name = name.toLowerCase();
                    idObj.summonerId = result[name].id;
                    getSummonerCurrentGame(idObj);
                }
            },
            error: function(jqXHR, status, error){
                spinner.stop();
                $('#p_s_feedbackInfo' ).append('get summoner id info failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>'+'Try to refresh and check again');
            }
        });
    }

    function getSummonerCurrentGame(idObj) {
        $.ajax({
            type: 'GET',
            url: localUrl + '/summoner/currentgame' ,
            data: idObj,
            success: function(result) {
                if (result.ret == 1) {spinner.stop();$('#p_s_feedbackInfo' ).html(result.result);recover();}

                else {
                    getSummonersByTeam( result.participants, function (team1, team2) {

                        getTheRestData(team1 ,  team2);

                    });
                }


            },
            error: function(jqXHR, status, error){
                spinner.stop();
                $('#p_s_feedbackInfo' ).append('from 1st key..get summoner info failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>'+'Try to refresh and check again');
            }
        });
    }


    function getSoloRecord(idObj, table) {

        $.ajax({
            type: 'GET',
            url: localUrl + '/summoner/solo_record' ,
            data: idObj,
            success: function(result) {
                var tierPath = "../tier/";
                if (result.ret == 1) {
                    var fileName = "unknown.png";
                } else {
                    var fileName = result.tier + "_" + result.entries[0].division+".png";
                }
                var tierFile = tierPath+fileName;
                if (result.ret != 1) {
                    $( table.league ).html("<img src="+tierFile+" align='middle' width='33' height='33'/> "+result.tier + " " + result.entries[0].division+" ("+result.entries[0].leaguePoints+")");
                    $( table.winLoss ).html(result.entries[0].wins + "/" + result.entries[0].losses);
                } else {
                    $( table.league ).html("<img src="+tierFile+" align='middle' width='33' height='33'/> "+"UNRANKED");
                    $( table.winLoss ).html("0/0");
                }
            },
            error: function(jqXHR, status, error){
                spinner.stop();
                $('#p_s_feedbackInfo' ).append('get ranked solo failed, '+ jqXHR +'/'+ status +'/'+ error);
            }
        });
    }

    function getSoloRecord_2(idObj, table) {

        $.ajax({
            type: 'GET',
            url: localUrl + '/summoner/solo_record_2' ,
            data: idObj,
            success: function(result) {
                var tierPath = "../tier/";
                if (result.ret == 1) {
                    var fileName = "unknown.png";
                } else {
                    var fileName = result.tier + "_" + result.entries[0].division+".png";
                }
                var tierFile = tierPath+fileName;
                if (result.ret != 1) {
                    $( table.league ).html("<img src="+tierFile+" align='middle' width='35' height='35'/> "+result.tier + " " + result.entries[0].division+" ("+result.entries[0].leaguePoints+")");
                    $( table.winLoss ).html(result.entries[0].wins + "/" + result.entries[0].losses);
                } else {
                    $( table.league ).html("<img src="+tierFile+" align='middle' width='35' height='35'/> "+"UNRANKED");
                    $( table.winLoss ).html("0/0");
                }
            },
            error: function(jqXHR, status, error){
                spinner.stop();
                $('#p_s_feedbackInfo' ).append('get ranked solo failed, '+ jqXHR +'/'+ status +'/'+ error);
            }
        });
    }



    function getRank(idObj, table, team) {
        if (team == 'team1') {
            getSoloRecord(idObj, table);
        }
        if (team == 'team2') {
            getSoloRecord_2(idObj, table);
        }
    }

    function getTeamRecord(idObj) {

        $.ajax({
            type: 'GET',
            url: localUrl + '/team/rank_record' ,
            data: idObj,
            success: function(result) {
                $( '#p_s_showData' ).html(JSON.stringify(result));
            },
            error: function(jqXHR, status, error){
                $('#p_s_feedbackInfo' ).append('get team rank record failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>');
            }
        });
    }

    function getMatch(idObj) {

        $.ajax({
            type: 'GET',
            url: localUrl + '/match' ,
            data: idObj,
            success: function(result) {
                $( '#p_s_showData' ).html(JSON.stringify(result));
            },
            error: function(jqXHR, status, error){
                $('#p_s_feedbackInfo' ).append('get team rank record failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>');
            }
        });
    }

    function getTeamBySummonerId(idObj) {

        $.ajax({
            type: 'GET',
            url: localUrl + '/team/by_summoner_id' ,
            data: idObj,
            success: function(result) {
                $( '#p_s_showData' ).html(JSON.stringify(result));
            },
            error: function(jqXHR, status, error){
                $('#p_s_feedbackInfo' ).append('get team id info failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>');
            }
        });
    }

    function getChampionById(idObj, table) {

        getChampionFromFile(idObj.championId, function(champion) {
            var nameToFix = champion.name.toString();
            nameToFix = fixChampionName(nameToFix);
	        var championName = fixName(nameToFix);

            if (championName == 'Wukong') {championName = 'MonkeyKing';} //wukong's icon file name
            if (championName == 'Fiddlesticks') {championName = 'FiddleSticks';} //fiddle's icon file name
            if (championName == 'LeBlanc') {championName = 'Leblanc';} //Leblanc's icon file name
            if (championName == 'Dr. Mundo') {championName = 'DrMundo';}
            if (championName == 'ChoGath') {championName = 'Chogath';}
            if (championName == 'KhaZix') {championName = 'Khazix';}

            $( table.champion ).html(championName);
            var getFromFile = true; // not getting from local file
            if (getFromFile == true) {
                var championIconPath = "'../resources/5.5.2/img/champion/";
                var fileName = championName + ".png'";
                var iconUrl = championIconPath + fileName;
            } else {
                championName = championName.charAt(0)+championName.substr(1 ).toLowerCase();
                var iconUrl = 'http://ddragon.leagueoflegends.com/cdn/5.2.2/img/champion/'+championName+'.png';
            }
            var htmlCode = "<img src="+iconUrl+" width='40' height='40'/>";

            $( table.championIcon ).html(htmlCode);
            count_load_rank++;
            check_load_rank();
        });
    }

    function fixChampionName(name) {
        if (name == 'Wukong') {name = 'MonkeyKing';} //wukong's icon file name
        if (name == 'Fiddlesticks') {name = 'FiddleSticks';} //fiddle's icon file name
        if (name == 'LeBlanc') {name = 'Leblanc';} //Leblanc's icon file name
        if (name == 'Dr. Mundo') {name = 'DrMundo';}
        if (name == 'ChoGath') {name = 'Chogath';}
        if (name == 'KhaZix') {name = 'Khazix';}

        return name;
    }

    function drawSpellIcon(spell1Id, spell2Id, table) {

        getSpellFromFile(spell1Id, function(spell) {
            var nameToFix = spell.id.toString();
            var spellName = fixName(nameToFix);
            var championIconPath = "'../resources/5.5.2/img/spell/";
            var fileName = spellName + ".png'";
            var iconUrl = championIconPath + fileName;
            var htmlCode = "<img src="+iconUrl+" width='20' height='20'/>";

            $( table.spell ).append(htmlCode);

            getSpellFromFile(spell2Id, function(spell) {
                var nameToFix = spell.id.toString();
                var spellName = fixName(nameToFix);
                var championIconPath = "'../resources/5.5.2/img/spell/";
                var fileName = spellName + ".png'";
                var iconUrl = championIconPath + fileName;
                var htmlCode = "<img src="+iconUrl+" width='20' height='20'/>";

                $( table.spell ).append(htmlCode);

            });

        });
    }



    function getRankStats(idObj, championId, table) {
        $.ajax({
            type: 'GET',
            url: localUrl + '/rank/stats' ,
            data: idObj,
            success: function(result) {
                if (result.ret == 1) {
                    $( table.KDA ).html("unknown");
                    $( table.champion ).append(" (0)");
                } else {
                    calculateKDA(championId, result, function(averageKDA, seasonStats) {
                        $( table.KDA ).html(averageKDA);
                        $( table.champion ).append(seasonStats.toString());
                    })
                }
                count_disable_sumbit++;
                check_disable_submit();
            },
            error: function(jqXHR, status, error){
                $('#p_s_feedbackInfo' ).append('get rank info failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>');
            }
        });
    }

    function getMMR(nameObj,table) {
        $.ajax({
            type: 'GET',
            url: localUrl + '/mmr' ,
            data: nameObj,
            success: function(result) {
                if (result.error != true) {
                    $( table.mmr ).html(result.mmr);
                } else {
                    $( table.mmr ).html("unknown");
                }
            },
            error: function(jqXHR, status, error){
                $('#p_s_feedbackInfo' ).append('get mmr failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>');
            }
        });
    }

    function getPlayerSummary(idObj) {

        $.ajax({
            type: 'GET',
            url: localUrl + '/summoner/summary' ,
            data: idObj,
            success: function(result) {
                $( '#p_s_showData' ).html(JSON.stringify(result));
            },
            error: function(jqXHR, status, error){
                $('#p_s_feedbackInfo' ).append('get player summary failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>');
            }
        });
    }

    function getMatchHistory(idObj, table, stats, output) {

        $.ajax({
            type: 'GET',
            url: localUrl + '/summoner/matchHistory' ,
            data: idObj,
            success: function(result) {
                if (result.ret == 1) {
                    $('#p_s_feedbackInfo' ).append('get match history failed, possibly service is down' + '<br>');
                } else {
                    analysisMatchHistory(result, function(winner_count, loser_count) {
                        var output = winner_count + "/" + loser_count;
                        $(table.last10matches ).html(output);
                    })
                    if (stats) {makeStatsData(result.matches, stats, output);}
                }
            },
            error: function(jqXHR, status, error){
                $('#p_s_feedbackInfo' ).append('get match history failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>');
            }
        });
    }

    function check_load_rank() {
        if (count_load_rank == 1) {
            spinner.stop();
            $('#msg' ).show();
            $('#rankTable' ).show();
            $('.separateLine' ).show();
        }
        else {
            setTimeout(function(){
               check_load_rank();
            },2000)
        }
    }

    function check_disable_submit() {
        if (count_disable_sumbit == 10) {
            recover();
            count_disable_sumbit = 0;
        }
    }

    function calculateKDA(championId, data, callback) {
        var exist = false;
        var thisChampion = {};
        var gamePlayed = 0;
        var totalKill = 0;
        var totalDeath = 0;
        var totalAssist = 0;
        var averageKDA = '';

        for (var i in data) {
            if (championId == data[i].id) {
                exist = true;
                thisChampion = data[i];
            }
        }
        if (exist == false) {
            var averageKDA = 'unknown';
            var seasonStats = ' (0)';
            callback(averageKDA, seasonStats);
            return;
        };

        gamePlayed = Number(thisChampion.stats.totalSessionsPlayed);
        totalKill = Number(thisChampion.stats.totalChampionKills);
        totalDeath = Number(thisChampion.stats.totalDeathsPerSession);
        totalAssist = Number(thisChampion.stats.totalAssists);
        averageKDA = (totalKill/gamePlayed).toFixed(1) + "/" + (totalDeath/gamePlayed).toFixed(1) + "/" + (totalAssist/gamePlayed).toFixed(1);

        var seasonWon = Number(thisChampion.stats.totalSessionsWon);
        var seasonLoss = Number(thisChampion.stats.totalSessionsLost);
        var wonPlusLoss = seasonWon+seasonLoss;
        var winRate = (seasonWon/(seasonWon+seasonLoss)).toFixed(2);
        var winRateOut = '';
        if (winRate > 0 && winRate < 1) {winRateOut = winRate.slice(2,4);}
	    if (winRate == 1) {winRateOut = '100';}
        if (seasonWon == 0) {winRateOut = '0';}
        var seasonStats = " " + winRateOut + "% ("+wonPlusLoss+")";

        callback(averageKDA, seasonStats);
    }

    function analysisMatchHistory(data, callback) {
        var winner_count = 0;
        var loser_count = 0;
        for (var i in data.matches) {
            if (data.matches[i].participants[0].stats.winner) {
                winner_count++;
            }
            else {loser_count++;};
        }
        callback(winner_count, loser_count);
    }


    var idObj = {};
    $('#btn_getGame' ).click(function() {
        $('#btn_getGame').val( 'searching..' );
        $('#btn_getGame').attr('disabled' , 'disabled' );
        clearFiled();
        clearTable();
        $('#rankTable' ).hide();
        var target = document.getElementById('p_s_spinner');
        spinner.spin(target);

        $('#p_s_champion_name' ).html('Champion');
        $('#p_s_summoner_name' ).html('Summoner');
        $('#p_s_summoner_mmr' ).html('MMR');
        $('#p_s_summoner_league' ).html('League');
        $('#p_s_summoner_winLoss' ).html('W/L');
        $('#p_s_champion_kda' ).html('KDA');
        $('#p_s_runes' ).html('Runes');
        $('#p_s_last10matches' ).html('Last-10-games');
        $('#p_s_mastery' ).html('Mastery');

        for (var i=1;i<3;i++) {
            for (var j=1;j<6;j++) {
                var fieldName = '#p_s_t'+i+'_p'+j+'_runes';
                $(fieldName ).html('<img style="position: relative; left: 2px" src="http://ddragon.leagueoflegends.com/cdn/5.2.2/img/rune/8001.png" align="middle" width="30" height="30"/>');
            }
        }
        var inObj = {
            summonerName: $('#ipt_gameStatsSearch' ).val()
        }

        // Retrieve summoner info
        getSummonerInfo(inObj);
    });



    $('#btn_getMMR' ).click(function(){
        var inObj = {
            summonerName: $('#ipt_MMR' ).val()
        }

        $.ajax({
            type: 'GET',
            url: localUrl + '/mmr',
            data: inObj ,
            success: function(result) {
                if (result.error == true) {$( '#p_s_showMMR' ).html("Your MMR is undetermined, you may not have played enough rank games recently");}
                else {$( '#p_s_showMMR' ).html("Your MMR is: " + "<b>"+result.mmr+"</b>");}
            },
            error: function(jqXHR, status, error){
                $('#p_s_feedbackInfo' ).append('get mmr failed, ret = ' + status + ', status = ' + jqXHR.status + '<br>');
            }
        });
    });

    $('#btn_show' ).click(function(){
        $('#rankTable').toggle();

    });

    $("#ipt_gameStatsSearch").keydown(function() {
        if (event.keyCode == "13") {
            if ($('#btn_getGame' ).attr('disabled') != 'disabled') {
                $('#btn_getGame').click();
            }
        }
    });
    $("#ipt_MMR").keydown(function() {
        if (event.keyCode == "13") {
            $('#btn_getMMR').click();
        }
    });

    function clearFiled() {
        count_load_rank = 0;
        $('#p_s_feedbackInfo' ).html('');
        $('#p_s_showData' ).html('');
        $('#p_s_mmr' ).html('');
        $('#p_s_idData' ).html('');
        $('#p_s_outputData' ).html('');
        $('#msg' ).hide();
        $('.separateLine' ).hide();
    }

    function getChampionFromFile(championId, callback) {
        var champion = {};
        $.getJSON('../resources/5.5.2/data/en_US/champion.json', function(result){
            var championList = result.data;
            for (var i in championList) {
                if (championList[i].key == championId) {
                    champion = championList[i];
                    break;
                }
            }
            callback(champion);
        });
    }

    function getSpellFromFile(spellId, callback) {
        var spell = {};
        $.getJSON('../resources/5.5.2/data/en_US/summoner.json', function(result){
            var spellList = result.data;
            for (var i in spellList) {
                if (spellList[i].key == spellId) {
                    spell = spellList[i];
                    break;
                }
            }
            callback(spell);
        });
    }

    function fixName(name){
        var removeSpace = name.replace(/\s+/g,"");
        var removeUpperDot= removeSpace.replace("'","");
        var removeDot= removeUpperDot.replace("'","");
        return removeDot;
    }

    function getMastery(playerMasteryList, table) {
        var mastery = classifyMastery(playerMasteryList);
        $( table.mastery ).html(mastery);
    }

    function classifyMastery(playerMasteryList) {
        var offense = 0;
        var defense = 0;
        var util = 0;
        for (var i in playerMasteryList) {
            var masteryId = playerMasteryList[i].masteryId;
            var masteryIdNumber = Number(masteryId);
            if (masteryIdNumber > 4100 && masteryIdNumber < 4200) {offense = offense + Number(playerMasteryList[i].rank);}
            if (masteryIdNumber > 4200 && masteryIdNumber < 4300) {defense = defense + Number(playerMasteryList[i].rank);}
            if (masteryIdNumber > 4300) {util = util + Number(playerMasteryList[i].rank);}
        }
        var output = offense+'/'+defense+'/'+util;
        return output;
    }


    function clearTable() {
        clearRows( grid_team1_player1);
        clearRows( grid_team1_player2);
        clearRows( grid_team1_player3);
        clearRows( grid_team1_player4);
        clearRows( grid_team1_player5);

        clearRows( grid_team2_player1);
        clearRows( grid_team2_player2);
        clearRows( grid_team2_player3);
        clearRows( grid_team2_player4);
        clearRows( grid_team2_player5);

        t1_p1_runes = [];
        t1_p2_runes = [];
        t1_p3_runes = [];
        t1_p4_runes = [];
        t1_p5_runes = [];
        t2_p1_runes = [];
        t2_p2_runes = [];
        t2_p3_runes = [];
        t2_p4_runes = [];
        t2_p5_runes = [];
    }

    function clearRows(obj) {
        $(obj.championIcon).html('');
        $(obj.spell).html('');
        $(obj.champion).html('');
        $(obj.name).html('');
        $(obj.mmr).html('');
        $(obj.league).html('');
        $(obj.winLoss).html('');
        $(obj.KDA).html('');
        $(obj.last10matches).html('');
        $(obj.mastery).html('');
    }


    function recover() {
        $('#btn_getGame').val('Search');
        $('#btn_getGame').removeAttr('disabled');
    }

    //------------------------------------------------- Individual stats ------------------------------------------------------

    function getEachMatchInfo(data) {
        var stats = {
            championId : data.championId,
            winner : data.stats.winner,
            kill : data.stats.kills,
            death : data.stats.deaths,
            assist : data.stats.assists
        }
        return stats;
    }

    function makeStatsData(data, field, output) {
        $.getJSON('../resources/5.5.2/data/en_US/champion.json', function(result){
            var championList = result.data;
            for (var j in data) {
                for (var i in championList) {
                    var championId = data[j].participants[0].championId;
                    var stats = data[j].participants[0].stats;
                    if (championList[i].key == championId) {
                        var nameToFix = championList[i].name.toString();
                        nameToFix = fixChampionName(nameToFix);
                        var championName = fixName(nameToFix);

                        if (championName == 'Wukong') {championName = 'MonkeyKing';} //wukong's icon file name
                        if (championName == 'Fiddlesticks') {championName = 'FiddleSticks';} //fiddle's icon file name
                        if (championName == 'LeBlanc') {championName = 'Leblanc';} //Leblanc's icon file name
                        if (championName == 'Dr. Mundo') {championName = 'DrMundo';}
                        if (championName == 'ChoGath') {championName = 'Chogath';}
                        if (championName == 'KhaZix') {championName = 'Khazix';}

                        var getFromFile = true; // not getting from local file
                        if (getFromFile == true) {
                            var championIconPath = "'../resources/5.5.2/img/champion/";
                            var fileName = championName + ".png'";
                            var iconUrl = championIconPath + fileName;
                        } else {
                            championName = championName.charAt(0)+championName.substr(1 ).toLowerCase();
                            var iconUrl = 'http://ddragon.leagueoflegends.com/cdn/5.2.2/img/champion/'+championName+'.png';
                        }
                        var htmlCode = "<img src="+iconUrl+" width='30' height='30'/>";
                        if (stats.winner == true) {var bgColor = '#CEF6D8';}
                        else {var bgColor = '#F5A9BC';}
                        if (stats.item0 != 0) {var i0 = '<img src="../resources/5.5.2/img/item/'+stats.item0+'.png" align="middle" width="20" height="20">';} else {i0 = ''}
                        if (stats.item1 != 0) {var i1 = '<img src="../resources/5.5.2/img/item/'+stats.item1+'.png" align="middle" width="20" height="20">';} else {i1 = ''}
                        if (stats.item2 != 0) {var i2 = '<img src="../resources/5.5.2/img/item/'+stats.item2+'.png" align="middle" width="20" height="20">';} else {i2 = ''}
                        if (stats.item3 != 0) {var i3 = '<img src="../resources/5.5.2/img/item/'+stats.item3+'.png" align="middle" width="20" height="20">';} else {i3 = ''}
                        if (stats.item4 != 0) {var i4 = '<img src="../resources/5.5.2/img/item/'+stats.item4+'.png" align="middle" width="20" height="20">';} else {i4 = ''}
                        if (stats.item5 != 0) {var i5 = '<img src="../resources/5.5.2/img/item/'+stats.item5+'.png" align="middle" width="20" height="20">';} else {i5 = ''}
                        field[j] = '<p style="font-size: 70%;border-radius:5px; filter: alpha+(Opacity=80);-moz-opacity:0.8; opacity:2; cellspacing:0px; line-height: 8px; padding: 5px; margin: 5px;height: 40; test-align: center; background-color: '+bgColor+'">' + htmlCode + '&nbsp;' + stats.kills + '/' + stats.deaths + '/' + stats.assists + '&nbsp;'+i0+i1+i2+i3+i4+i5+ '</p>';
                    }
                }
                if (j == data.length-1) {
                    extractStats(field , output);
                }
            }
        });
    }

    function extractStats(field, output) {
        output.str = '';
        for (var i in field) {
            output.str = output.str+field[9-i];
        }
    }


    $('#p_s_t1_p1_name').mouseover(function(e) {
        if (t1_p1_stats_output.str == 'loading') {statsY0 = 0} else {statsY0 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t1_p1_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY0) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });

    $('#p_s_t1_p2_name').mouseover(function(e) {
        if (t1_p2_stats_output.str == 'loading') {statsY1 = 0} else {statsY1 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t1_p2_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY1) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });

    $('#p_s_t1_p3_name').mouseover(function(e) {
        if (t1_p3_stats_output.str == 'loading') {statsY2 = 0} else {statsY2 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t1_p3_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY2) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });

    $('#p_s_t1_p4_name').mouseover(function(e) {
        if (t1_p4_stats_output.str == 'loading') {statsY3 = 0} else {statsY3 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t1_p4_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY3) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });

    $('#p_s_t1_p5_name').mouseover(function(e) {
        if (t1_p5_stats_output.str == 'loading') {statsY4 = 0} else {statsY4 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t1_p5_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY4) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });

    $('#p_s_t2_p1_name').mouseover(function(e) {
        if (t2_p1_stats_output.str == 'loading') {statsY5 = 0} else {statsY5 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t2_p1_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY5) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });

    $('#p_s_t2_p2_name').mouseover(function(e) {
        if (t2_p2_stats_output.str == 'loading') {statsY6 = 0} else {statsY6 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t2_p2_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY6) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });

    $('#p_s_t2_p3_name').mouseover(function(e) {
        if (t2_p3_stats_output.str == 'loading') {statsY7 = 0} else {statsY7 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t2_p3_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY7) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });

    $('#p_s_t2_p4_name').mouseover(function(e) {
        if (t2_p4_stats_output.str == 'loading') {statsY8 = 0} else {statsY8 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t2_p4_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY8) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });

    $('#p_s_t2_p5_name').mouseover(function(e) {
        if (t2_p5_stats_output.str == 'loading') {statsY9 = 0} else {statsY9 = -150}
        var statsPage = "<div id='individualStats' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + t2_p5_stats_output.str  + "</div>";

        $("body").append(statsPage);
        $("#individualStats").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#individualStats' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#individualStats').css({
            "top" :(e.pageY+statsY9) + "px",
            "left" :(e.pageX+statsX) + "px"
        });
    }).mouseout(function() {
        $("#individualStats").remove();
    });


    //------------------------------------------------------ Runes ----------------------------------------------------------------------


    function extractRunes(playerObj, playerRuneStorage) {
        var runesObj = playerObj.runes;
        $.getJSON('../resources/5.5.2/data/en_US/rune.json', function(result){
            var runesList = result.data;
            for (var i in runesObj) {
                for (var j in runesList) {
                    if (Number(runesObj[i].runeId) == Number(j)) {
                        var count = runesObj[i].count;
                        var outputStr = analysisRunes(count, runesList[j]);
                        playerRuneStorage.push(outputStr+"<br>");
                    }
                }
            }
            integrateRunes(playerRuneStorage);
        });
    }

    function analysisRunes(count, runeObj) {
        var runeTotalValue = 0;
        var description = runeObj.description;
        for (var i in runeObj.stats) {
            runeTotalValue = Number(runeObj.stats[i]) * count;
        }
        if (description.indexOf('%') != -1) {
            var percentage = true;
            runeTotalValue = runeTotalValue * 100;
        }
        var prefix = '+';
        if (description.indexOf('-') != -1) {prefix = '-'}
        runeTotalValue = Number(runeTotalValue).toFixed(2);
        if (description.indexOf('regen') != -1) {runeTotalValue = (runeTotalValue * 4.5).toFixed(2); var regen = true;}
        if (description.indexOf('per level') == -1) {
            if (description.indexOf('Armor Penetration') != -1 && description.indexOf('Magic Penetration') != -1) {
                var midPoint = description.indexOf('/');
                var firstHalf = description.substring(0,midPoint);
                var secondHalf = description.substring(midPoint);
                var firstNumber = description.substring(0, description.indexOf(' Armor Penetration'));
                var secondNumber = description.substring(midPoint+2, description.indexOf(' Magic Penetration'));
                firstNumber = Number(firstNumber) * count;
                var firstPiece = prefix+firstNumber+description.substring(description.indexOf(' '), midPoint+2);
                secondNumber = Number(secondNumber) * count;
                secondNumber = secondNumber.toFixed(2);
                var secondPiece = secondNumber+' Magic Penetration';
                var output = firstPiece+secondPiece;
                return output;
            } else {
                var postfix = description.substr(description.indexOf(' '));
                if (runeTotalValue < 0) {
                    prefix = '';
                }
                if (percentage == true) {runeTotalValue = runeTotalValue + '%';}
                var output = prefix+runeTotalValue+' '+postfix;
                return output;
            }
        } else {
            var secondPoint = description.indexOf(' at champion level 18)');
            var firstPoint = description.indexOf(' ');
            var firstBracket = description.indexOf('(');
            var firstPiece = description.substring(firstPoint, firstBracket);
            var secondPiece = description.substr(secondPoint);
            var secondHalf = description.substr(firstPoint);
            var secondPlusSign = secondHalf.indexOf(prefix);

            if (runeTotalValue < 0) {
                prefix = '';
            }
            if (percentage == true) {
                runeTotalValue = runeTotalValue + '%';
                var valueAt18 = (Number(description.substring(firstBracket+1, secondPoint-1)) * count).toFixed(2);
                if (regen == true) {valueAt18 = (valueAt18 * 0.9).toFixed(2)}
                var outputScale = prefix+runeTotalValue+' '+firstPiece+'('+valueAt18+'%'+secondPiece;
            } else {
                var valueAt18 = (Number(description.substring(firstBracket+1, secondPoint)) * count).toFixed(2);
                if (regen == true) {valueAt18 = (valueAt18 * 0.9).toFixed(2)}
                var outputScale = prefix+runeTotalValue+' '+firstPiece+'('+valueAt18+secondPiece;
            }
            return outputScale;
        }
    }

    function fixRuneOutput(runeArray) {
        var output = '';
        for (var i in runeArray) {
            var str = runeArray[i].toString();
            output = output + str;
        }
        return output;
    }

    function integrateRunes(runeArray) {
        for (var i in runeArray) {
            for (var j in runeArray) {
                if (i != j) {
                    var point1 = runeArray[i].indexOf(' ');
                    var point2 = runeArray[j].indexOf(' ');
                    var one = runeArray[i].substr(point1);
                    var two = runeArray[j].substr(point2)
                    if (one == two) {
                        var val1 = runeArray[i].substring(0, point1);
                        var val2 = runeArray[j].substring(0, point2);
                        if (val1.indexOf('%') != -1 && val2.indexOf('%') != -1) {
                            var percentage = true;
                            val1 = val1.substring(0, val1.length-2);
                            val2 = val2.substring(0, val2.length-2);
                        }
                        if (val1.indexOf('+') != -1) {
                            var plus = true;
                        } else {
                            var plus = false;
                        }

                        if (j>i) {
                            var newVal = Number(val1)+Number(val2);
                            newVal = newVal.toFixed(2);
                            if (percentage == true) {
                                newVal = newVal+'%';
                            }
                            if (plus == true) {
                                var newStr = '+'+newVal+one;
                            } else {
                                var newStr = '-'+newVal+one;
                            }
                            runeArray[i] = newStr;
                            runeArray.splice(j , 1);
                        }
                        else {
                            var newVal = Number(val1)+Number(val2);
                            newVal = newVal.toFixed(2);
                            if (percentage == true) {
                                newVal = newVal+'%';
                            }
                            if (plus == true) {
                                var newStr = '+'+newVal+one;
                            } else {
                                var newStr = '-'+newVal+one;
                            }
                            runeArray[j] = newStr;
                            runeArray.splice(i , 1);
                        }

                    }
                }
            }
        }
        for (var i in runeArray) {
            for (var j in runeArray) {
                if (i != j && runeArray[i].indexOf('Armor') != -1 && runeArray[i].indexOf('Magic') != -1 && runeArray[j].indexOf('Armor') != -1 && runeArray[j].indexOf('Magic') != -1) {
                    if (i<j) {var S = i; var L = j;}
                    else {var S = j; var L = i;}
                    var P1 = runeArray[S].substring(0, runeArray[S].indexOf('/')+2);
                    var P2 = runeArray[S].substring(runeArray[S].indexOf('/')+2);
                    var N1 = P1.substring(0, P1.indexOf(' '));
                    var N2 = P2.substring(0, P2.indexOf(' '));
                    var P3 = runeArray[L].substring(0, runeArray[L].indexOf('/')+2);
                    var P4 = runeArray[L].substring(runeArray[L].indexOf('/')+2);
                    var N3 = P3.substring(0, P3.indexOf(' '));
                    var N4 = P4.substring(0, P4.indexOf(' '));
                    var V1 = (Number(N1)+Number(N3)).toFixed(2);
                    var V2 = (Number(N2)+Number(N4)).toFixed(2);
                    var P1_withoutNumber = P1.substring(P1.indexOf(' '), P1.indexOf('/')+2);
                    var P2_withoutNumber = P2.substring(P2.indexOf(' '));
                    var case1output = '+'+V1+P1_withoutNumber+V2+P2_withoutNumber;
                    if (j>i) {
                        runeArray[i] = case1output;
                        runeArray.splice(j , 1);
                    } else {
                        runeArray[j] = case1output;
                        runeArray.splice(i , 1);
                    }
                }
            }
        }
        for (var i in runeArray) {
            for (var j in runeArray) {
                    if (i != j && runeArray[i].indexOf('level 18') != -1 && runeArray[i].substring(runeArray[i].indexOf(' '), runeArray[i].indexOf( 'per level' ) ) == runeArray[j].substring(runeArray[j].indexOf(' ') , runeArray[j].indexOf( 'per level' ) ) ) {
                        var val1 = runeArray[i].substring(0, runeArray[i].indexOf(' '));
                        var val2 = runeArray[j].substring(0, runeArray[j].indexOf(' '));
                        var val3 = runeArray[i].substring(runeArray[i].indexOf('(')+1,runeArray[i].indexOf(' at champion level 18'));
                        var val4 = runeArray[j].substring(runeArray[j].indexOf('(')+1,runeArray[j].indexOf(' at champion level 18'));
                        var newVal1 = Number(val1)+Number(val2);
                        var newVal2 = Number(val3)+Number(val4);
                        newVal1 = newVal1.toFixed(2);
                        newVal2 = newVal2.toFixed(2);
                        var midPiece = runeArray[i].substring(runeArray[i].indexOf(' '), runeArray[i].indexOf('(')+1);
                        var newStr = '+'+newVal1+midPiece+newVal2+' at champion level 18)<br>';
                        if (j>i) {
                            runeArray[i] = newStr;
                            runeArray.splice(j , 1);
                        } else {
                            runeArray[j] = newStr;
                            runeArray.splice(i , 1);
                        }
                    }

            }
        }
    }


    $('#p_s_t1_p1_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t1_p1_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });

    $('#p_s_t1_p2_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t1_p2_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });

    $('#p_s_t1_p3_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t1_p3_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });

    $('#p_s_t1_p4_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t1_p4_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });

    $('#p_s_t1_p5_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t1_p5_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });




    $('#p_s_t2_p1_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t2_p1_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });

    $('#p_s_t2_p2_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t2_p2_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });

    $('#p_s_t2_p3_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t2_p3_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });

    $('#p_s_t2_p4_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t2_p4_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });

    $('#p_s_t2_p5_runes').mouseover(function(e) {

        var toolTip = "<div id='runesInfo' width='5rem' height='3rem' style='position:absolute;border:solid #aaa 1px;background-color:#F9F9F9'>" + fixRuneOutput(t2_p5_runes)  + "</div>";

        $("body").append(toolTip);
        $("#runesInfo").css({
            "top" :e.pageY + "px",
            "left" :e.pageX + "px"
        });
        $('#runesInfo' ).css({
            "padding": 5+"px",
            "filter":"alpha"+(Opacity=80),
            "-moz-opacity":0.5,
            "opacity": 0.8
        });
    }).mousemove(function(e) {
        $('#runesInfo').css({
            "top" :(e.pageY-30) + "px",
            "left" :(e.pageX+10) + "px"
        });
    }).mouseout(function() {
        $("#runesInfo").remove();
    });


    //------------------------------------------------------- fill out table -----------------------------------------------------

    function getTheRestData(team1, team2){
        $( grid_team1_player1.name ).html( team1[0].summonerName );
        getMMR( {summonerName : team1[0].summonerName} , grid_team1_player1 );
        getChampionById( {championId : team1[0].championId} , grid_team1_player1 );
        drawSpellIcon(team1[0].spell1Id ,team1[0].spell2Id,  grid_team1_player1 );
        getMastery(team1[0].masteries, grid_team1_player1);
        getRank( {summonerId : team1[0].summonerId} , grid_team1_player1 , 'team1');
        getRankStats({summonerId : team1[0].summonerId}, team1[0].championId, grid_team1_player1);
        getMatchHistory({summonerId: team1[0].summonerId}, grid_team1_player1, t1_p1_stats, t1_p1_stats_output);
        extractRunes(team1[0], t1_p1_runes);

        $( grid_team1_player2.name ).html( team1[1].summonerName );
        getMMR( {summonerName : team1[1].summonerName} , grid_team1_player2 );
        getChampionById( {championId : team1[1].championId} , grid_team1_player2 );
        drawSpellIcon(team1[1].spell1Id ,team1[1].spell2Id,  grid_team1_player2 );
        getMastery(team1[1].masteries, grid_team1_player2);
        getRank( {summonerId : team1[1].summonerId} , grid_team1_player2 , 'team1');
        getRankStats({summonerId : team1[1].summonerId}, team1[1].championId, grid_team1_player2);
        getMatchHistory({summonerId: team1[1].summonerId}, grid_team1_player2, t1_p2_stats, t1_p2_stats_output);
        extractRunes(team1[1], t1_p2_runes);

        $( grid_team1_player3.name ).html( team1[2].summonerName );
        getMMR( {summonerName : team1[2].summonerName} , grid_team1_player3 );
        getChampionById( {championId : team1[2].championId} , grid_team1_player3 );
        drawSpellIcon(team1[2].spell1Id ,team1[2].spell2Id,  grid_team1_player3 );
        getMastery(team1[2].masteries, grid_team1_player3);
        getRank( {summonerId : team1[2].summonerId} , grid_team1_player3 , 'team1');
        getRankStats({summonerId : team1[2].summonerId}, team1[2].championId, grid_team1_player3);
        getMatchHistory({summonerId: team1[2].summonerId}, grid_team1_player3, t1_p3_stats, t1_p3_stats_output);
        extractRunes(team1[2], t1_p3_runes);

        $( grid_team1_player4.name ).html( team1[3].summonerName );
        getMMR( {summonerName : team1[3].summonerName} , grid_team1_player4 );
        getChampionById( {championId : team1[3].championId} , grid_team1_player4 );
        drawSpellIcon(team1[3].spell1Id ,team1[3].spell2Id,  grid_team1_player4 );
        getMastery(team1[3].masteries, grid_team1_player4);
        getRank( {summonerId : team1[3].summonerId} , grid_team1_player4 , 'team1');
        getRankStats({summonerId : team1[3].summonerId}, team1[3].championId, grid_team1_player4);
        getMatchHistory({summonerId: team1[3].summonerId}, grid_team1_player4, t1_p4_stats, t1_p4_stats_output);
        extractRunes(team1[3], t1_p4_runes);

        $( grid_team1_player5.name ).html( team1[4].summonerName );
        getMMR( {summonerName : team1[4].summonerName} , grid_team1_player5 );
        getChampionById( {championId : team1[4].championId} , grid_team1_player5 );
        drawSpellIcon(team1[4].spell1Id ,team1[4].spell2Id,  grid_team1_player5 );
        getMastery(team1[4].masteries, grid_team1_player5);
        getRank( {summonerId : team1[4].summonerId} , grid_team1_player5 , 'team1');
        getRankStats({summonerId : team1[4].summonerId}, team1[4].championId, grid_team1_player5);
        getMatchHistory({summonerId: team1[4].summonerId}, grid_team1_player5, t1_p5_stats, t1_p5_stats_output);
        extractRunes(team1[4], t1_p5_runes);



        $( grid_team2_player1.name ).html( team2[0].summonerName );
        getMMR( {summonerName : team2[0].summonerName} , grid_team2_player1 );
        getChampionById( {championId : team2[0].championId} , grid_team2_player1 );
        drawSpellIcon(team2[0].spell1Id ,team2[0].spell2Id,  grid_team2_player1 );
        getMastery(team2[0].masteries, grid_team2_player1);
        getRank( {summonerId : team2[0].summonerId} , grid_team2_player1 , 'team2');
        getRankStats({summonerId : team2[0].summonerId}, team2[0].championId, grid_team2_player1);
        getMatchHistory({summonerId: team2[0].summonerId}, grid_team2_player1, t2_p1_stats, t2_p1_stats_output);
        extractRunes(team2[0], t2_p1_runes);

        $( grid_team2_player2.name ).html( team2[1].summonerName );
        getMMR( {summonerName : team2[1].summonerName} , grid_team2_player2 );
        getChampionById( {championId : team2[1].championId} , grid_team2_player2 );
        drawSpellIcon(team2[1].spell1Id ,team2[1].spell2Id,  grid_team2_player2 );
        getMastery(team2[1].masteries, grid_team2_player2);
        getRank( {summonerId : team2[1].summonerId} , grid_team2_player2 , 'team2');
        getRankStats({summonerId : team2[1].summonerId}, team2[1].championId, grid_team2_player2);
        getMatchHistory({summonerId: team2[1].summonerId}, grid_team2_player2, t2_p2_stats, t2_p2_stats_output);
        extractRunes(team2[1], t2_p2_runes);

        $( grid_team2_player3.name ).html( team2[2].summonerName );
        getMMR( {summonerName : team2[2].summonerName} , grid_team2_player3 );
        getChampionById( {championId : team2[2].championId} , grid_team2_player3 );
        drawSpellIcon(team2[2].spell1Id ,team2[2].spell2Id,  grid_team2_player3 );
        getMastery(team2[2].masteries, grid_team2_player3);
        getRank( {summonerId : team2[2].summonerId} , grid_team2_player3 , 'team2');
        getRankStats({summonerId : team2[2].summonerId}, team2[2].championId, grid_team2_player3);
        getMatchHistory({summonerId: team2[2].summonerId}, grid_team2_player3, t2_p3_stats, t2_p3_stats_output);
        extractRunes(team2[2], t2_p3_runes);

        $( grid_team2_player4.name ).html( team2[3].summonerName );
        getMMR( {summonerName : team2[3].summonerName} , grid_team2_player4 );
        getChampionById( {championId : team2[3].championId} , grid_team2_player4 );
        drawSpellIcon(team2[3].spell1Id ,team2[3].spell2Id,  grid_team2_player4 );
        getMastery(team2[3].masteries, grid_team2_player4);
        getRank( {summonerId : team2[3].summonerId} , grid_team2_player4 , 'team2');
        getRankStats({summonerId : team2[3].summonerId}, team2[3].championId, grid_team2_player4);
        getMatchHistory({summonerId: team2[3].summonerId}, grid_team2_player4, t2_p4_stats, t2_p4_stats_output);
        extractRunes(team2[3], t2_p4_runes);

        $( grid_team2_player5.name ).html( team2[4].summonerName );
        getMMR( {summonerName : team2[4].summonerName} , grid_team2_player5 );
        getChampionById( {championId : team2[4].championId} , grid_team2_player5 );
        drawSpellIcon(team2[4].spell1Id ,team2[4].spell2Id,  grid_team2_player5 );
        getMastery(team2[4].masteries, grid_team2_player5);
        getRank( {summonerId : team2[4].summonerId} , grid_team2_player5 , 'team2');
        getRankStats({summonerId : team2[4].summonerId}, team2[4].championId, grid_team2_player5);
        getMatchHistory({summonerId: team2[4].summonerId}, grid_team2_player5, t2_p5_stats, t2_p5_stats_output);
        extractRunes(team2[4], t2_p5_runes);
    }



});

function getSummonersByTeam(participants, next) {
    var team1 = [];
    var team2 = [];
    for (var i in participants) {
        if (participants[i].teamId == 100) {
            team1.push(participants[i]);
        }
        if (participants[i].teamId == 200) {
            team2.push(participants[i]);
        }
    }
    next(team1, team2);
}
