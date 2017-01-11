function readJson(url) {
    var _response;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        async: false,
        success: function (data) {
            _response = data;

        },
        error: function () {
            alert("An error occurred while processing Json file.");
        }
    });
    // alert($(xml_response).find('TestSuiteName').text());
    return _response;

}

var json = readJson("AutomateOnReports.json");

function parseJson() {

    setTestSuiteName();
    getTestDetail();
    generateSummary();
    populateAllDropDown();

}

function setTestSuiteName() {

    $("#TestSuiteName").append(json.aoReportTestSuite.testSuiteName);
    $("#TestDateTime").append(json.aoReportTestSuite.testDateTime);
    $("#TestEndTime").append(json.aoReportTestSuite.testEndTime);
    $("#Duration").append(json.aoReportTestSuite.duration);
    $("#Environment").append(json.aoReportTestSuite.environment);

    var envval = json.aoReportTestSuite.environment;

    if (envval.toLowerCase() == "devices") {
        $("#browserHeading").append("Devices");
    } else {
        $("#browserHeading").append("Browsers");
    }
}

function getTestDetail() {

    var totalBrowser = [];
    var totalPassed = 0;
    var totalFailed = 0;

    $.each(json.aoReportTestSuite.aoTestCase, function () {
        totalBrowser.push(this.browser);

        if (this.testCaseStatus == "Passed") {
            totalPassed++;
        }

        if (this.testCaseStatus == "Failed") {
            totalFailed++;
        }

    });


    totalBrowser = unique(totalBrowser);


    $("#totalTest").append(json.aoReportTestSuite.aoTestCase.length);
    $("#uniqBrowser").append(totalBrowser.length);
    $("#totalPassed").append(totalPassed);
    $("#totalFailed").append(totalFailed);

}

function unique(array) {
    return $.grep(array, function (el, index) {
        return index == $.inArray(el, array);
    });
}

function generateSummary() {

    var totalSite = " ";

    var totalPassed = 0;
    var totalFailed = 0;
    var totalNoOfTestCases = json.aoReportTestSuite.aoTestCase.length;

    $.each(json.aoReportTestSuite.aoTestCase, function () {

        if (this.testCaseStatus == "Passed") {
            totalPassed++;
        }

        if (this.testCaseStatus == "Failed") {
            totalFailed++;
        }

    });

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
    $("<td align='center'></td>").html(totalNoOfTestCases).appendTo(tr);
    $(tr).appendTo("#summaryTable");

    /*
     * Create the Third Row for Total Passed Test Cases
     */
    var tr = $("<tr class='passed'></tr>");
    $("<td></td>").html("Total No of Test Cases Passed").appendTo(tr);
    $("<td align='center'></td>").html(totalPassed).appendTo(tr);
    $(tr).appendTo("#summaryTable");

    /*
     * Create the Fourth Row for Total Failed Test Cases
     */
    var tr = $("<tr class='failed'></tr>");
    $("<td></td>").html("Total No of Test Cases Failed").appendTo(tr);
    $("<td align='center'></td>").html(totalFailed).appendTo(tr);
    $(tr).appendTo("#summaryTable");

    /*
     * Create Pass Rate
     */
    var tr = $("<tr></tr>");
    $("<td></td>").html("Pass Rate").appendTo(tr);
    $("<td align='center'></td>").html(
        "<b>" + (totalPassed / totalNoOfTestCases * 100).toFixed(2)
        + "%</b>").appendTo(tr);
    $(tr).appendTo("#summaryTable");

}

function populateAllDropDown() {
    $('<option selected="selected">').val('Failed').text('Failed').appendTo(
        '#dpstatus');
    $('<option >').val('Passed').text('Passed').appendTo('#dpstatus');

    $('<option selected="selected">').val('All').text('All').appendTo(
        '#dptestcase');

    $('<option selected="selected">').val('All').text('All').appendTo(
        '#dpbroswer');

    populateTestCase();
    populateBrowser();

    displayTestCaseDetail();

}

function populateTestCase() {

    var values = [];
    var dropDownStatus = $('#dpstatus option:selected').text();

    values = getUniqueTestCase(dropDownStatus);

    $('#dptestcase').empty();
    for (var i in values) {
        $('<option >').val(values[i]).text(values[i]).appendTo('#dptestcase');
    }

    $('<option selected="selected">').val('All').text('All').appendTo(
        '#dptestcase');

    populateBrowser();
}

function populateBrowser() {

    var values = [];
    var dropDownStatus = $('#dpstatus option:selected').text();
    var dropDownTestCase = $('#dptestcase option:selected').text();

    values = getUniqueBrowser(dropDownStatus, dropDownTestCase);

    $('#dpbroswer').empty();
    for (var i in values) {
        $('<option >').val(values[i]).text(values[i]).appendTo('#dpbroswer');
    }

    $('<option selected="selected">').val('All').text('All').appendTo(
        '#dpbroswer');

}

function getUniqueTestCase(status) {
    var uniqueTestCase = [];
    $.each(json.aoReportTestSuite.aoTestCase, function () {
        if (this.testCaseStatus == status) {
            uniqueTestCase.push(this.testCase);
        }
    });
    uniqueTestCase = $.unique(uniqueTestCase);
    return uniqueTestCase;
}

function getUniqueBrowser(status, testcase) {
    var uniqueBrowser = [];

    $.each(json.aoReportTestSuite.aoTestCase, function () {
        if (this.testCaseStatus == status) {
            if (testcase == 'All') {
                uniqueBrowser.push(this.browser);
            } else {
                if (this.testCase == testcase) {
                    uniqueBrowser.push(this.browser);
                }
            }
        }
    });

    uniqueBrowser = $.unique(uniqueBrowser);
    return uniqueBrowser;
}

function displayTestCaseDetail() {

    var loistofTestCaseHdr = [];
    var dropDownStatus = $('#dpstatus option:selected').text();
    var dropDownTestCase = $('#dptestcase option:selected').text();
    var dropDownBrowser = $('#dpbroswer option:selected').text();

    $('#collapseContentHere').empty();

    /*
     * Loop thru every Test Case
     */
    $.each(json.aoReportTestSuite.aoTestCase, function (index, value) {

        var newCollapse = "";

        if (dropDownTestCase == 'All' && dropDownBrowser == 'All') {
            if (dropDownStatus == this.testCaseStatus) {
                newCollapse = generateHTML4Filters(this.testCase,
                    this.testCaseStatus, this.browser, this.website,
                    this.testVideoURL, this.omnitureTestCase,
                    this.aoTestCaseStep, index, this.testCaseID, this.device, this.browserName);
            }
        } else if (dropDownTestCase != 'All' && dropDownBrowser == 'All') {
            if (dropDownStatus == this.testCaseStatus
                && dropDownTestCase == this.testCase) {
                newCollapse = generateHTML4Filters(this.testCase,
                    this.testCaseStatus, this.browser, this.website,
                    this.testVideoURL, this.omnitureTestCase,
                    this.aoTestCaseStep, index, this.testCaseID, this.device, this.browserName);
            }
        } else if (dropDownTestCase != 'All' && dropDownBrowser != 'All') {
            if (dropDownStatus == this.testCaseStatus
                && this.testCaseBrowser == dropDownTestCase
                + dropDownBrowser) {
                newCollapse = generateHTML4Filters(this.testCase,
                    this.testCaseStatus, this.browser, this.website,
                    this.testVideoURL, this.omnitureTestCase,
                    this.aoTestCaseStep, index, this.testCaseID, this.device, this.browserName);
            }
        } else if (dropDownTestCase == 'All' && dropDownBrowser != 'All') {
            if (dropDownStatus == this.testCaseStatus
                && dropDownBrowser == this.browser) {
                newCollapse = generateHTML4Filters(this.testCase,
                    this.testCaseStatus, this.browser, this.website,
                    this.testVideoURL, this.omnitureTestCase,
                    this.aoTestCaseStep, index, this.testCaseID, this.device, this.browserName);
            }
        }

        $(newCollapse).appendTo("#collapseContentHere");

    });

}

function generateHTML4Filters(testCase, testCaseStatus, browser, website,
                              testVideoURL, omnitureTestCase, aoTestCaseStep, index, testCaseID, device, browserName) {

    var testCaseHeader = "";
    var pannelHeading = "";
    var videoURL = "";
    var newCollapse = "";

    /*
     * START Provide the Header Information
     */

    var browserInfo = browser.split("_");

    var envval = json.aoReportTestSuite.environment;

    if (envval.toLowerCase() == "devices") {

        if (browserName = "chromedriver") {
            testCaseHeader = "Test Case Name: " + testCase + "_Devices | OS: " + device;

        } else if (browserName = "realipadsafari@safari") {
            testCaseHeader = "Test Case Name: " + testCase + "_Devices | OS: " + device;
        }

    } else {
        testCaseHeader = "Test Case Name: " + testCase + "_Desktop | Browser: " + browserInfo[0] + " " + browserInfo[1] + " | OS: " + browserInfo[2];
    }


    if (testCaseStatus == "Failed") {
        pannelHeading = "panel-heading-failed"
    } else {
        pannelHeading = "panel-heading-passed"
    }

    if (testVideoURL != "") {
        videoURL = '<a class="pull-right" onclick=openVideoURL("'
        + testVideoURL
        + '")><img width="32px" src="icon_video.png" alt="Load Video"></a>';
    } else {
        videoURL = "&nbsp;";
    }

    /*
     * END Provide the Header Information
     */

    var listofTestStep = aoTestCaseStep;
    /*
     * Generate HTML Code
     */
    var tableRow = "";
    newCollapse = "";

    $.each(listofTestStep, function (tsindex) {
        var listOfOmniCollpase = "";
        var tr = "";
        /*
         * START : Get the Request and Omniture Tag
         */
        if (this.omniture == "Y") {
            var listOfRequest = this.requests;

            $.each(listOfRequest, function (reqindex) {
                var omniPanelHeading = "";
                var omniCollpase = "";

                if (this.result == "Failed") {
                    omniPanelHeading = "panel-heading-failed"
                } else {
                    omniPanelHeading = "panel-heading-passed"
                }

                var listOfOmniture = this.omnitureTag;
                var omniTableRow = "";
                var omniTR = "";
                // Get list of Omniture Tag
                $.each(listOfOmniture, function (omniIndex) {
                    omniTR = generateOmniTR(this.tagKey, this.friendlyName,
                        this.tagValue, this.exepectedValue,
                        this.validationType, this.validationStatus)
                    omniTableRow = omniTableRow + "" + omniTR;
                });

                omniCollpase = generateOmnituteCollapseHTML(omniPanelHeading,
                    this.name, reqindex, omniTableRow, this.requestId)
                listOfOmniCollpase = listOfOmniCollpase + " " + omniCollpase;
            });
        }

        /*
         * END : Get the Request and Omniture Tag
         */

        tr = generateTR(this.type, this.description, this.result,
            this.testData, this.imageName, this.omniture, omnitureTestCase, tsindex,
            listOfOmniCollpase, testCaseID)
        tableRow = tableRow + "" + tr;

    });

    newCollapse = $(""
    + generateCollapse(pannelHeading, testCaseHeader, videoURL,
        tableRow, index, omnitureTestCase, testCaseID, testCaseStatus) + "");

    return newCollapse;
}

function generateOmnituteCollapseHTML(omniPanelHeading, name, reqindex,
                                      omniTableRow, requestId) {
    var omniCollpase = "";
    var firstCollpse = "";
    if (reqindex == 0) {
        firstCollpse = "in";
    }

    omniCollpase = "<div class='panel panel-default'>"
    + "<div class='panel-heading "
    + omniPanelHeading
    + "'>"
    + "<h4 class='panel-title'>"
    + "<a class='accordion-toggle' data-toggle='collapse' data-parent='#accordion'  href='#"
    + requestId
    + "'>"
    + " "
    + name
    + ""
    + " </a> "
    + "</h4><h5>Status : </h5>"
    + "</div>"
    +

    "<div id='"
    + requestId
    + "' class='panel-collapse collapse "
    + firstCollpse
    + "'>"
    + "<div class='panel-body'><table id='omnitureTable' class='table-bordered'"
    + "style='margin-left: 10px; margin-top: 5px; table-layout:fixed' width='95%'>"
    + "<tr class='tableHdr'>"
    + "<td width='10%' align='center'>Variable Name</td>"
    + "<td width='10%' align='center' >Friendly Name</td>"
    + "<td width='30%' align='center' style='overflow-x:hidden;'>Expected Value</td>"
    + "<td width='30%' align='center' style='overflow-x:hidden;'>Actual Value</td>"
    + "<td width='10%' align='center'>Validation Type</td>"
    + "<td width='10%' align='center'>Status</td>"
    + "</tr>"
    + omniTableRow + "</table>" + "</div></div></div>";

    return omniCollpase;
}

function generateOmniTR(tagKey, friendlyName, tagValue, exepectedValue,
                        validationType, validationStatus) {
    var rowColor = "";
    var omniTR = "";
    if (validationStatus == "Failed") {
        rowColor = "omni-failed-tags";
    } else {
        rowColor = "step";
    }
    omniTR = "<tr class='" + rowColor + " '>" + "<td><div align='center'>"
    + tagKey + "</div></td>" + "<td><divalign='center'>" + friendlyName
    + "</div></td>"
    + "<td><div align='left' style='width:100%; overflow-x:hidden;'>"
    + tagValue + "</div></td>"
    + "<td><div align='left' style='width:100%; overflow-x:hidden;'>"
    + exepectedValue + "</div></td>" + "<td><div align='center' >"
    + validationType + "</div></td>" + "<td><div align='center'>"
    + validationStatus + "</div></td>" + "</tr>";

    return omniTR;

}

function generateCollapse(pannelHeading, testCaseHeader, videoURL, tableRow,
                          index, omnitureTestCase, testCaseID, testCaseStatus) {
    var collpase = "";

    if (omnitureTestCase == "Y") {
        collpase = "<div class='panel panel-default'>"
        + "<div class='panel-heading "
        + pannelHeading
        + "'>"
        + "<h4 class='panel-title'>"
        + "<a class='accordion-toggle' data-toggle='collapse' data-parent='#accordion'  href='#collapse"
        + testCaseID
        + index
        + "'>"
        + ""
        + testCaseHeader
        + ""
        + " </a> "
        + videoURL
        + ""
        + "</h4>"
        + "</div>"
        +

        "<div id='collapse"
        + testCaseID
        + index
        + "' class='panel-collapse collapse'>"
        + "<div class='panel-body'><table id='stepSubStepTable' class='table-bordered'"
        + "style='margin-left: 20px; margin-top: 12px;' width='95%'>"
        + "<tr class='tableHdr'>"
        + "<td align='center'>Test Step</td>"
        + "<td align='center'>Sub Step</td>"
        + "<td align='center'>Omniture</td>"
        + "<td align='center'>Status</td>"
        + "<td align='center'>Test-Data</td>"
        + "<td align='center' >ScreenShot</td></tr>"
        + tableRow
        + "</table>" + "</div></div></div>";
    } else {
        collpase = "<div class='panel panel-default'>"
        + "<div class='panel-heading "
        + pannelHeading
        + "'>"
        + "<h4 class='panel-title'>"
        + "<a class='accordion-toggle' data-toggle='collapse' data-parent='#accordion'  href='#collapse"
        + index
        + "'>"
        + ""
        + testCaseHeader
        + ""
        + " </a> "
        + videoURL
        + ""
        + "</h4><h5>Status: " + testCaseStatus + "</h5>"
        + "</div>"
        +

        "<div id='collapse"
        + index
        + "' class='panel-collapse collapse'>"
        + "<div class='panel-body'><table id='stepSubStepTable' class='table-bordered'"
        + "style='margin-left: 20px; margin-top: 12px;' width='95%'>"
        + "<tr class='tableHdr'>"
        + "<td align='center'>Test Step</td>"
        + "<td align='center'>Sub Step</td>"
        + "<td align='center'>Status</td>"
        + "<td align='center'>Test-Data</td>"
        + "<td align='center'>ScreenShot</td></tr>"
        + tableRow
        + "</table>" + "</div></div></div>";

    }

    return collpase;
}

function generateTR(_type, _description, _result, _testData, _screenShot, _omniture,
                    _omnitureTestCase, _index, omniCollpase, testCaseID) {


    tr = "";
    var ScreenshotLink = "";
    if (_screenShot != "") {
        // var screenshot = _screenShot.split(/drillDownReports/);
// var length = screenshot[1].length;
// screenshot1 = screenshot[1].substring(1, length);
        ScreenshotLink = '<a class="cursor-p"	  onclick=openScreenShot("' + _screenShot + '")> <img height="20px" src="icon_camera.png" alt="ScreenShot"></a>';

    } else {
        ScreenshotLink = "&nbsp;";

    }
    if (_omnitureTestCase == 'Y') {
        var omnitureString = "";
        if (_omniture == 'Y') {
            omnitureString = "<a data-toggle='modal' data-target='#omniTargetId"
            + testCaseID
            + _index
            + "'>Omniture</a>"
            + "<div class='modal fade' id='omniTargetId"
            + testCaseID
            + _index
            + "' tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>"
            + "<div class='modal-dialog modal-lg'>"
            + "<div class='modal-content'>"
            + "<div class='modal-header'>"
            + "<button type='button' align='center' class='btn btn-default' class='close' data-dismiss='modal' aria-hidden='true' >Close</button>"
            + "</div>"
            + "<div class='modal-body'>"
            + omniCollpase
            + " </div></div>" + "</div>" + "</div>";
        } else {
            omnitureString = "";
        }
        if (_type == "step") {
            tr = "<tr class='step '>" + "<td width='35%'>" + _description
            + "</td>" + "<td width='35%'></td>"
            + "<td width='5%' align='center'>" + omnitureString
            + "</td>" + "<td width='5%' align='center'>" + _result
            + "</td>" + "<td width='20%' align='left'>" + _testData
            + "<td width='20%' align='center'>" + ScreenshotLink + "</td>"
            + "</tr>";
        } else {
            tr = "<tr class='substep'>" + "<td width='35%'></td>"
            + "<td width='35%'>" + _description + "</td>"
            + "<td width='5%' align='center'>" + omnitureString
            + "</td>" + "<td width='5%' align='center'>" + _result
            + "</td>" + "<td width='20%' align='left'>" + _testData
            + "<td width='20%' align='center'>" + ScreenshotLink + "</td>"
            + "</tr>";
        }
    } else {


        if (_type == "step") {

            if (_result == "Failed") {
                tr = "<tr class='step omni-failed-tags'>" + "<td width='35%'>" + _description
                + "</td>" + "<td width='35%'></td>"
                + "<td width='10%' align='center'>" + _result + "</td>"
                + "<td width='20%' align='left' class=''>" + _testData + "</td>"
                + "<td width='20%' align='center'>" + ScreenshotLink + "</td></tr>";
            } else {
                tr = "<tr class='step'>" + "<td width='35%'>" + _description
                + "</td>" + "<td width='35%'></td>"
                + "<td width='10%' align='center'>" + _result + "</td>"
                + "<td width='20%' align='left'>" + _testData + "</td>"
                + "<td width='20%' align='center'>" + ScreenshotLink + "</td></tr>";
            }

        } else {

            if (_result == "Failed") {
                tr = "<tr class='substep omni-failed-tags'>" + "<td width='35%'></td>"
                + "<td width='35%'>" + _description + "</td>"
                + "<td width='10%' align='center'>" + _result + "</td>"
                + "<td width='20%' align='left' >" + _testData + "</td>"
                + "<td width='20%' align='center'>" + ScreenshotLink + "</td></tr>";
            } else {
                tr = "<tr class='substep'>" + "<td width='35%'></td>"
                + "<td width='35%'>" + _description + "</td>"
                + "<td width='10%' align='center'>" + _result + "</td>"
                + "<td width='20%' align='left'>" + _testData + "</td>"
                + "<td width='20%' align='center'>" + ScreenshotLink + "</td></tr>";

            }


        }

    }

    return tr;
}
function openVideoURL(url) {
    window
        .open(
        "loadvideo.html?jsurl=" + url,
        url,
        "width=640,height=480,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,copyhistory=no,resizable=no");
}

function getBrowserImage(brows) {
    if (brows.indexOf("firefox") != -1) {
        return "<img src='firefox.png' alt='Firefox'>"
    } else if (brows.indexOf("chrome") != -1) {
        return "<img src='chrome.png' alt='Chrome'>"
    } else if (brows.indexOf("safari") != -1) {
        return "<img src='safari.png' alt='Safari'>"
    } else if (brows.indexOf("explorer") != -1) {
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
function openScreenShot(url) {
    window.open(url, url, "width=640,height=480,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,copyhistory=no,resizable=no");
}