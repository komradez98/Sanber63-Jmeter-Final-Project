/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.52216748768473, "KoPercent": 1.477832512315271};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9925558312655087, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "PUT Contact - 1"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "CONTACT_TR_ADDCONTACTLIST"], "isController": true}, {"data": [1.0, 500, 1500, "PUT Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 8"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 9"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 6"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 7"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 5"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 5"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 6"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 7"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 8"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 9"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact - 5"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact - 6"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact - 7"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact - 8"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact - 9"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 1"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact - 10"], "isController": false}, {"data": [1.0, 500, 1500, "CONTACT_TR_GETCONTACTLIST"], "isController": true}, {"data": [1.0, 500, 1500, "GET Contact List"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact List - 9"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact List - 8"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact List - 5"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact List - 4"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact List - 7"], "isController": false}, {"data": [1.0, 500, 1500, "PATCH Contact - 10"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact List - 6"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact List - 1"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact List - 3"], "isController": false}, {"data": [1.0, 500, 1500, "DELETE Contact List - 2"], "isController": false}, {"data": [1.0, 500, 1500, "CONTACT_TR_UPDATECONTACT"], "isController": true}, {"data": [1.0, 500, 1500, "CONTACT_TR_GETCONTACT"], "isController": true}, {"data": [1.0, 500, 1500, "DELETE Contact List - 10"], "isController": false}, {"data": [1.0, 500, 1500, "PUT Contact - 10"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 10"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact - 2"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact - 1"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact - 4"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact - 3"], "isController": false}, {"data": [1.0, 500, 1500, "CONTACT_TR_DELETECONTACT"], "isController": true}, {"data": [1.0, 500, 1500, "GET Contact - 9"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact - 6"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact - 5"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact - 8"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN Request - 10"], "isController": false}, {"data": [1.0, 500, 1500, "GET Contact - 7"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN Request - 3"], "isController": false}, {"data": [1.0, 500, 1500, "POST ADD Contact - 1"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN Request - 4"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN Request - 5"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN Request - 6"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN Request - 7"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN Request - 8"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN Request - 9"], "isController": false}, {"data": [0.0, 500, 1500, "LOGIN Request - 2"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 609, 9, 1.477832512315271, 283.2101806239736, 256, 1122, 268.0, 284.0, 295.0, 1071.8, 32.132116287658945, 48.15886048712605, 17.35398914419881], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PUT Contact - 1", 10, 0, 0.0, 270.4, 257, 315, 264.5, 311.20000000000005, 315.0, 315.0, 0.6770022341073726, 0.7060921738541737, 0.5160158630085979], "isController": false}, {"data": ["PUT Contact - 2", 10, 0, 0.0, 276.4, 263, 301, 271.5, 300.3, 301.0, 301.0, 0.6644518272425249, 0.6935215946843853, 0.5064498546511628], "isController": false}, {"data": ["CONTACT_TR_ADDCONTACTLIST", 100, 0, 0.0, 272.14000000000004, 262, 315, 269.0, 284.0, 290.74999999999994, 314.8099999999999, 5.985515053570359, 6.238730397438199, 4.385675727240079], "isController": true}, {"data": ["PUT Contact - 3", 10, 0, 0.0, 269.8, 263, 283, 267.5, 282.3, 283.0, 283.0, 0.6720430107526882, 0.702232442876344, 0.5122359080981183], "isController": false}, {"data": ["POST ADD Contact - 8", 10, 0, 0.0, 277.8, 266, 296, 273.5, 296.0, 296.0, 296.0, 0.6596741209842337, 0.6889213915825582, 0.48373954828814564], "isController": false}, {"data": ["POST ADD Contact - 9", 10, 0, 0.0, 271.09999999999997, 262, 285, 269.0, 284.5, 285.0, 285.0, 0.6615506747816883, 0.6892660301997883, 0.48453418563111933], "isController": false}, {"data": ["POST ADD Contact - 6", 10, 0, 0.0, 269.8, 264, 286, 267.0, 285.3, 286.0, 286.0, 0.6688515818339911, 0.698244473613805, 0.49020811735001], "isController": false}, {"data": ["POST ADD Contact - 7", 10, 0, 0.0, 271.19999999999993, 263, 284, 270.5, 283.8, 284.0, 284.0, 0.6772314777190844, 0.7069926266422863, 0.49634982815251255], "isController": false}, {"data": ["POST ADD Contact - 4", 10, 0, 0.0, 278.7, 266, 315, 274.0, 312.6, 315.0, 315.0, 0.6640106241699867, 0.6918290380146083, 0.48633590637450197], "isController": false}, {"data": ["POST ADD Contact - 5", 10, 0, 0.0, 269.3, 263, 281, 268.0, 280.7, 281.0, 281.0, 0.6793939805693321, 0.7070607080983763, 0.49760301311230387], "isController": false}, {"data": ["POST ADD Contact - 2", 10, 0, 0.0, 272.0, 263, 286, 269.0, 285.8, 286.0, 286.0, 0.6640106241699867, 0.6911157453519257, 0.486660130312085], "isController": false}, {"data": ["POST ADD Contact - 3", 10, 0, 0.0, 270.4, 265, 281, 268.5, 280.7, 281.0, 281.0, 0.6670224119530417, 0.695032142142476, 0.48886750016675556], "isController": false}, {"data": ["PATCH Contact - 3", 10, 0, 0.0, 274.4, 265, 291, 271.5, 290.4, 291.0, 291.0, 0.6721333512568893, 0.7037708781422234, 0.32326726122462696], "isController": false}, {"data": ["PATCH Contact - 4", 10, 0, 0.0, 280.4, 266, 349, 273.5, 342.20000000000005, 349.0, 349.0, 0.6672004270082733, 0.6975632589404858, 0.32089473662263146], "isController": false}, {"data": ["PATCH Contact - 5", 10, 0, 0.0, 268.70000000000005, 259, 291, 267.5, 289.2, 291.0, 291.0, 0.6789788158609451, 0.7098776565046171, 0.32655963555812056], "isController": false}, {"data": ["PATCH Contact - 6", 10, 0, 0.0, 277.6, 261, 296, 280.0, 295.1, 296.0, 296.0, 0.670555890833501, 0.6994998072151813, 0.3225085705424797], "isController": false}, {"data": ["PATCH Contact - 7", 10, 0, 0.0, 271.1, 265, 286, 267.5, 285.6, 286.0, 286.0, 0.678195998643608, 0.7074696931163107, 0.3261831341132587], "isController": false}, {"data": ["PATCH Contact - 8", 10, 0, 0.0, 287.2, 262, 381, 279.0, 372.5, 381.0, 381.0, 0.6598917777484492, 0.6896642388148344, 0.31737959037217894], "isController": false}, {"data": ["PATCH Contact - 9", 10, 0, 0.0, 288.6, 265, 358, 281.5, 352.3, 358.0, 358.0, 0.6614631565021828, 0.6913065137584337, 0.318135356032544], "isController": false}, {"data": ["PUT Contact - 4", 10, 0, 0.0, 271.7, 262, 283, 271.5, 282.5, 283.0, 283.0, 0.6673340006673341, 0.6980939272605939, 0.5086466675008342], "isController": false}, {"data": ["PUT Contact - 5", 10, 0, 0.0, 265.40000000000003, 258, 274, 266.0, 273.8, 274.0, 274.0, 0.6792094002580996, 0.7105167085512463, 0.517698180567819], "isController": false}, {"data": ["PUT Contact - 6", 10, 0, 0.0, 264.1, 256, 274, 264.0, 273.5, 274.0, 274.0, 0.6700616456714018, 0.699638585499866, 0.5107256977016885], "isController": false}, {"data": ["PUT Contact - 7", 10, 0, 0.0, 269.4, 261, 286, 264.5, 285.8, 286.0, 286.0, 0.677323218639935, 0.7069561094554322, 0.5162605196762395], "isController": false}, {"data": ["PUT Contact - 8", 10, 0, 0.0, 278.6, 261, 383, 268.0, 371.80000000000007, 383.0, 383.0, 0.6602839220864972, 0.6876238032353912, 0.5032730480356553], "isController": false}, {"data": ["PUT Contact - 9", 10, 0, 0.0, 277.9, 260, 380, 266.5, 369.50000000000006, 380.0, 380.0, 0.6619886137958427, 0.6912092049516748, 0.504572376042632], "isController": false}, {"data": ["PATCH Contact - 1", 10, 0, 0.0, 272.7, 256, 308, 268.5, 306.7, 308.0, 308.0, 0.677323218639935, 0.707352978528854, 0.3257633644337578], "isController": false}, {"data": ["PATCH Contact - 2", 10, 0, 0.0, 282.49999999999994, 268, 368, 274.0, 359.0, 368.0, 368.0, 0.6653359946773121, 0.695873877245509, 0.3199980247837658], "isController": false}, {"data": ["GET Contact - 10", 10, 0, 0.0, 269.20000000000005, 260, 278, 268.5, 277.7, 278.0, 278.0, 0.6729022273063724, 0.7003045933988291, 0.26318099808222867], "isController": false}, {"data": ["CONTACT_TR_GETCONTACTLIST", 100, 0, 0.0, 269.26000000000016, 257, 383, 266.5, 280.9, 287.95, 382.06999999999954, 5.9977208660708925, 24.622342728513168, 2.19935955586877], "isController": true}, {"data": ["GET Contact List", 100, 0, 0.0, 269.26000000000016, 257, 383, 266.5, 280.9, 287.95, 382.06999999999954, 5.9977208660708925, 24.622342728513168, 2.19935955586877], "isController": false}, {"data": ["DELETE Contact List - 9", 10, 0, 0.0, 271.7, 263, 293, 269.5, 291.9, 293.0, 293.0, 0.6622078008078934, 0.4925170518508708, 0.34824111399907287], "isController": false}, {"data": ["DELETE Contact List - 8", 10, 0, 0.0, 270.2, 263, 285, 268.0, 284.4, 285.0, 285.0, 0.6591957811470006, 0.49027686222808176, 0.3466571563941991], "isController": false}, {"data": ["DELETE Contact List - 5", 10, 0, 0.0, 267.9, 258, 284, 265.5, 283.3, 284.0, 284.0, 0.6790710308298248, 0.5032022443297569, 0.3571091309588483], "isController": false}, {"data": ["DELETE Contact List - 4", 10, 0, 0.0, 272.20000000000005, 265, 290, 268.0, 289.1, 290.0, 290.0, 0.6706458319361545, 0.49591115619341425, 0.3526784965797063], "isController": false}, {"data": ["DELETE Contact List - 7", 10, 0, 0.0, 268.3, 263, 280, 266.5, 279.8, 280.0, 280.0, 0.6785181164337087, 0.5033226184014113, 0.3568183649409689], "isController": false}, {"data": ["PATCH Contact - 10", 10, 0, 0.0, 272.09999999999997, 261, 286, 272.5, 285.4, 286.0, 286.0, 0.6725854183481302, 0.7037187668146354, 0.323484686070756], "isController": false}, {"data": ["DELETE Contact List - 6", 10, 0, 0.0, 271.8999999999999, 260, 287, 271.0, 286.6, 287.0, 287.0, 0.671366230278617, 0.49801737160120846, 0.3530573388721047], "isController": false}, {"data": ["DELETE Contact List - 1", 10, 0, 0.0, 270.3, 259, 290, 266.5, 289.4, 290.0, 290.0, 0.6772773450728073, 0.5034604639349813, 0.35616586945479173], "isController": false}, {"data": ["DELETE Contact List - 3", 10, 0, 0.0, 269.2, 261, 282, 268.0, 281.5, 282.0, 282.0, 0.6733099919202801, 0.4978811776191759, 0.35407952211823324], "isController": false}, {"data": ["DELETE Contact List - 2", 10, 0, 0.0, 271.0, 265, 302, 267.5, 299.1, 302.0, 302.0, 0.6712760958582265, 0.4969016412700544, 0.3530099390816943], "isController": false}, {"data": ["CONTACT_TR_UPDATECONTACT", 200, 0, 0.0, 274.2500000000002, 256, 383, 269.0, 287.0, 300.9, 380.99, 11.802195208308746, 12.328914271804555, 7.336032470789566], "isController": true}, {"data": ["CONTACT_TR_GETCONTACT", 100, 0, 0.0, 266.1799999999998, 256, 294, 264.0, 277.0, 280.95, 293.92999999999995, 6.012144531954548, 6.241592391631095, 2.351429575241989], "isController": true}, {"data": ["DELETE Contact List - 10", 10, 0, 0.0, 276.5, 265, 304, 276.0, 301.8, 304.0, 304.0, 0.6733099919202801, 0.4997222596283329, 0.35407952211823324], "isController": false}, {"data": ["PUT Contact - 10", 10, 0, 0.0, 266.0, 257, 279, 264.5, 278.9, 279.0, 279.0, 0.6718172657037286, 0.7014716996976822, 0.5120638436345314], "isController": false}, {"data": ["POST ADD Contact - 10", 10, 0, 0.0, 267.80000000000007, 263, 278, 266.0, 277.6, 278.0, 278.0, 0.6714113065664026, 0.6996709035517658, 0.4921497331140056], "isController": false}, {"data": ["GET Contact - 2", 10, 0, 0.0, 267.70000000000005, 259, 294, 262.0, 292.5, 294.0, 294.0, 0.6701963675356879, 0.6961141176864821, 0.2621227003887139], "isController": false}, {"data": ["GET Contact - 1", 10, 0, 0.0, 261.4, 257, 273, 259.5, 272.2, 273.0, 273.0, 0.6779661016949153, 0.7037870762711864, 0.2651615466101695], "isController": false}, {"data": ["GET Contact - 4", 10, 0, 0.0, 265.59999999999997, 259, 282, 264.0, 280.8, 282.0, 282.0, 0.6709608158883522, 0.695532134829576, 0.26242168629227053], "isController": false}, {"data": ["GET Contact - 3", 10, 0, 0.0, 266.6, 257, 281, 264.5, 280.3, 281.0, 281.0, 0.6730833950326445, 0.698849868748738, 0.26325185518610755], "isController": false}, {"data": ["CONTACT_TR_DELETECONTACT", 100, 0, 0.0, 270.91999999999996, 258, 304, 267.0, 283.0, 289.84999999999997, 303.98, 6.007088364269838, 4.4553354207965405, 3.1590010587493245], "isController": true}, {"data": ["GET Contact - 9", 10, 0, 0.0, 270.9, 258, 282, 272.0, 281.8, 282.0, 282.0, 0.6617257808364214, 0.6875098224920593, 0.25880974143065116], "isController": false}, {"data": ["GET Contact - 6", 10, 0, 0.0, 267.6, 260, 279, 266.5, 278.6, 279.0, 279.0, 0.6714563889075404, 0.6963737158396562, 0.26261551148190426], "isController": false}, {"data": ["GET Contact - 5", 10, 0, 0.0, 263.0, 256, 271, 263.0, 270.7, 271.0, 271.0, 0.6792555359326179, 0.7041306165942127, 0.26566586146583343], "isController": false}, {"data": ["GET Contact - 8", 10, 0, 0.0, 266.90000000000003, 259, 287, 265.5, 285.5, 287.0, 287.0, 0.6595435958316845, 0.6855646517609814, 0.2579562598931539], "isController": false}, {"data": ["LOGIN Request - 10", 1, 1, 100.0, 1088.0, 1088, 1088, 1088.0, 1088.0, 1088.0, 1088.0, 0.9191176470588235, 1.1309455422794117, 0.30158547794117646], "isController": false}, {"data": ["GET Contact - 7", 10, 0, 0.0, 262.90000000000003, 256, 277, 260.0, 276.7, 277.0, 277.0, 0.678886625933469, 0.704079684317719, 0.26552157586558045], "isController": false}, {"data": ["LOGIN Request - 3", 1, 1, 100.0, 1060.0, 1060, 1060, 1060.0, 1060.0, 1060.0, 1060.0, 0.9433962264150944, 1.164504716981132, 0.3095518867924528], "isController": false}, {"data": ["POST ADD Contact - 1", 10, 0, 0.0, 273.3, 264, 295, 272.0, 293.5, 295.0, 295.0, 0.6753106428957321, 0.7032727242031335, 0.4942825457522961], "isController": false}, {"data": ["LOGIN Request - 4", 1, 1, 100.0, 1064.0, 1064, 1064, 1064.0, 1064.0, 1064.0, 1064.0, 0.9398496240601504, 1.160126879699248, 0.30838815789473684], "isController": false}, {"data": ["LOGIN Request - 5", 1, 1, 100.0, 1122.0, 1122, 1122, 1122.0, 1122.0, 1122.0, 1122.0, 0.8912655971479501, 1.0966744652406417, 0.2924465240641711], "isController": false}, {"data": ["LOGIN Request - 6", 1, 1, 100.0, 1119.0, 1119, 1119, 1119.0, 1119.0, 1119.0, 1119.0, 0.8936550491510277, 1.0996146112600536, 0.29323056300268097], "isController": false}, {"data": ["LOGIN Request - 7", 1, 1, 100.0, 1070.0, 1070, 1070, 1070.0, 1070.0, 1070.0, 1070.0, 0.9345794392523364, 1.1499707943925233, 0.3066588785046729], "isController": false}, {"data": ["LOGIN Request - 8", 1, 1, 100.0, 1097.0, 1097, 1097, 1097.0, 1097.0, 1097.0, 1097.0, 0.9115770282588879, 1.1216670464904284, 0.2991112123974476], "isController": false}, {"data": ["LOGIN Request - 9", 1, 1, 100.0, 1072.0, 1072, 1072, 1072.0, 1072.0, 1072.0, 1072.0, 0.9328358208955224, 1.1478253264925373, 0.30608675373134325], "isController": false}, {"data": ["LOGIN Request - 2", 1, 1, 100.0, 1083.0, 1083, 1083, 1083.0, 1083.0, 1083.0, 1083.0, 0.9233610341643582, 1.1397737765466298, 0.3029778393351801], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 1.070 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 11.11111111111111, 0.16420361247947454], "isController": false}, {"data": ["The operation lasted too long: It took 1.060 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 11.11111111111111, 0.16420361247947454], "isController": false}, {"data": ["The operation lasted too long: It took 1.122 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 11.11111111111111, 0.16420361247947454], "isController": false}, {"data": ["The operation lasted too long: It took 1.072 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 11.11111111111111, 0.16420361247947454], "isController": false}, {"data": ["The operation lasted too long: It took 1.088 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 11.11111111111111, 0.16420361247947454], "isController": false}, {"data": ["The operation lasted too long: It took 1.119 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 11.11111111111111, 0.16420361247947454], "isController": false}, {"data": ["The operation lasted too long: It took 1.097 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 11.11111111111111, 0.16420361247947454], "isController": false}, {"data": ["The operation lasted too long: It took 1.083 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 11.11111111111111, 0.16420361247947454], "isController": false}, {"data": ["The operation lasted too long: It took 1.064 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, 11.11111111111111, 0.16420361247947454], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 609, 9, "The operation lasted too long: It took 1.070 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1.060 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1.122 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1.072 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "The operation lasted too long: It took 1.088 milliseconds, but should not have lasted longer than 500 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LOGIN Request - 10", 1, 1, "The operation lasted too long: It took 1.088 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LOGIN Request - 3", 1, 1, "The operation lasted too long: It took 1.060 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LOGIN Request - 4", 1, 1, "The operation lasted too long: It took 1.064 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LOGIN Request - 5", 1, 1, "The operation lasted too long: It took 1.122 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LOGIN Request - 6", 1, 1, "The operation lasted too long: It took 1.119 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LOGIN Request - 7", 1, 1, "The operation lasted too long: It took 1.070 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LOGIN Request - 8", 1, 1, "The operation lasted too long: It took 1.097 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LOGIN Request - 9", 1, 1, "The operation lasted too long: It took 1.072 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LOGIN Request - 2", 1, 1, "The operation lasted too long: It took 1.083 milliseconds, but should not have lasted longer than 500 milliseconds.", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
