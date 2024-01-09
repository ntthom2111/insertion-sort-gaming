 
    // Sorting Widget
    // original author: Ian Leow Tze Wei
    // taken over by Steven on Sat 25 Dec 2021 Christmas day to fix randomize Quick Sort on (many) duplicates

    var Sorting = function () {
        var computeInversionIndex = true; // Quick hack on 26 Dec 2021, it will be true from now onwards for Bubble and Merge sort...
        // constants
        var RADIX_CHANGE_BASE = "radix_change_base";
  
        var HIGHLIGHT_NONE = "lightgreen";
        var HIGHLIGHT_STANDARD = "lightblue";
        var HIGHLIGHT_SPECIAL = "#DC143C";
        var HIGHLIGHT_SORTED = "pink";
  
        var HIGHLIGHT_LEFT = "#3CB371";
        var HIGHLIGHT_RIGHT = "red";
        var HIGHLIGHT_PIVOT = "yellow";
  
        var HIGHLIGHT_GRAY = "#CCCCCC";
  
        var HIGHLIGHT_RAINBOW = [ // TODO: can consider making a function to generate a specturm of hex values depending on num of elements - Ting Xiao
          "#FF0000",
          "#FF4000",
          "#FF8000",
          "#FFBF00",
          "#FFFF00",
          "#BFFF00",
          "#80FF00",
          "#40FF00",
          //"#00FF00",
          "#00FF40",
          "#00FF80",
          "#00FFBF",
          "#00FFFF",
          "#00BFFF",
          "#0080FF",
          "#0040FF",
          "#0000FF",
          "#4000FF",
          "#8000FF",
          "#BF00FF",
          "#FF00FF"
        ];
  
        var HIGHLIGHT_BLUESHADES = [
          HIGHLIGHT_GRAY,
          HIGHLIGHT_NONE,
          "#9DC4E8",
          "#8EB1EB",
          "#7E9DED",
          "#6E89EF",
          "#5E76F1",
          "#4F62F4",
          "#3F4FF6",
          "#2F3BF8",
          "#1F27FA",
          "#1014FD",
          "#0000FF",
          "#0000FF",
          "#0000FF",
          "#0000FF",
          "#0000FF",
          "#0000FF",
          "#0000FF",
          "#0000FF",
          "#0000FF"
        ];
  
        var POSITION_USE_PRIMARY = "a";
        var POSITION_USE_SECONDARY_IN_DEFAULT_POSITION = "b";
  
        // Objects definition
        var Entry = function (value, highlight, position, secondaryPositionStatus) {
          this.value = value; // number
          this.highlight = highlight; // string, use HIGHLIGHT_ constants
          this.position = position; // number
          this.secondaryPositionStatus = secondaryPositionStatus; // integer, +ve for position overwrite, -ve for absolute postion (-1 for 0th absolution position)
        }
  
        var Backlink = function (value, highlight, entryPosition, secondaryPositionStatus) {
          this.value = value; // number
          this.highlight = highlight; // string, use HIGHLIGHT_ constants
          this.entryPosition = entryPosition; // number
          this.secondaryPositionStatus = secondaryPositionStatus; // integer, +ve for position overwrite
        }
  
        var State = function (entries, backlinks, barsCountOffset, status, lineNo) {
          this.entries = entries; // array of Entry's
          this.backlinks = backlinks; // array of Backlink's
          this.barsCountOffset = barsCountOffset; // how many bars to "disregard" (+ve) or to "imagine" (-ve) w.r.t. state.entries.length when calculating the centre position
          this.status = status;
          this.lineNo = lineNo; //integer or array, line of the code to highlight
        }
  
        //Helpers
        var EntryBacklinkHelper = new Object();
        EntryBacklinkHelper.appendList = function (entries, backlinks, numArray) {
          for (var i = 0; i < numArray.length; ++i) {
            EntryBacklinkHelper.append(entries, backlinks, numArray[i]);
          }
        }
  
        EntryBacklinkHelper.append = function (entries, backlinks, newNumber) {
          entries.push(new Entry(newNumber, HIGHLIGHT_NONE, entries.length, POSITION_USE_PRIMARY));
          backlinks.push(new Backlink(newNumber, HIGHLIGHT_NONE, backlinks.length, POSITION_USE_PRIMARY));
        }
  
        EntryBacklinkHelper.update = function (entries, backlinks) {
          for (var i = 0; i < backlinks.length; ++i) {
            entries[backlinks[i].entryPosition].highlight = backlinks[i].highlight;
            entries[backlinks[i].entryPosition].position = i;
            entries[backlinks[i].entryPosition].secondaryPositionStatus = backlinks[i].secondaryPositionStatus;
          }
        }
  
        EntryBacklinkHelper.copyEntry = function (oldEntry) {
          return new Entry(oldEntry.value, oldEntry.highlight, oldEntry.position, oldEntry.secondaryPositionStatus);
        }
  
        EntryBacklinkHelper.copyBacklink = function (oldBacklink) {
          return new Backlink(oldBacklink.value, oldBacklink.highlight, oldBacklink.entryPosition, oldBacklink.secondaryPositionStatus);
        }
  
        EntryBacklinkHelper.swapBacklinks = function (backlinks, i, j) {
          var swaptemp = backlinks[i];
          backlinks[i] = backlinks[j];
          backlinks[j] = swaptemp;
        }
  
        var StateHelper = new Object();
        StateHelper.createNewState = function (numArray) {
          var entries = new Array();
          var backlinks = new Array();
          EntryBacklinkHelper.appendList(entries, backlinks, numArray);
          return new State(entries, backlinks, 0, "", 0);
        }
  
        StateHelper.copyState = function (oldState) {
          var newEntries = new Array();
          var newBacklinks = new Array();
          for (var i = 0; i < oldState.backlinks.length; ++i) {
            newEntries.push(EntryBacklinkHelper.copyEntry(oldState.entries[i]));
            newBacklinks.push(EntryBacklinkHelper.copyBacklink(oldState.backlinks[i]));
          }
  
          var newLineNo = oldState.lineNo;
          if (newLineNo instanceof Array)
            newLineNo = oldState.lineNo.slice();
  
          return new State(newEntries, newBacklinks, oldState.barsCountOffset, oldState.status, newLineNo);
        }
  
        StateHelper.updateCopyPush = function (list, stateToPush) {
          EntryBacklinkHelper.update(stateToPush.entries, stateToPush.backlinks);
          list.push(StateHelper.copyState(stateToPush));
        }
  
        var FunctionList = new Object();
        FunctionList.text_y = function (d) {
          var barHeight = scaler(d.value) + 3;
          if (barHeight < 35) return -15;
          return barHeight - 15;
        }
  
        // not used by radix sort at all 
        // changes y-axis of rectangle
        FunctionList.g_transform = function (d) {
          if (d.secondaryPositionStatus == POSITION_USE_PRIMARY)
            return 'translate(' + (centreBarsOffset + d.position * barWidth) + ", " + (maxHeight - scaler(d.value) - 3) + ')';
          else if (d.secondaryPositionStatus == POSITION_USE_SECONDARY_IN_DEFAULT_POSITION)
            return 'translate(' + (centreBarsOffset + d.position * barWidth) + ", " + (maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows - scaler(d.value) - 3) + ')';
          else if (typeof d.secondaryPositionStatus == "string")  // for stable counting sort
            return 'translate(' + (centreBarsOffset + Number(d.secondaryPositionStatus) * barWidth) + ", " + (maxHeight - scaler(d.value) - 3) + ')';
          else if (d.secondaryPositionStatus >= 0)
            return 'translate(' + (centreBarsOffset + d.secondaryPositionStatus * barWidth) + ", " + (maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows - scaler(d.value) - 3) + ')';
          else if (d.secondaryPositionStatus < 0)
            return 'translate(' + (counter_bar_offset[maxCountingSortElementValue - 1] + (d.secondaryPositionStatus * -1 - 3) * barWidth) + ", " + (maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows - scaler(d.value) - 3) + ')';
          else
            return 'translation(0, 0)'; // error
        }
  
        FunctionList.radixElement_left = function (d) {
          if (d.secondaryPositionStatus == POSITION_USE_PRIMARY)
            return d.position * 65 + centreBarsOffset + "px";
          return d.secondaryPositionStatus * 65 + 17.5 + "px";
        }
  
        FunctionList.radixElement_bottom = function (d, i) {
          if (d.secondaryPositionStatus == POSITION_USE_PRIMARY)
            return 500 - 24 + "px";
          //console.log(i + " " + radixSortBucketOrdering[i]);
          return radixSortBucketOrdering[i] * 30 + 105 + "px";
        }
  
        FunctionList.radixElement_html = function (d) {
          var text = (typeof d.highlight === 'string' && d.highlight.trim() == HIGHLIGHT_NONE)
            ? d.value
            : changeTextBasedOnRadixSortBase(d.value);
  
          if (typeof d.highlight === 'string') {
            if (d.highlight.endsWith(" "))
              text = "<span style='color: palevioletred;'>" + text + "</span>";
            return text;
  
            if (d.highlight.trim() == HIGHLIGHT_NONE)
              return text;
          }
  
          while (text.length != 4)
            text = " " + text;
  
          var positionToHighlight = 0; // positionToHighlight = log_to_base_10(d.highlight), assumes d.highlight is power of 10
          var positionCounter = d.highlight;
          while (positionCounter != 1) {
            positionToHighlight++;
            positionCounter /= 10;
          }
  
          positionToHighlight = 3 - positionToHighlight;
  
          if (text.charAt(positionToHighlight) != " ") {
            text = text.slice(0, positionToHighlight) +
              "<span style='color: #B40404;'>" +
              text.charAt(positionToHighlight) +
              "</span>" +
              text.slice(positionToHighlight + 1);
          }
  
          text = text.trim();
          return text;
        }
  
        const numberMap = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
        var changeTextBasedOnRadixSortBase = function (value) {
          var result = [];
  
          if (value == 0) {
            return "0000";
          }
  
          while (value > 0) {
            currentValue = value % radixSortBase;
            result.push(numberMap[currentValue]);
            value = Math.floor(value / radixSortBase);
          }
  
          while ((radixSortBase !== 10) && (result.length < 4)) {
            result.push(numberMap[0]);
          }
  
          return result.reverse().join("");
        }
  
        var makePaler = function (hexColor) {
          var red = Math.floor(parseInt(hexColor.slice(1, 3), 16) + 150);
          var green = Math.floor(parseInt(hexColor.slice(3, 5), 16) + 150);
          var blue = Math.floor(parseInt(hexColor.slice(5, 7), 16) + 150);
  
          if (red > 255) red = 255;
          if (green > 255) green = 255;
          if (blue > 255) blue = 255;
  
          red = red.toString(16);
          green = green.toString(16);
          blue = blue.toString(16);
  
          if (red.length == 1) red = "0" + red;
          if (green.length == 1) green = "0" + green;
          if (blue.length == 1) blue = "0" + blue;
          return "#" + red + green + blue;
        }
  
        // Variables/Settings
        this.currentNumList = [29, 10, 14, 37, 14]; // the default
        var isMediumScale = false;
        var barWidth = 50;
        var maxHeight = 230;
        var gapBetweenBars = 5;
        var maxNumOfElements = 18; // dropped from 20 to 15 on 25 Feb, changed to 18 on 18 Mar (otherwise too far left after mobile design integration) - 50 is used for medium-scale viz as of now
        var gapBetweenPrimaryAndSecondaryRows = 100; // 30; // of the bars
        var numOfElements = 10;
  
        const counter_bar_offset = [300, 275, 250, 225, 200, 175, 150, 125, 100, 75, 50, 25, 0, -25, -50];
        const index_bar_offset = [425, 400, 375, 350, 325, 300, 275, 250, 225, 200, 175, 150, 125, 100, 75, 50, 25, 0];
        var maxCountingSortElementValue = 9;
        var radixSortBase = 10;
        const maxRadixSortElements = 12;
        var maxRadixSortElementValue = 9999; // Note that this isn't really customizable, as the code for radix sort is written with this value = 9999 in mind.
        var maxElementValue = 50; // for all other sorts - this is fully customizable (seriously)
  
        var graphElementSize = 10; // The width of the square in the side-graph representing 1 element
        var graphElementGap = 2; // The width of the gap between each element in the side-graph
        var graphRowGap = 10; // The height of the gap between each row in the side graph
  
        //Code body
        var statelist = new Array();
        var secondaryStatelist = new Array();
        var transitionTime = 500;
        var currentStep = 0;
        var animInterval;
        var issPlaying; //so named so as not to mess with the isPlaying in viz.js
  
        var quickSortUseRandomizedPivot; //true-false flag
        var mergeSortInversionIndexCounter; //used by merge sort to count the inversion index
        var centreBarsOffset; // x offset to centre the bars in the canvas
        var radixSortBucketOrdering; // used to order the elements inside each bucket (for radix sort). for formatting purposes.
  
        var isRadixSort = false;
        var isCountingSort = false;
  
        this.selectedSortFunction;
        // this.useEnhancedBubbleSort = false;
        // this.computeInversionIndex = false; // Quick hack on 26 Dec 2021, it will be true from now onwards for Bubble and Merge sort...
  
        var canvas = d3.select("#viz")
          .attr("height", maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows)
          .attr("width", barWidth * maxNumOfElements);
  
        var countingSortSecondaryCanvas = d3.select("#viz-counting-sort-secondary-canvas")
          .attr("height", 30) // 25 Feb, previously 60
          .attr("width", barWidth * maxNumOfElements);
  
        var sortIndexCanvas = d3.select("#viz-sort-index-canvas")
          .attr("height", 30)
          .attr("width", barWidth * (maxNumOfElements + 4));
  
        var radixSortCanvas = d3.select("#viz-radix-sort-canvas");
  
        var scaler = d3.scale
          .linear()
          .range([0, maxHeight]);
  
        var drawState = function (stateIndex) {
          if (isCountingSort)
            maxHeight = 160; // make the bars shorter by half for counting sort
          else
            maxHeight = 230;
  
          // refresh scaler function
          scaler = d3.scale.linear().range([0, maxHeight]);
  
          if (isRadixSort)
            drawRadixSortCanvas(statelist[stateIndex], secondaryStatelist[stateIndex]);
          else
            drawBars(statelist[stateIndex]);
  
          $('#status p').html(statelist[stateIndex].status);
          highlightLine(statelist[stateIndex].lineNo);
  
          drawIndexCounters();
          if (isCountingSort)
            drawCountingSortCounters(secondaryStatelist[stateIndex]);
  
        };
  
        var drawBars = function (state) {
          scaler.domain([0, d3.max(state.entries, function (d) {
            return d.value + 3;
          })]);
  
          centreBarsOffset = (maxNumOfElements - (state.entries.length - state.barsCountOffset)) * barWidth / 2;
  
          var canvasData = canvas.selectAll("g").data(state.entries);
  
          // Exit ==============================
          var exitData = canvasData.exit()
            .remove();
  
          // Entry ==============================
          var newData = canvasData.enter()
            .append("g")
            .attr("transform", FunctionList.g_transform);
  
          newData.append("rect")
            .attr("height", 0)
            .attr("width", 0);
  
          newData.append("text")
            .attr("dy", ".35em")
            .attr("x", (barWidth - gapBetweenBars) / 2)
            .attr("y", FunctionList.text_y)
            .text(function (d) {
              return d.value;
            });
  
          // Update ==============================
          canvasData.select("text")
            .transition()
            .attr("y", FunctionList.text_y)
            .text(function (d, i) {
              return d.value;
            });
  
          canvasData.select("rect")
            .transition()
            .attr("height", function (d) {
              return scaler(d.value) + 3;
            })
            .attr("width", barWidth - gapBetweenBars)
            .style("fill", function (d) {
              if (d.highlight.endsWith(" ")) {
                return "palevioletred";
              }
              return d.highlight.trim();
            });
  
          canvasData.transition()
            .attr("transform", FunctionList.g_transform)
  
          if (isMediumScale) {
            canvas.selectAll("g").select("text").style("font-size", "0px");
          }
        };
  
        var drawCountingSortCounters = function (state) {
          // draws the numbers for the counting sort rectangles
          var canvasData;
          if (state == null)
            canvasData = countingSortSecondaryCanvas.selectAll("text").data([]);
          else
            canvasData = countingSortSecondaryCanvas.selectAll("text").data(state);
  
          // Exit ==============================
          var exitData = canvasData
            .exit()
            .remove();
  
          // Entry ==============================
          var newData = canvasData
            .enter()
            .append("text")
            .attr("dy", ".35em")
            .attr("x", function (d, i) {
              return counter_bar_offset[maxCountingSortElementValue - 1] + (i + 2) * barWidth + (barWidth - gapBetweenBars) / 2;
            })
            .attr("y", function (d) {
              return isMediumScale ? 20 : 10;
            })
            .text(function (d) {
              return d;
            });
  
          // Update ==============================
          canvasData
            .transition()
            .text(function (d) {
              return d;
            });
  
          if (isMediumScale) {
            countingSortSecondaryCanvas.selectAll("text").style("font-size", "15px");
          } else {
            countingSortSecondaryCanvas.selectAll("text").style("font-size", "20px");
          }
        };
  
        var drawIndexCounters = function () {
          if (isMediumScale) {
            return;
          }
  
          var arr = [];
          for (var i = 0; i < numOfElements; i++) {
            arr.push(i);
          }
  
          var canvasData = sortIndexCanvas.selectAll("text").data(arr);
          var element = document.getElementById("viz-sort-index-canvas");
          element.style.top = isCountingSort ? "-395px" : "-325px";
          element.style.left = `${index_bar_offset[numOfElements - 1]}px`;
  
          // Exit ==============================
          var exitData = canvasData
            .exit()
            .remove();
  
          // Entry ==============================
          var newData = canvasData
            .enter()
            .append("text")
            .attr("dy", ".35em")
            .attr("x", function (d, i) {
              return (i + 2) * barWidth + (barWidth - gapBetweenBars) / 2;
            })
            .attr("y", 10)
            .text(function (d) {
              return d;
            });
  
          // Update ==============================
          canvasData
            .transition()
            .text(function (d) {
              return d;
            });
        };
  
        var drawRadixSortCanvas = function (state, secondaryState) {
          centreBarsOffset = (1000 - (state.entries.length * 65 - 10)) / 2; // uh, it's not really bars now, but just reusing the variable - same concept still
          var canvasData = radixSortCanvas.selectAll("div").data(state.entries);
          var radixSortBucketCount = new Array(radixSortBase).fill([]);
          radixSortBucketOrdering = new Array(state.backlinks.length);
  
          for (var i = 0; i < state.backlinks.length; ++i) {
            if (state.backlinks.secondaryPositionStatus != POSITION_USE_PRIMARY)
              radixSortBucketOrdering[state.backlinks[i].entryPosition] = radixSortBucketCount[state.backlinks[i].secondaryPositionStatus]++;
          }
  
          // Handle the buckets' DIV's
          if (secondaryState) {
            $("#radix-sort-bucket-labels-collection").show();
            for (var i = 0; i <= 15; i++) {
              $(`#radix_base_${numberMap[i]}`).show();
            }
  
            // only display the buckets that are being used for radix sort based on the chosen base
            for (var i = radixSortBase; i <= 15; i++) {
              $(`#radix_base_${numberMap[i]}`).hide();
            }
          }
          else {
            $("#radix-sort-bucket-labels-collection").hide();
          }
  
          // Exit ==============================
          var exitData = canvasData.exit()
            .remove();
  
          // Entry ==============================
          var newData = canvasData.enter()
            .append("div")
            .classed({ "radix-sort-element": true })
            .style({
              "left": FunctionList.radixElement_left,
              "bottom": FunctionList.radixElement_bottom
            })
            .html(FunctionList.radixElement_html);
  
          // Update ==============================
          canvasData.html(FunctionList.radixElement_html)
            .transition()
            .style({
              "left": FunctionList.radixElement_left,
              "bottom": FunctionList.radixElement_bottom
            });
        };
  
        var generateRandomNumberArray = function (size, limit) {
          var numArray = new Array();
          for (var i = 0; i < size; ++i) {
            // resurrect 0 into the scale
            numArray.push(generateRandomNumber(0, limit));
          }
          return numArray;
        };
  
        var generateRandomNumber = function (min, max) { // generates a random integer between min and max (both inclusive)
          return Math.floor(Math.random() * (max - min + 1)) + min;
        };
  
        var convertToNumber = function (num) {
          return +num;
        };
  
        this.changeBarWidth = function (width) {
          // 1. sets a new barWidth value
          // 2. redraws the visualisation
          // possibly split this function in 2 - 1 for shrinking 1 for reverting to default size
          if (isRadixSort) { // don't do anything for radix since it's different
            return;
          }
  
          barWidth = width;
          if (width >= 50) {
            gapBetweenBars = 5;
            maxNumOfElements = 18;
            isMediumScale = false;
          } else {
            gapBetweenBars = 13;
            maxNumOfElements = 43;
            isMediumScale = true;
          }
  
          if (width >= 50) {
            canvas.selectAll("g").select("text").style("font-size", "20px").attr("x", (barWidth - gapBetweenBars) / 2);
          } else {
            canvas.selectAll("g").select("text").style("font-size", "0px");
          }
  
        }
  
        this.createList = function (type, n) {
          // user input cannot be negative
          if (n <= 0) {
            $("#create-err").html('You can only enter a positive number.');
            return false;
          }
          else if (n > 43) {
            $("#create-err").html('The maximum value of n is 43.');
            return false;
          }
  
          // var numArrayMaxListSize = isMediumScale ? 50 : 15; // on 25 Feb 2022, I lower this from 20 down to 15... (to make it nicer on mobile)
          var numArrayMaxListSize = n;
          var numArrayMaxElementValue = maxElementValue;
          if (this.selectedSortFunction == this.radixSort) {
            if (n > maxRadixSortElements) {
              $("#create-err").html('You can&#39;t have more than {maxSize} elements!'.replace("{maxSize}", maxRadixSortElements));
              return false;
            }
  
            numArrayMaxElementValue = maxRadixSortElementValue;
          }
          else if (this.selectedSortFunction == this.countingSort) {
            numArrayMaxElementValue = maxCountingSortElementValue;
          }
  
          // using default scale, maximum number of bars that can be displayed is 18
          if (numArrayMaxListSize > 18) {
            setMediumScale();
          } else {
            setDefaultScale();
          }
  
          var numArray = generateRandomNumberArray(numArrayMaxListSize, numArrayMaxElementValue);
          if (type.indexOf("many") != -1) {
            var range = generateRandomNumber(1, 4); // 1, 2, 3, or 4 different numbers only
            numArray = generateRandomNumberArray(numArrayMaxListSize, range);
          }
  
          numOfElements = numArrayMaxListSize;
  
          switch (type) {
            case 'random':
            case 'many-duplicates':
              break; // already done above
            case 'sorted-non-decreasing':
            case 'nearly-sorted-non-decreasing':
              numArray.sort(d3.ascending);
              break;
            case 'sorted-non-increasing':
            case 'nearly-sorted-non-increasing':
              numArray.sort(d3.descending);
              break;
            case 'userdefined':
              numArray = $('#userdefined-input').val().split(",");
  
              if ((this.selectedSortFunction == this.radixSort) && (numArray.length > maxRadixSortElements)) {
                $("#create-err").html('You can&#39;t have more than {maxSize} elements!'.replace("{maxSize}", maxRadixSortElements));
                return false;
              }
  
              for (var i = 0; i < numArray.length; ++i) {
                var temp = convertToNumber(numArray[i]);
  
                if (numArray[i].trim() == "") {
                  $("#create-err").html('There seems to be a missing element (a duplicate comma somewhere perhaps?)');
                  return false;
                }
                if (isNaN(temp)) {
                  $("#create-err").html('There seems to be an invalid element (not a number): {num}.'.replace("{num}", numArray[i]));
                  return false;
                }
                if (temp < 0 || temp > numArrayMaxElementValue) {
                  $("#create-err").html(`Sorry, you're restricted to values between 0 and ${numArrayMaxElementValue} inclusive. (Out of range number: ${numArray[i]}.)`);
                  return false;
                }
  
                numArray[i] = convertToNumber(numArray[i]);
              }
  
              numOfElements = numArray.length;
  
              if (numArray.length > 18) {
                setMediumScale();
              } else {
                setDefaultScale();
              }
              break;
          }
  
          if (type.indexOf("nearly") != -1) {
            // To make the list nearly sorted, we take the already sorted list and make swaps
            // such that the list becomes not sorted. The number of such swaps varies from 1 to 2 (customizable).
            // The idea is that the more swaps we make, the less "sorted" the list is.
            //
            // Another limitation is that each swap occurs between elements that are at most 3 positions away.
            while (true) {
              var newNumArray = numArray.slice();
  
              var numOfSwaps = generateRandomNumber(1, 2);
              for (var i = 0; i < numOfSwaps; ++i) {
                var firstSwappingIndex = generateRandomNumber(0, newNumArray.length - 4);
                var secondSwappingIndex = generateRandomNumber(1, 3) + firstSwappingIndex;
  
                var temp = numArray[firstSwappingIndex];
                newNumArray[firstSwappingIndex] = numArray[secondSwappingIndex];
                newNumArray[secondSwappingIndex] = temp;
              }
  
              // We compare the numArray with newNumArray, if they're are the same,
              // we try again, else we reassign numArray to newNumArray and break.
              var isEquals = true;
              for (var i = 0; i < numArray.length; ++i) {
                if (numArray[i] != newNumArray[i]) {
                  isEquals = false;
                  break;
                }
              }
  
              if (!isEquals) {
                numArray = newNumArray;
                break;
              }
            }
          }
  
          this.loadNumberList(numArray);
        }
  
        this.loadNumberList = function (numArray) {
          $("#create-err").html("");
  
          issPlaying = false;
          currentStep = 0;
          this.currentNumList = numArray;
  
          //console.log("numArray: " + numArray);
  
          statelist = [StateHelper.createNewState(numArray)];
          secondaryStatelist = [null]; // the initial secondary state will be an empty state
          drawState(0);
        }
  
        this.setSelectedSortFunction = function (f) {
          this.selectedSortFunction = f;
          isRadixSort = (this.selectedSortFunction == this.radixSort);
          isCountingSort = (this.selectedSortFunction == this.countingSort);
        }
  
        this.setCountingSortBase = function (k) {
          if (k < 2 || k > 16) {
            $("#create-err").html("Sorry, you're restricted to values between 2 and 16 inclusive.");
            return false;
          }
  
          maxCountingSortElementValue = k - 1;
          return true;
        }
  
        this.setRadixSortBase = function (k) {
          if (k < 2 || k > 16) {
            $("#create-err").html("Sorry, you're restricted to values between 2 and 16 inclusive.");
            return false;
          }
  
          radixSortBase = k;
          maxRadixSortElementValue = Math.pow(k, 3);
          return true;
        }
  
        this.sort = function (callback) {
          return this.selectedSortFunction(callback);
        }      
  
        
        this.insertionSort = function (callback) {
          var numElements = statelist[0].backlinks.length;
          var state = StateHelper.copyState(statelist[0]);
  
          populatePseudocode([
            'mark first element as sorted',
            'for each unsorted element X',
            '  &#39;extract&#39; the element X',
            '  for j = lastSortedIndex down to 0',
            '    if current element j &gt; X',
            '      move sorted element to the right by 1',
            '    break loop and insert X here'
          ]);
  
          // First element always sorted
          state.lineNo = 1;
          // Mark the first element ({firstVal}) as sorted.
          state.status = 'Đánh dấu chỉ số 0 ({firstVal}) là đã được sắp xếp.'.replace("{firstVal}", state.backlinks[0].value);
          // state.status = 'Mark the first element ({firstVal}) as sorted.'.replace("{firstVal}", state.backlinks[0].value);
          state.backlinks[0].highlight = HIGHLIGHT_SORTED;
          StateHelper.updateCopyPush(statelist, state);
  
          for (var i = 1; i < numElements; ++i) {
            // Highlight first unsorted element
            state.lineNo = [2, 3];
            // Extract the first unsorted element ({val}).
            state.status = 'Rút ra phần tử đầu tiên chưa được sắp xếp ở chỉ số {idx} ({val}).'.replace("{idx}", i).replace("{val}", state.backlinks[i].value);
            // state.status = 'Extract the first unsorted element ({val}).'.replace("{val}", state.backlinks[i].value);
            state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
            state.backlinks[i].secondaryPositionStatus = POSITION_USE_SECONDARY_IN_DEFAULT_POSITION;
            StateHelper.updateCopyPush(statelist, state);
  
            for (var j = i - 1; j >= 0; --j) {
              state.lineNo = 4;
              // Figure where to insert extracted element.
              // Comparing with sorted element {val}.
              state.status = 'Tìm đến nơi để chèn phần tử vừa được rút ra. So sánh với phần tử đã được sắp xếp ở chỉ số {idx} ({val}).'.replace("{idx}", j).replace("{val}", state.backlinks[j].value);
              // state.status = 'Figure where to insert extracted element; comparing with sorted element {val}.'.replace("{val}", state.backlinks[j].value);
              state.backlinks[j].highlight = HIGHLIGHT_STANDARD;
              StateHelper.updateCopyPush(statelist, state);
  
              if (state.backlinks[j].value > state.backlinks[j + 1].value) {
                state.lineNo = [5, 6];
                // {val1} > {val2} is true.
                // Hence move current sorted element ({val1}) to the right by 1.
                state.status = 'Nếu {val1} > {val2} là đúng, di chuyển phần tử đã được sắp xếp hiện tại ({val1}) tới vị trí đúng sang phải 1 bước tới chỉ số {idx}.'
                  .replace("{val1}", state.backlinks[j].value)
                  .replace("{val2}", state.backlinks[j + 1].value)
                  .replace("{val1}", state.backlinks[j].value)
                  .replace("{idx}", j + 1);
                // state.status = '{val1} > {val2} is true, hence move current sorted element ({val1}) to the right by 1.'.replace("{val1}", state.backlinks[j].value).replace("{val2}", state.backlinks[j+1].value).replace("{val1}", state.backlinks[j].value);
                EntryBacklinkHelper.swapBacklinks(state.backlinks, j, j + 1);
                StateHelper.updateCopyPush(statelist, state);
                state.backlinks[j + 1].highlight = HIGHLIGHT_SORTED;
              }
              else {
                state.lineNo = 7;
                // {val1} > {val2} is false.
                // Insert extracted element at current position.
                state.status = 'Nếu {val1} > {val2} là sai. Chèn phần tử đã được rút ra ở vị trí (index {idx}) hiện tại.'
                  .replace("{val1}", state.backlinks[j].value)
                  .replace("{val2}", state.backlinks[j + 1].value)
                  .replace("{idx}", j + 1);
                // state.status = '{val1} > {val2} is false, insert element at current position.'.replace("{val1}", state.backlinks[j].value).replace("{val2}", state.backlinks[j+1].value);
                state.backlinks[j].highlight = HIGHLIGHT_SORTED;
                state.backlinks[j + 1].secondaryPositionStatus = POSITION_USE_PRIMARY;
                state.backlinks[j + 1].highlight = HIGHLIGHT_SORTED;
                StateHelper.updateCopyPush(statelist, state);
                break;
              }
            }
  
            if (state.backlinks[0].secondaryPositionStatus == POSITION_USE_SECONDARY_IN_DEFAULT_POSITION) {
              state.lineNo = 4;
              // At beginning of array (nothing to compare).
              // Hence insert extracted element at current position.
              state.status = 'Tại chỉ số 0 (không có gì để so sánh). Chèn phần tử được rút ra ở vị trí (index 0) hiện tại.';
              // state.status = 'At beginning of array (nothing to compare), hence insert element at current position.';
              state.backlinks[0].secondaryPositionStatus = POSITION_USE_PRIMARY;
              state.backlinks[0].highlight = HIGHLIGHT_SORTED;
              StateHelper.updateCopyPush(statelist, state);
            }
          }
  
          for (var i = 0; i < numElements; ++i)
            state.backlinks[i].highlight = HIGHLIGHT_NONE; //unhighlight everything
          state.lineNo = 0;
          // The array/list is now sorted.
          state.status = 'Danh sách đã được sắp xếp xong!';
          StateHelper.updateCopyPush(statelist, state);
  
          this.play(callback);
          return true;
        }
  
        this.selectionSort = function (callback) {
          var numElements = statelist[0].backlinks.length;
          var state = StateHelper.copyState(statelist[0]);
  
          populatePseudocode([
            'repeat (numOfElements - 1) times',
            '  set the first unsorted element as the minimum',
            '  for each of the unsorted elements',
            '    if element < currentMinimum',
            '      set element as new minimum',
            '  swap minimum with first unsorted position'
          ]);
  
          for (var i = 0; i < numElements - 1; ++i) {
            var minPosition = i;
  
            // Iteration {iteration}: Set {val} as the current minimum.
            // Then iterate through the rest to find the true minimum.
            state.status = 'Iteration {iteration}: Set {val} as the current minimum, then iterate through the remaining unsorted elements to find the true minimum.'.replace("{iteration}", (i + 1)).replace("{val}", state.backlinks[i].value);
            state.lineNo = [1, 2, 3];
            state.backlinks[minPosition].highlight = HIGHLIGHT_SPECIAL;
  
            StateHelper.updateCopyPush(statelist, state);
  
            for (var j = i + 1; j < numElements; ++j) {
              // Check if {val} is smaller than the current minimum ({minVal}).
              state.status = 'Check if {val} is smaller than the current minimum ({minVal}).'.replace("{val}", state.backlinks[j].value).replace("{minVal}", state.backlinks[minPosition].value);
              state.lineNo = 4;
              state.backlinks[j].highlight = HIGHLIGHT_STANDARD;
              StateHelper.updateCopyPush(statelist, state);
  
              state.backlinks[j].highlight = HIGHLIGHT_NONE;
  
              if (state.backlinks[j].value < state.backlinks[minPosition].value) {
                state.status = 'Set {val} as the new minimum.'.replace("{val}", state.backlinks[j].value);
                state.lineNo = 5;
                state.backlinks[minPosition].highlight = HIGHLIGHT_NONE;
                state.backlinks[j].highlight = HIGHLIGHT_SPECIAL;
  
                minPosition = j;
                StateHelper.updateCopyPush(statelist, state);
              }
            }
  
            if (minPosition != i) { // Highlight the first-most unswapped position, if it isn't the minimum
              // Set {val} as the new minimum.
              state.status = 'Swap the minimum {minVal} at index {idx1} with the first unsorted element (47) at index {idx2}.'.replace("{minVal}", state.backlinks[minPosition].value).replace("{element}", state.backlinks[i].value).replace("{idx1}", minPosition).replace("{idx2}", i);
              // state.status = 'Swap the minimum ({minVal}) with the first unsorted element ({element}).'.replace("{minVal}", state.backlinks[minPosition].value).replace("{element}", state.backlinks[i].value);
              state.lineNo = 6;
              state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
              StateHelper.updateCopyPush(statelist, state);
  
              EntryBacklinkHelper.swapBacklinks(state.backlinks, minPosition, i);
              StateHelper.updateCopyPush(statelist, state);
            }
            else {
              // As the minimum is the first unsorted element, no swap is necessary.
              state.status = 'As the minimum is the first unsorted element, no swap is necessary.';
              state.lineNo = 6;
              StateHelper.updateCopyPush(statelist, state);
            }
  
            // {val} is now considered sorted.
            state.status = '{val} is now considered sorted.'.replace("{val}", state.backlinks[i].value);
            state.backlinks[minPosition].highlight = HIGHLIGHT_NONE;
            state.backlinks[i].highlight = HIGHLIGHT_SORTED;
            StateHelper.updateCopyPush(statelist, state);
          }
  
          for (var i = 0; i < numElements; ++i)
            state.backlinks[i].highlight = HIGHLIGHT_NONE; // un-highlight everything
          // The array/list is now sorted.
          // (After all iterations, the last element will naturally be sorted.)
          state.status = 'Danh sách đã được sắp xếp xong!' + '<br>' + '(After all iterations, the last element will naturally be sorted.)';
          status.lineNo = 0;
          StateHelper.updateCopyPush(statelist, state);
  
          this.play(callback);
          return true;
        }
  
        
  
        this.clearPseudocode = function () { populatePseudocode([]); }
  
        var populatePseudocode = function (code) {
          var i = 1;
          for (; i <= 7 && i <= code.length; ++i) {
            $("#code" + i).html(
              code[i - 1].replace(
                /^\s+/,
                function (m) { return m.replace(/\s/g, "&nbsp;"); }
              )
            );
          }
          for (; i <= 7; ++i) {
            $("#code" + i).html("");
          }
        }
  
        //animation functions
        var drawCurrentState = function () {
          if (currentStep < 0)
            currentStep = 0;
          if (currentStep > statelist.length - 1)
            currentStep = statelist.length - 1;
          $('#progress-bar').slider("value", currentStep);
          drawState(currentStep);
          if (currentStep == (statelist.length - 1)) {
            pause(); //in html file
            $('#play img').attr('src', 'https://visualgo.net/img/replay.png').attr('alt', 'replay').attr('title', 'replay');
          }
          else
            $('#play img').attr('src', 'https://visualgo.net/img/play.png').attr('alt', 'play').attr('title', 'play');
        }
  
        this.getAnimationDuration = function () { return transitionTime; }
  
        this.setAnimationDuration = function (x) {
          transitionTime = x;
          if (issPlaying) {
            clearInterval(animInterval);
            animInterval = setInterval(function () {
              drawCurrentState();
              if (currentStep < (statelist.length - 1))
                ++currentStep;
              else
                clearInterval(animInterval);
            }, transitionTime);
          }
        }
  
        this.getCurrentIteration = function () { return currentStep; }
  
        this.getTotalIteration = function () { return statelist.length; }
  
        this.forceNext = function () {
          if ((currentStep + 1) < statelist.length)
            ++currentStep;
          drawCurrentState();
        }
  
        this.forcePrevious = function () {
          if ((currentStep - 1) >= 0)
            --currentStep;
          drawCurrentState();
        }
  
        this.jumpToIteration = function (n) {
          currentStep = n;
          drawCurrentState();
        }
  
        this.play = function (callback) {
          issPlaying = true;
          drawCurrentState();
          animInterval = setInterval(function () {
            drawCurrentState();
            if (currentStep < (statelist.length - 1))
              ++currentStep;
            else {
              clearInterval(animInterval);
              if (typeof callback == 'function') callback();
            }
          }, transitionTime);
        }
  
        this.pause = function () {
          issPlaying = false;
          clearInterval(animInterval);
        }
  
        this.replay = function () {
          issPlaying = true;
          currentStep = 0;
          drawCurrentState();
          animInterval = setInterval(function () {
            drawCurrentState();
            if (currentStep < (statelist.length - 1))
              currentStep++;
            else
              clearInterval(animInterval);
          }, transitionTime);
        }
  
        this.stop = function () {
          issPlaying = false;
          statelist = [statelist[0]]; //clear statelist to original state, instead of new Array();
          secondaryStatelist = [null];
          currentStep = 0;
          drawState(0);
        }
      }
  
      // sorting action
      var actionsWidth = 150;
      var statusCodetraceWidth = 420;
  
      //this viz-specific code
      var gw = new Sorting();
  
      // local
      $(function () {
        gw.setAnimationDuration(700 / speedVal);
        AbbreviateTitle();
        var eight_modes = ["Bubble", "Selection", "Insertion", "Merge", "Quick", "RandomizedQuick", "Counting", "Radix"];
        $('#title-' + eight_modes[Math.floor(Math.random() * 8)]).click(); // randomly open one of the eight sorting algorithm mode every time
        $('#play').hide();
  
        d3.selectAll("#radix-sort-bucket-labels-collection span")
          .style({
            "left": function (d, i) {
              return 17.5 + i * 65 + "px";
            }
          });
        var sortMode = getQueryVariable("mode");
        if (sortMode.length > 0) {
          $('#title-' + sortMode).click();
        }
        var createArray = getQueryVariable("create");
        if (createArray.length > 0) {
          $('#userdefined-input').val(createArray);
          createList("userdefined");
        }
  
      });
  
      const DEFAULT_COUNT_DATA = "2,3,8,7,1,2,2,2,7,3,9,8,2,1,4"; // drop 5 numbers on 25 Feb , 2, 4, 6, 9, 2";
      const DEFAULT_RADIX_DATA = "3221, 1, 10, 9680, 577, 9420, 7, 5622, 4793, 2030, 3138, 82, 2599, 743, 4127";
  
      // title changing
      function AbbreviateTitle() {
        $('#title-Insertion').text("Sắp xếp chèn - Insertion Sort").attr('title', 'Insertion Sort');
      }
      ;
      
      $('#title-Insertion').click(function () {
        showStandardCanvas();
        hideAllSortingOptions();
        $('#current-action p').html('Insertion Sort');
        $("#viz-sort-index-canvas").show();
        allOff();
        changeSortType(gw.insertionSort);
        AbbreviateTitle();
        $('#title-Insertion').text('Insertion Sort');
      });
      
  
      function changeSortType(newSortingFunction, customNumberList) {
        if (!customNumberList) {
          createList('random');
        }
        else {
          $('#userdefined-input').val(customNumberList);
          createList('userdefined');
        }
  
        if (isPlaying) stop();
        showActionsPanel();
        hideStatusPanel();
        hideCodetracePanel();
        gw.clearPseudocode();
        gw.setSelectedSortFunction(newSortingFunction);
      }
  
      function allOff() {
        $("#counting-simple").css("display", "none");
        $("#counting-stable").css("display", "none");
        $("#create-userdefined-input-cs").css("display", "none");
        $("#create-userdefined-go-cs").css("display", "none");
        $("#create-userdefined-input-rs").css("display", "none");
        $("#create-userdefined-go-rs").css("display", "none");
      }
  
      function displayCounting() {
        allOff();
  
        $("#counting-simple").css("display", "");
        $("#counting-stable").css("display", "");
        $("#create-userdefined-input-cs").css("display", "");
        $("#create-userdefined-go-cs").css("display", "");
      }
  
  
      function createList(type) {
        if (isPlaying) stop();
  
        var arr_size = parseInt($("#user-arr-size").val());
  
        setTimeout(function () {
          if (gw.createList(type, arr_size)) {
            $('#progress-bar').slider("option", "max", 0);
            closeCreate();
            isPlaying = false;
          }
        }, 500);
      }
  
      function setBase() {
        if (isPlaying) stop();
        var input = (gw.selectedSortFunction === gw.countingSort)
          ? parseInt($("#counting-sort-base").val())
          : parseInt($("#radix-sort-base").val());
  
        var setBaseSuccessfully = (gw.selectedSortFunction === gw.countingSort)
          ? gw.setCountingSortBase(input)
          : gw.setRadixSortBase(input);
  
        if (setBaseSuccessfully) {
          // once the base is being changed, create a random list within the new range to show the user that the change is successful
          createList("random");
        }
      }
  
      function sort(callback) {
        gw.computeInversionIndex = $('#sort-bubble-merge-inversion-checkbox').prop('checked');
        if (isPlaying) stop();
        setTimeout(function () {
          if (gw.sort(callback)) {
            $('#current-action').show();
            $('#progress-bar').slider("option", "max", gw.getTotalIteration() - 1);
            triggerRightPanels();
            isPlaying = true;
          }
        }, 500);
      }
  
      function sortGeneric(callback) {
        if (gw.selectedSortFunction != gw.countingSort) {
          sort();
        }
      }
  
      function countingSortStable(callback) {
        if (isPlaying) stop();
        setTimeout(function () {
          if (gw.countingSortStable(callback)) {
            $('#current-action').show();
            $('#progress-bar').slider("option", "max", gw.getTotalIteration() - 1);
            triggerRightPanels();
            isPlaying = true;
          }
        }, 500);
      }
  
      // sort options
      function hideAllSortingOptions() {
        $("#sort-bubble-merge-inversion").css("display", "none");
      }
  
      // canvas
      function hideAllCanvases() {
        $("#viz").hide();
        $("#viz-counting-sort-secondary-canvas").hide();
        $("#viz-sort-index-canvas").hide();
        $("#viz-radix-sort-canvas").hide();
      }
  
      function showStandardCanvas() {
        $("#viz").show();
        $("#viz-counting-sort-secondary-canvas").hide();
        $("#viz-sort-index-canvas").hide();
        $("#viz-radix-sort-canvas").hide();
      }
  
      function setDefaultScale() { // sets the sorting visualisation to its default scale (max 15 elements)
        gw.changeBarWidth(50);
        $('#scale').html('1.0x');
        $('#viz-sort-index-canvas').show();
      }
  
      function setMediumScale() { // sets the sorting visualisation to a smaller scale to accomodate more elements (around 60)
        gw.changeBarWidth(21); // 13
        $('#scale').html('0.5x');
        $('#viz-sort-index-canvas').hide();
      }
  
      var exploreModeData = [];
  
      // This function will be called before entering E-Lecture Mode
      function ENTER_LECTURE_MODE() {
        exploreModeData = gw.currentNumList;
      }
  
      // This function will be called before returning to Explore Mode
      function ENTER_EXPLORE_MODE() {
        gw.loadNumberList(exploreModeData);
      }
  
      // Lecture action functions
      function SORT(mode) {
        hideSlide(function () {
          sort(showSlide);
        });
      }
      function CUSTOM_ACTION(action, data, mode) { }
  