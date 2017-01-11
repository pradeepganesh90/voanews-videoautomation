function readXml(url) {
    var xml_response;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "xml",
        async: false,
        success: function (data) {
            xml_response = data;

        },
        error: function () {
            alert("An error occurred while processing XML file.");
        }
    });
    // alert($(xml_response).find('TestSuiteName').text());
    return xml_response;

}

var xml = readXml("AutomateOnReports.xml");

function parseXml() {
    setTestSuiteName();
    getTestDetail();
    generateSummary();
    populateAllDropDown();
}

//-- Create the Test Suite 
function setTestSuiteName() {

    var testSuiteName = $(xml).find('TestSuiteName').text();
    var testDateTime = $(xml).find('TestDateTime').text();
    var testEndTime = $(xml).find('TestEndTime').text();
    var duration = $(xml).find('Duration').text();
    var environment = $(xml).find('Environment').text();

    $("#TestSuiteName").append(testSuiteName);
    $("#TestDateTime").append(testDateTime);
    $("#TestEndTime").append(testEndTime);
    $("#Duration").append(duration);
    $("#Environment").append(environment);

}

function getTestDetail() {

    var totalBrowser = [];
    var totalPassed = [];
    var totalFailed = [];
    var totalTestCase = $(xml).find('AOTestCase').length;

    $(xml).find('AOTestCase').each(function (index) {
        totalBrowser.push($(xml).find('AOTestCase').eq(index).attr('Browser'));
    });


    totalBrowser = $.unique(totalBrowser);
    var uniqBrowser = totalBrowser.length;

    $(xml).find('AOTestCase').each(function (index) {

        if ($(xml).find('AOTestCase').eq(index).attr('TestCaseStatus') == "Passed") {
            totalPassed.push("Passed");
        }

        if ($(xml).find('AOTestCase').eq(index).attr('TestCaseStatus') == "Failed") {
            totalFailed.push("Failed");
        }
    });

    var passedTC = totalPassed.length;
    var failedTC = totalFailed.length;

    $("#totalTest").append(totalTestCase);
    $("#uniqBrowser").append(uniqBrowser);
    $("#totalPassed").append(passedTC);
    $("#totalFailed").append(failedTC);

}

function totalNoOfTestCases() {
    var totalTestCases = 0;

    $(xml).find('AOTestCase').each(function (index) {
        totalTestCases = totalTestCases + 1;
    });

    return totalTestCases;
}

function totalPassed() {
    var passedTC = 0;
    $(xml).find('AOTestCase').each(function (index) {
        if ($(xml).find('AOTestCase').eq(index).attr('TestCaseStatus') == 'Passed') {
            passedTC = passedTC + 1;
        }
    });

    return passedTC;
}

function totalFailed() {
    var failedTC = 0;
    $(xml).find('AOTestCase').each(function (index) {
        if ($(xml).find('AOTestCase').eq(index).attr('TestCaseStatus') == 'Failed') {
            failedTC = failedTC + 1;
        }
    });

    return failedTC;
}


function generateSummary() {

    var totalSite = "Delta";
    /*
     * Create the Header of Summary Table
     */


    var tr = $("<tr></tr>");
    $("<td></td>").html("<h3>Summary Report</h3>").appendTo(tr);
    $("<td align='center'></td>").html("<b>" + totalSite + "</b>").appendTo(tr);
    $(tr).appendTo("#summaryTable");

    /*
     * Create the Second Row for Total Test Cases
     */
    var tr = $("<tr></tr>");
    $("<td></td>").html("Total No Test Cases").appendTo(tr);
    $("<td align='center'></td>").html(totalNoOfTestCases()).appendTo(tr);
    $(tr).appendTo("#summaryTable");

    /*
     * Create the Third Row for Total Passed Test Cases
     */
    var tr = $("<tr class='passed'></tr>");
    $("<td></td>").html("Total No of Test Cases Passed").appendTo(tr);
    $("<td align='center'></td>").html(totalPassed()).appendTo(tr);
    $(tr).appendTo("#summaryTable");

    /*
     * Create the Fourth Row for Total Failed Test Cases
     */
    var tr = $("<tr class='failed'></tr>");
    $("<td></td>").html("Total No of Test Cases Failed").appendTo(tr);
    $("<td align='center'></td>").html(totalFailed()).appendTo(tr);
    $(tr).appendTo("#summaryTable");

    /*
     * Create Pass Rate
     */
    var tr = $("<tr></tr>");
    $("<td></td>").html("Pass Rate").appendTo(tr);
    $("<td align='center'></td>").html("<b>" + (totalPassed() / totalNoOfTestCases() * 100).toFixed(2) + "%</b>").appendTo(tr);
    $(tr).appendTo("#summaryTable");

}

function populateAllDropDown() {
    $('<option selected="selected">').val('Failed').text('Failed').appendTo('#dpstatus');
    $('<option >').val('Passed').text('Passed').appendTo('#dpstatus');

    $('<option selected="selected">').val('All').text('All').appendTo('#dptestcase');

    $('<option selected="selected">').val('All').text('All').appendTo('#dpbroswer');


    populateTestCase();
    populateBrowser();

    showTable();
}

function populateTestCase() {

    var values = [];
    var dropDownStatus = $('#dpstatus option:selected').text();

    values = getUniqueTestCase(dropDownStatus);

    $('#dptestcase').empty();
    for (var i in values) {
        $('<option >').val(values[i]).text(values[i]).appendTo(
            '#dptestcase');
    }

    $('<option selected="selected">').val('All').text('All').appendTo('#dptestcase');

    populateBrowser();
}

function populateBrowser() {

    var values = [];
    var dropDownStatus = $('#dpstatus option:selected').text();
    var dropDownTestCase = $('#dptestcase option:selected').text();

    values = getUniqueBrowser(dropDownStatus, dropDownTestCase);

    $('#dpbroswer').empty();
    for (var i in values) {
        $('<option >').val(values[i]).text(values[i]).appendTo(
            '#dpbroswer');
    }

    $('<option selected="selected">').val('All').text('All').appendTo('#dpbroswer');

}

function getUniqueTestCase(status) {
    var uniqueTestCase = [];
    $(xml).find('AOTestCase').each(function (index) {
        if ($(xml).find('AOTestCase').eq(index).attr('TestCaseStatus') == status) {
            uniqueTestCase.push($(xml).find('AOTestCase').eq(index).attr('TestCase'));
        }
    });
    uniqueTestCase = $.unique(uniqueTestCase);
    return uniqueTestCase;
}

function getUniqueBrowser(status, testcase) {
    var uniqueBrowser = [];
    $(xml).find('AOTestCase').each(function (index) {
        if ($(xml).find('AOTestCase').eq(index).attr('TestCaseStatus') == status) {
            if (testcase == 'All') {
                uniqueBrowser.push($(xml).find('AOTestCase').eq(index).attr('Browser'));
            } else {
                if ($(xml).find('AOTestCase').eq(index).attr('TestCase') == testcase) {
                    uniqueBrowser.push($(xml).find('AOTestCase').eq(index).attr('Browser'));
                }
            }

        }
    });

    uniqueBrowser = $.unique(uniqueBrowser);
    return uniqueBrowser;
}

function getKeyValueOfFilter() {

    var getAttrValue = [];
    var dropDownStatus = $('#dpstatus option:selected').text();
    var dropDownTestCase = $('#dptestcase option:selected').text();
    var dropDownBrowser = $('#dpbroswer option:selected').text();
//	var dropDownWebSite = $('#dpwebsite option:selected').val();

    if (dropDownTestCase == 'All' && dropDownBrowser == 'All') {
        getAttrValue.push("TestCaseStatus");
        getAttrValue.push(dropDownStatus);

        getAttrValue.push("TestCaseStatus");
        getAttrValue.push(dropDownStatus);

        //Only TestCase is Selected
    } else if (dropDownTestCase != 'All' && dropDownBrowser == 'All') {
        getAttrValue.push("TestCaseStatus");
        getAttrValue.push(dropDownStatus);

        getAttrValue.push("TestCase");
        getAttrValue.push(dropDownTestCase);

        //Only TestCase and Browser is Selected
    } else if (dropDownTestCase != 'All' && dropDownBrowser != 'All') {
        getAttrValue.push("TestCaseStatus");
        getAttrValue.push(dropDownStatus);

        getAttrValue.push("TestCaseBrowser");
        getAttrValue.push(dropDownTestCase + dropDownBrowser);

        //Only Browser is Selected
    } else if (dropDownTestCase == 'All' && dropDownBrowser != 'All') {
        getAttrValue.push("TestCaseStatus");
        getAttrValue.push(dropDownStatus);

        getAttrValue.push("Browser");
        getAttrValue.push(dropDownBrowser);

    }
    return getAttrValue;

}

function showTable() {
    /*
     * This function will display the table based on filter selection
     */
    var getKeyValue = [];

    getKeyValue = getKeyValueOfFilter();

//	alert(getKeyValue[0]+":"+getKeyValue[1]);
//alert(getKeyValue[2]+":"+getKeyValue[3]);

    var dropDownStatus = $('#dpstatus option:selected').text();
    var dropDownTestCase = $('#dptestcase option:selected').text();
    var dropDownBrowser = $('#dpbroswer option:selected').text();
//	var dropDownWebSite = $('#dpwebsite option:selected').text();


    $('#collapseContentHere').empty();


    $(xml).find('AOTestCase').each(function (index) {

        if ($(xml).find('AOTestCase').eq(index).attr("omnitureTestCase") == "Y") {
            /*
             * START : Below section will display Omniture Data
             */

            if ($(xml).find('AOTestCase').eq(index).attr(getKeyValue[0]) == getKeyValue[1]) {
                if ($(xml).find('AOTestCase').eq(index).attr(getKeyValue[2]) == getKeyValue[3]) {
                    /*
                     * collect value for Header
                     */
                    var videoURL = "";
                    var pannelHeading;
                    var hdr_TestCase = $(xml).find('AOTestCase').eq(index).attr('TestCase');
                    var hdr_Browser = getBrowserImage($(xml).find('AOTestCase').eq(index).attr('Browser'));
//					var hdr_WebSite=getwebsiteImage($(xml).find('AOTestCase').eq(index).attr('Website'));
                    var hdr_WebSite = $(xml).find('AOTestCase').eq(index).attr('Website');
                    var hdr_Videojs = $(xml).find('AOTestCase').eq(index).attr('TestVideoURL');
                    var testCaseID = $(xml).find('AOTestCase').eq(index).attr('TestCaseID');


                    var testCaseHeader = hdr_TestCase + " <span>" + hdr_Browser + "</span> <span align='right'>" + hdr_WebSite + "</span>";

                    if (hdr_Videojs != "") {
                        videoURL = '<a onclick=openVideoURL("' + hdr_Videojs + '")><img width="32px" src="icon_video.png" alt="Load Video"></a>';
                    } else {
                        videoURL = "&nbsp;";
                    }


                    if ($(xml).find('AOTestCase').eq(index).attr('TestCaseStatus') == "Failed") {
                        pannelHeading = "panel-heading-failed"
                    } else {
                        pannelHeading = "panel-heading-passed"
                    }

                    testCaseHeader = hdr_TestCase + " " + hdr_Browser + " " + hdr_WebSite;

                    var tableRow = "";
                    $(xml).find('AOTestCaseStep').each(function (index1) {
                        //alert(testCaseID+" "+$(xml).find('reportTestStep').eq(index1).attr("TestStepID"));
                        if ($(xml).find('AOTestCaseStep').eq(index1).attr("TestStepID") == testCaseID) {
                            var tr = "";
                            if ($(xml).find('AOTestCaseStep').eq(index1).attr("Type") == "step") {
                                var desc = $(xml).find('AOTestCaseStep').eq(index1).attr("Description");
                                var status = $(xml).find('AOTestCaseStep').eq(index1).attr("Result");
                                var testdata = $(xml).find('AOTestCaseStep').eq(index1).attr("TestData");
                                var omniture = $(xml).find('AOTestCaseStep').eq(index1).attr("omniture");


                                //START: Create the content for model dialog based on the omniture Tags
                                if (omniture == "Y") {
                                    var omnitureTableRow = "";
                                    var omnitureId = $(xml).find('AOTestCaseStep').eq(index1).attr("OmnitureId");
                                    alert("omnitureId " + omnitureId);
                                    $.each(omnitureId.split(","), function (index, item) {

                                        alert(item);
//										$(xml).find('Requests').eq(index1).each(function(reqIndex) {
//											var requestId=$(xml).find('Requests').eq(reqIndex).attr("RequestId");
//											alert("requestId "+requestId);
//											
//											$(xml).find('OmnitureTag').eq(reqIndex).each(function(omniIndex) {
//												if($(xml).find('OmnitureTag').eq(omniIndex).attr("tagId")==requestId){
//													var omniTr="";
//													
//													omniTr="<tr class='step'>" +
//													 "<td width='15%' align='center'>"+$(xml).find('OmnitureTag').eq(omniIndex).attr("tagKey")+"</td>" +
//													 "<td width='15%' align='center'>"+$(xml).find('OmnitureTag').eq(omniIndex).attr("friendlyName")+"</td>" +
//													 "<td width='25%' align='center'>"+$(xml).find('OmnitureTag').eq(omniIndex).attr("tagValue")+"</td>" +
//													 "<td width='25%' align='center'>"+$(xml).find('OmnitureTag').eq(omniIndex).attr("exepectedValue")+"</td>" +
//													 "<td width='15%' align='left'>"+$(xml).find('OmnitureTag').eq(omniIndex).attr("validationType")+"</td>" +
//													 "<td width='15%' align='left'>"+$(xml).find('OmnitureTag').eq(omniIndex).attr("validationStatus")+"</td>" +
//													"</tr>";
//													
//													alert(omniTr);
//													
//												}
//											});
//											
//										});

                                    })

                                }
                                //END: Create the content for model dialog based on the omniture Tags


                                // START : Below code is create the Model on Run-Time
                                var omnitureString = "";
                                if (omniture == "Y") {
                                    omnitureString = "<a data-toggle='modal' data-target='#bs-example-modal-lg" + index1 + "'>Omniture</a>" +
                                    "<div class='modal fade' id='bs-example-modal-lg" + index1 + "' tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>" +
                                    "<div class='modal-dialog modal-lg'>" +
                                    "<div class='modal-content'> This is bhupendra Sharma" + index1 + "</div>" +
                                    "</div>" +
                                    "</div>";
                                } else {
                                    omnitureString = "";
                                }
                                // END : Below code is create the Model on Run-Time

                                tr = "<tr class='step'>" +
                                "<td width='35%'>" + desc + "</td>" +
                                "<td width='35%'></td>" +
                                "<td width='5%' align='center'>" + omnitureString + "</td>" +
                                "<td width='5%' align='center'>" + status + "</td>" +
                                "<td width='20%' align='left'>" + testdata + "</td>" +
                                "</tr>";
                            } else {
                                var ss_desc = $(xml).find('AOTestCaseStep').eq(index1).attr("Description");
                                var ss_status = $(xml).find('AOTestCaseStep').eq(index1).attr("Result");
                                var testdata = $(xml).find('AOTestCaseStep').eq(index1).attr("TestData");
                                var omniture = $(xml).find('AOTestCaseStep').eq(index1).attr("omniture");

                                var omnitureString = "";
                                if (omniture == "Y") {
                                    omnitureString = "<a data-toggle='modal' data-target='.bs-example-modal-lg'>Omniture</a>" +
                                    "<div class='modal fade bs-example-modal-lg' tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>" +
                                    "<div class='modal-dialog modal-lg'>" +
                                    "<div class='modal-content'> This is bhupendra Sharma</div>" +
                                    "</div>" +
                                    "</div>";
                                } else {
                                    omnitureString = "";
                                }

                                tr = "<tr class='substep'>" +
                                "<td width='35%'></td>" +
                                "<td width='35%'>" + ss_desc + "</td>" +
                                "<td width='5%' align='center'>" + omnitureString + "</td>" +
                                "<td width='5%' align='center'>" + ss_status + "</td>" +
                                "<td width='20%' align='left'>" + testdata + "</td>" +
                                "</tr>";
                            }
                            tableRow = tableRow + "" + tr;
                        }

                    });

                    var newCollapse = $("" +
                    "<div class='panel panel-default'>" +
                    "<div class='panel-heading " + pannelHeading + "'>" +
                    "<h4 class='panel-title'>" +
                    "<a class='accordion-toggle' data-toggle='collapse' data-parent='#accordion'  href='#collapse" + index + "'>" +
                    "" + testCaseHeader + "" +
                    " </a> " + videoURL + "" +
                    "</h4>" +
                    "</div>" +

                    "<div id='collapse" + index + "' class='panel-collapse collapse'>" +
                    "<div class='panel-body'><table id='stepSubStepTable' class='table-bordered'" +
                    "style='margin-left: 20px; margin-top: 12px;' width='95%'>" +
                    "<tr class='tableHdr'><td align='center'>Test Step</td>" +
                    "<td align='center'>Sub Step</td>" +
                    "<td align='center'>Omniture</td>" +
                    "<td align='center'>Status</td>" +
                    "<td align='center'>Test-Data</td></tr>" + tableRow + "</table>" +
                    "</div></div></div>");

                }
            }

            $(newCollapse).appendTo("#collapseContentHere");


            /*
             * END : Below section will display Omniture Data
             */
        } else {
            /*
             * START : Below section will display data when there is no Omniture
             */

            if ($(xml).find('AOTestCase').eq(index).attr(getKeyValue[0]) == getKeyValue[1]) {
                if ($(xml).find('AOTestCase').eq(index).attr(getKeyValue[2]) == getKeyValue[3]) {
                    /*
                     * collect value for Header
                     */
                    var videoURL = "";
                    var pannelHeading;
                    var hdr_TestCase = $(xml).find('AOTestCase').eq(index).attr('TestCase');
                    var hdr_Browser = getBrowserImage($(xml).find('AOTestCase').eq(index).attr('Browser'));
                    var hdr_WebSite = getwebsiteImage($(xml).find('AOTestCase').eq(index).attr('Website'));
                    var hdr_Videojs = $(xml).find('AOTestCase').eq(index).attr('TestVideoURL');
                    var testCaseID = $(xml).find('AOTestCase').eq(index).attr('TestCaseID');


                    var testCaseHeader = hdr_TestCase + " <span>" + hdr_Browser + "</span> <span align='right'>" + hdr_WebSite + "</span>";

                    if (hdr_Videojs != "") {
                        videoURL = '<a onclick=openVideoURL("' + hdr_Videojs + '")><img width="32px" src="icon_video.png" alt="Load Video"></a>';
                    } else {
                        videoURL = "&nbsp;";
                    }


                    if ($(xml).find('AOTestCase').eq(index).attr('TestCaseStatus') == "Failed") {
                        pannelHeading = "panel-heading-failed"
                    } else {
                        pannelHeading = "panel-heading-passed"
                    }

                    testCaseHeader = hdr_TestCase + " " + hdr_Browser + " " + hdr_WebSite;

                    var tableRow = "";
                    $(xml).find('AOTestCaseStep').each(function (index1) {
                        //alert(testCaseID+" "+$(xml).find('reportTestStep').eq(index1).attr("TestStepID"));
                        if ($(xml).find('AOTestCaseStep').eq(index1).attr("TestStepID") == testCaseID) {
                            var tr = "";
                            if ($(xml).find('AOTestCaseStep').eq(index1).attr("Type") == "step") {
                                var desc = $(xml).find('AOTestCaseStep').eq(index1).attr("Description");
                                var status = $(xml).find('AOTestCaseStep').eq(index1).attr("Result");
                                var testdata = $(xml).find('AOTestCaseStep').eq(index1).attr("TestData");
                                var omniture = $(xml).find('AOTestCaseStep').eq(index1).attr("omniture");

                                tr = "<tr class='step'>" +
                                "<td width='35%'>" + desc + "</td>" +
                                "<td width='35%'></td>" +
                                "<td width='10%' align='center'>" + status + "</td>" +
                                "<td width='20%' align='left'>" + testdata + "</td>" +
                                "</tr>";
                            } else {
                                var ss_desc = $(xml).find('AOTestCaseStep').eq(index1).attr("Description");
                                var ss_status = $(xml).find('AOTestCaseStep').eq(index1).attr("Result");
                                var testdata = $(xml).find('AOTestCaseStep').eq(index1).attr("TestData");
                                var omniture = $(xml).find('AOTestCaseStep').eq(index1).attr("omniture");

                                tr = "<tr class='substep'>" +
                                "<td width='35%'></td>" +
                                "<td width='35%'>" + ss_desc + "</td>" +
                                "<td width='10%' align='center'>" + ss_status + "</td>" +
                                "<td width='20%' align='left'>" + testdata + "</td>" +
                                "</tr>";
                            }
                            tableRow = tableRow + "" + tr;
                        }

                    });

                    var newCollapse = $("" +
                    "<div class='panel panel-default'>" +
                    "<div class='panel-heading " + pannelHeading + "'>" +
                    "<h4 class='panel-title'>" +
                    "<a class='accordion-toggle' data-toggle='collapse' data-parent='#accordion'  href='#collapse" + index + "'>" +
                    "" + testCaseHeader + "" +
                    " </a> " + videoURL + "" +
                    "</h4>" +
                    "</div>" +

                    "<div id='collapse" + index + "' class='panel-collapse collapse'>" +
                    "<div class='panel-body'><table id='stepSubStepTable' class='table-bordered'" +
                    "style='margin-left: 20px; margin-top: 12px;' width='95%'>" +
                    "<tr class='tableHdr'><td align='center'>Test Step</td>" +
                    "<td align='center'>Sub Step</td>" +
                    "<td align='center'>Status</td>" +
                    "<td align='center'>Test-Data</td></tr>" + tableRow + "</table>" +
                    "</div></div></div>");

                }
            }

            $(newCollapse).appendTo("#collapseContentHere");

            /*
             * END : Below section will display data when there is no Omniture
             */
        }
    });


}

function openVideoURL(url) {
    window.open("loadvideo.html?jsurl=" + url, url, "width=710,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,copyhistory=no,resizable=no");
}

function getBrowserImage(brows) {
    if (brows == "firefox") {
        return "<img src='firefox.png' alt='Firefox'>"
    } else if (brows == "chrome") {
        return "<img src='chrome.png' alt='Chrome'>"
    } else if (brows == "internetexplorer") {
        return "<img src='ie.png' alt='Internet Explorer'>"
    }

}

function getwebsiteImage(website) {
    if (website == "dl") {
        return "<img src='Delta.ico' alt='Delta'>"
    } else if (website == "delta") {
        return "<img src='Delta.ico' alt='Delta'>"
    }

}


//if(omniture =="Y"){
//	var omnitureId=$(xml).find('AOTestCaseStep').eq(index1).attr("OmnitureId");
//	/*
//	 * Get the Omniture in model dialog
//	 */
////	
////	$.each(omnitureId.split(","), function(index, item) {
////		alert(item);
////	});
//	
//	/*
//	 * Table for the step and substep
//	 */
//	
//	tr = "<tr class='step'>" +
//		 	"<td width='35%'>"+desc+"</td>" +
//		 	"<td width='35%'></td>" +
//		 	"<td width='5%' align='center'>"+status+"</td>" +
//		 	"<td width='5%' align='center'><a class='btn btn-primary' " +
//		 		"data-toggle='modal' data-target='.bs-modal-lg'>Omniture></a></td>" +
//		 	"<td width='20%' align='left'>"+testdata+"</td>" +
//		 "</tr>";
//
//

