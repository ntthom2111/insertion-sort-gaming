$(function () {
    let defaultPlaybackSpeed = 1;
    createPlaybackSpeedSlider(defaultPlaybackSpeed);

    $('#scale').show();

    $('#account-dropdown-btn').click(function (e) {
      $('#account-dropdown-menu').css('display', 'block')
      $('#language-dropdown-menu').css('display', 'none')
      e.stopPropagation()
    })
    $(document).click(function (e) {
      $('#account-dropdown-menu').css('display', 'none')
    });
    //Mobile Design Related DOM Manipulations
    if (isMobile()) {
      $("#status").css({
        "bottom": "10%",
        "height": "12%",
        "max-height": "54px"
      });
      $("#current-action").css("bottom", "22%");
      $('#status-hide').remove();
      $('#left-bar').remove();
      $('#right-bar').remove();
      $("#mode-menu").remove();
      $("#codetrace").css("z-index", 1);
      $("#bottom-bar a").hide();
      $("#bottom-bar").css("height", $("#topbar").css("height"));
      $(".speed-dropup-btn").show();
      $('#scale').show();
      $("#go-to-beginning").remove();
      $("#go-to-end").remove();
      $("#pause").remove();
      $("#play").remove();
      $("#previous").remove();
      $("#next").remove();

      //make progress bar longer
      $("#progress-bar").css({
        left: "30%",
        width: "60%",
        'margin-left': 0
      })
    }
  })

  let mobilePlaybackOverlayTimeout;
  $(function () {
    $("#viz").on("click", () => {
      if (isMobile()) {
        if ($("#mobile-playback-overlay").is(":hidden") && isPlaying) {
          $("#mobile-playback-overlay").fadeIn();
          hideMobilePlaybackOverlay(6000);
        } else {
          $("#mobile-playback-overlay").fadeOut();
        }
      }
    });
    $("#mobile-playback-overlay").on("click", (event) => {
      if (event.target === event.currentTarget) //to ensure clicks on the controls dont fade the overlay
        $("#mobile-playback-overlay").fadeOut();
      else
        hideMobilePlaybackOverlay(5000);
    })
  });
  function hideMobilePlaybackOverlay(timeOut) {
    if (mobilePlaybackOverlayTimeout)
      clearTimeout(mobilePlaybackOverlayTimeout);
    mobilePlaybackOverlayTimeout = setTimeout(() => {
      $("#mobile-playback-overlay").fadeOut();
    }, timeOut);
  }
  function mobilePlaybackPauseOrPlay() {
    if ($("#mobile-playback-overlay").hasClass("playing")) {
      pause();
      hideMobilePlaybackOverlay(5000);
    } else {
      play();
      hideMobilePlaybackOverlay(3000);
    }
  }
  let rewindLabelTimeout, forwardLabelTimeout;
  function mobilePlaybackRewind() {
    $("#mobile-playback-rewind-label").css("opacity", 1);
    if (rewindLabelTimeout)
      clearTimeout(rewindLabelTimeout);
    rewindLabelTimeout = setTimeout(() => {
      $("#mobile-playback-rewind-label").css("opacity", 0);
    }, 800);
    stepBackward(7);
  }
  function mobilePlaybackForward() {
    $("#mobile-playback-forward-label").css("opacity", 1);
    if (forwardLabelTimeout)
      clearTimeout(forwardLabelTimeout);
    forwardLabelTimeout = setTimeout(() => {
      $("#mobile-playback-forward-label").css("opacity", 0);
    }, 800);
    stepForward(7);
  }

  //let eLectureSessionHistory = {};
  const sectorColors = ['#05a4d0', '#f1c706', '#fa0202'];
  function setSlideTimelineColor(slideNo) {
    const sectionNo = slideNo.split('-')[0];
    $(`[slideNo="${slideNo}"]`).css('background', sectorColors[(parseInt(sectionNo) % 3)]);
  }

  let currSlideTimer = null; //global so that we can clear the timeout when required

  
  const numSlides = lectureIds.length;
  var sectorJunction12Section = 0, sectorJunction12Slide = 0;
  var sectorJunction23Section = 0, sectorJunction23Slide = 0;
  var sector1Count = 0, sector2Count = 0, sector3Count = 0;
  const sectorLength = Math.floor(numSlides / 3);
  function createELectureTimelineDisplay() {
    for (let j = 0; j < numSlides; ++j) {
      const currLecture = lectureIds[j].value;
      if (currLecture.includes('-')) {
        $('#e-lecture-timeline').append(
          $(`<div class="e-lecture-timeline-slide" slideNo=${lectureIds[j].value}></div>`)
        );
      } else {
        $('#e-lecture-timeline').append(
          $(`<div class="e-lecture-timeline-checkpoint" slideNo=${lectureIds[j].value}></div>`)
        );
      }
    }
  }

  function setSectorJunctionInfo() {
    //setting the sector junction slide numbers
    const j12 = sectorLength !== 0 ? (sectorLength - 1) : 0;
    const j23 = sectorLength !== 0 ? (2 * sectorLength - 1) : 0;

    const sectorJunction12 = lectureIds[j12].value.split('-');
    sectorJunction12Section = parseInt(sectorJunction12[0]);
    sectorJunction12Slide = sectorJunction12.length > 1 ? parseInt(sectorJunction12[1]) : sectorJunction12Slide;

    const sectorJunction23 = lectureIds[j23].value.split('-');
    sectorJunction23Section = parseInt(sectorJunction23[0]);
    sectorJunction23Slide = sectorJunction23.length > 1 ? parseInt(sectorJunction23[1]) : sectorJunction23Slide;
  }



  window.onpopstate = function (event) {
    var slide = event.state['slide'];
    openSlide(slide, function () {
      runSlide(slide);
    });
  };

  function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'), sParameterName, i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  };
  var slideTimeline = {};

  //reads all visited slides in the slideTimeline and gives them their sector color
  function setVisitedSlideTimelineColors() {
    for (const [sectionNo, visitedSlides] of Object.entries(slideTimeline)) {
      const visitedSlides = slideTimeline[sectionNo];
      for (const visitedSlideNo of visitedSlides) {
        setSlideTimelineColor(visitedSlideNo);
      }
    }
  }

  //only called on load if there is nothing in session
  function setTimelineForCompletedSector(sectorNum) {
    let len = sectorLength;
    switch (sectorNum) {
      case 1: len = sectorLength; break;
      case 2: len = 2 * sectorLength; break;
      default: len = numSlides;
    }
    let i = 0;
    switch (sectorNum) {
      case 1: i = 0; break;
      case 2: i = sectorLength; break;
      default: i = 2 * sectorLength;
    }
    for (; i < len; i++) {
      saveELectureTimeline(lectureIds[i].value, true);
    }
  }

  function getUserSectorHistory(callback) {
    $.ajax({
      type: 'GET',
      url: "https://visualgo.net/section-info",
      data: {
        _token: "KgXJw47QezINxp9yEq4hedkV0uokoUnQh6zoA1pw",
        topic: "/sorting".substring(1)
      }
    }
    ).done(function (data) {
      if (data.data[0] === 1) {
        setF1SectorColor(1);
        setTimelineForCompletedSector(1);
      }
      if (data.data[1] === 1) {
        setF1SectorColor(2);
        setTimelineForCompletedSector(2);
      }
      if (data.data[2] === 1) {
        setF1SectorColor(3);
        setTimelineForCompletedSector(3);
      }
      callback();
    }).fail(function (data) {
      console.log('get user sector history failed!');
    });
  }

  function getELectureTimelineFromSession() {
    const page = "/sorting".substring(1);
    const timelineKey = page + '-slide-timeline';
    const storedTimeline = window.sessionStorage.getItem(timelineKey);
    if (storedTimeline) {
      slideTimeline = JSON.parse(storedTimeline);
    } else {
      return false;
    }
    let slideInfo = [];
    for (const [sectionNum, slides] of Object.entries(slideTimeline)) {
      for (const slide of slides) {
        indicateSlideCompletedUI(slide);
        slideInfo = slide.split('-');
        incrementSectorVisits(parseInt(sectionNum), slideInfo.length > 1 ? parseInt(slideInfo[1]) : 0);
      }
    }
    return true;
  }

  async function initializeELectureTimeline() {
    setSectorJunctionInfo();
    if (!getELectureTimelineFromSession())
      getUserSectorHistory(sectorBasedModeSelection);
    else
      sectorBasedModeSelection();

    createELectureTimelineDisplay();
    setVisitedSlideTimelineColors();
  }

  function setF1SectorColor(sectorNum) {
    $(`[sectorNo="${sectorNum}"]`).css('background', sectorColors[(parseInt(sectorNum) % 3)]);
  }

  function updateSectorInDB(sectorNum) {
    $.ajax({
      type: 'POST',
      url: "https://visualgo.net/section-info",
      data: {
        _token: "KgXJw47QezINxp9yEq4hedkV0uokoUnQh6zoA1pw",
        section: (sectorNum - 1),
        topic: "/sorting".substring(1)
      }
    }
    ).done(function (data) {
      //console.log("Saved the sector " + sectorNum + " as done " + JSON.stringify(data));
    }).fail(function (data) {
      console.log("Setting sector done failed new attempt! " + JSON.stringify(data));
    });
  }

  //If 87.5% or more of the slides in sector are done
  function setF1SectorCompleted(sectorNum, isInitializationCall) {
    setF1SectorColor(sectorNum);
    //avoid api call on initialization
    if (!isInitializationCall) {
      updateSectorInDB(sectorNum);
      $(`[sectorNo="${sectorNum}"]`).css("animation", "green-pulse 2s 4");
      setTimeout(() => {
        $(`[sectorNo="${sectorNum}"]`).css("animation", "");
      }, 8000);
    }
  }

  function incrementSectorVisits(sectionNum, slideNumWithinSection, isInitializationCall) {
    //updating sector count
    if (sectionNum < sectorJunction12Section
      || (sectionNum === sectorJunction12Section && slideNumWithinSection <= sectorJunction12Slide)) {
      ++sector1Count;
      if (sector1Count >= Math.ceil(0.875 * sectorLength))
        setF1SectorCompleted(1, isInitializationCall);
    } else if (sectionNum < sectorJunction23Section
      || (sectionNum === sectorJunction23Section && slideNumWithinSection <= sectorJunction23Slide)) {
      ++sector2Count;
      if (sector2Count >= Math.ceil(0.875 * sectorLength))
        setF1SectorCompleted(2, isInitializationCall);
    } else {
      ++sector3Count;
      if (sector3Count >= Math.ceil(0.875 * (numSlides - 2 * sectorLength)))
        setF1SectorCompleted(3, isInitializationCall);
    }
  }

  function saveELectureTimeline(slideNo, isInitialization) {
    const slideInfo = slideNo.split('-');
    const sectionNo = slideInfo[0];
    const slideNumWithinSection = slideInfo.length > 1 ? parseInt(slideInfo[1]) : 0;
    if (slideTimeline[sectionNo]) {
      if (!slideTimeline[sectionNo].includes(slideNo)) {
        slideTimeline[sectionNo].push(slideNo);
        const sectionNum = parseInt(sectionNo);
        incrementSectorVisits(sectionNum, slideNumWithinSection, isInitialization);
      }
    } else {
      slideTimeline[sectionNo] = [];
      slideTimeline[sectionNo].push(slideNo);
      const sectionNum = parseInt(sectionNo);
      incrementSectorVisits(sectionNum, slideNumWithinSection, isInitialization);
    }
    setSlideTimelineColor(slideNo);
    indicateSlideCompletedUI(slideNo);
  }

  function saveELectureTimelineToSession() {
    const page = "/sorting".substring(1);
    const timelineKey = page + '-slide-timeline';
    window.sessionStorage.setItem(timelineKey, JSON.stringify(slideTimeline));
  }

  function handleTimelineOnRunSlide(slideValue) {
    const slideInfo = slideValue.split('-');
    const sectionNo = slideInfo[0];
    const slideNumWithinSection = slideInfo.length > 1 ? parseInt(slideInfo[1]) : 0;
    //start timer only if the slide isnt already done
    if (!slideTimeline[sectionNo] || !slideTimeline[sectionNo].includes(slideValue)) {
      const slideTextLength = $('#electure-' + slideValue + " p").text().length + $('#electure-' + slideValue + " li").text().length;
      const CHARS_READ_PER_MS = 0.05; //when fast, 50 characters a second
      //setting max reading time as 10 seconds for around 500 character slide
      const minSlideReadingTime = Math.min(Math.max(2000, (slideTextLength / CHARS_READ_PER_MS) + + (2000 * $('#electure-' + slideValue + " img").length)), 10000);
      currSlideTimer = setTimeout(() => {
        saveELectureTimeline(slideValue);
      }, minSlideReadingTime);
    }
  }

  function indicateSlideCompletedUI(slide) {
    $('#electure-' + slide).css("box-shadow", "3px 3px 8px green"); //set green shadow for completed slides
    $('#electure-' + slide + ' .electure-read-status').html("&#10004;");
    $('#electure-' + slide + ' .electure-read-status').attr("title", "Slide Completed!");
    $('#electure-' + slide + ' .electure-read-status').css("font-size", "17px");
  }

  function pushState(slideValue) {
    var url = '/en/sorting';
    if (typeof slideValue != 'undefined' && slideValue != null) {
      url += '?slide=' + slideValue;
    }
    window.history.pushState({ slide: slideValue }, "slide " + slideValue, url);
  }

  function showPopup(callback) {
    $('#popup').fadeIn(100, callback);
  }

  function hidePopup(callback) {
    $('#popup').fadeOut(100, callback);
  }

  function showOverlay() {
    $('#overlay').css('opacity', 0.5);
    $('#overlay').show();

    $("#e-lecture-timeline").show();
    $("#e-lecture-f1map").show();
  }

  function hideOverlay() {
    $('#overlay').hide();
    $("#e-lecture").html("");
    $("#e-lecture-timeline").hide();
    $("#e-lecture-f1map").hide();
    clearTimeout(currSlideTimer);
  }

  function makeOverlayTransparent() {
    $('#overlay').css('opacity', 0);
  }

  
  function sectorBasedModeSelection() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    //check params are empty and then that all sectors are completed or not
    if (!Object.keys(params).length
      && sector1Count === sectorLength && sector2Count === sectorLength && sector3Count === (numSlides - 2 * sectorLength)) {
      hideOverlay();
    }
    else
      $('#mode-menu a').click();
  }

  $(function () {
    if (isMobileOS() && portraitMatcher.matches) {
      $('#rotateDeviceOverlay').show();
      $('#rotateDeviceText').show();
      $('#widenDeviceText').hide();
      $('#topbar').css("z-index", 10001);
    } else if (matchMediaNarrow.matches) {
      $('#rotateDeviceOverlay').show();
      $('#rotateDeviceText').hide();
      $('#widenDeviceText').show();
      $('#topbar').css("z-index", 10001);
    } else {
      $('#rotateDeviceOverlay').hide();
      $('#topbar').css("z-index", "");
    }

    matchMediaNarrow.addEventListener('change', e => {
      //screws up for square device! NEED RESIZE EVENT
      if (e.matches) {
        if ($('#rotateDeviceOverlay').is(":hidden")) {
          $('#rotateDeviceOverlay').show();
          $('#rotateDeviceText').hide();
          $('#widenDeviceText').show();
          $('#topbar').css("z-index", 10001);
        }
      } else {
        $('#rotateDeviceOverlay').hide();
        $('#topbar').css("z-index", "");
      }
    });
    portraitMatcher.addEventListener('change', e => {
      if (e.matches && isMobileOS()) {
        if ($('#rotateDeviceOverlay').is(":hidden")) {
          $('#rotateDeviceOverlay').show();
          $('#rotateDeviceText').show();
          $('#widenDeviceText').hide();
          $('#topbar').css("z-index", 10001);
        }
      } else {
        $('#rotateDeviceOverlay').hide();
        $('#topbar').css("z-index", "");
      }
    });
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    let slide = getUrlParameter('slide');
    if (typeof slide !== undefined && slide != null) {
      cur_slide = slide;
    }
    //do all timeline and slide stuff only if specific params not provided
    if (!Object.keys(params).length || params["slide"]) {
      if (!isMobile()) {
        $('#mode-menu a').click();
      }
    }
    $('.mcq-submit').click(function () {
      var questionId = parseInt($(this).attr('id').split('-')[1]);
      var answer = $('#mcq-answer-' + questionId).val();
      var userAnswer = $('input[type=radio][name=mcq-' + questionId + '-choice]:checked').val();

      if (answer === userAnswer) {
        $('#answer-status-' + questionId).html('<font color="green"><b>Correct!</b></font>');
      }
      else {
        $('#answer-status-' + questionId).html('<font color="red"><b>Wrong Answer! Try again...</b></font>');
      }
      $('#answer-status-' + questionId).show();
      setTimeout(function () {
        $('#answer-status-' + questionId).fadeOut(1000);
      }, 1000);
    });

    $('.msq-submit').click(function () {
      var questionId = parseInt($(this).attr('id').split('-')[1]);
      var answer = $('#msq-answer-' + questionId).val();

      var answers = [];
      $('input[type=checkbox][class=msq-choice]:checked').each(function () {
        answers.push($(this).attr('id').split('-')[3]);
      });
      answers.sort();
      var userAnswer = answers.join(',');

      if (answer === userAnswer) {
        $('#answer-status-' + questionId).html('<font color="green">Correct!</font>');
      }
      else {
        $('#answer-status-' + questionId).html('<font color="red">Wrong Answer! Try again...</font>');
      }
      $('#answer-status-' + questionId).show();
      setTimeout(function () {
        $('#answer-status-' + questionId).fadeOut(1000);
      }, 1000);
    });

    $('select.lecture-dropdown').change(function () {
      var nextSlide = $(this).val();
      openSlide(nextSlide, function () {
        runSlide(nextSlide);
        pushState(nextSlide);
      });
    });

    $('#hide-popup').click(function () {
      hidePopup();
    });

    $('#popup').hover(function () {
      $('#hide-popup').show();
    }, function () {
      $('#hide-popup').hide();
    });

  });



  $('.electure-print').click(() => {
    window.open(`/en/sorting/print`);
  });
  function adjustPopupToImageSize() {
    var width = $('#popup-image').prop('width');
    var height = $('#popup-image').prop('height');
    $('#popup').width(width + 20);
    $('#popup').height(height + 20);
    if (width == 0 && height == 0) {
      setTimeout(adjustPopupToImageSize, 200);
    } else {
      showPopup();
    }
  }

  function POPUP_IMAGE(url) {
    $('#popup-content').html('<img id="popup-image" src="' + url + '">');
    adjustPopupToImageSize();
  }

  function URL(url) {
    window.open(url, '_blank');
  }

  // Implement these functions in each visualisation
  // This function will be called before entering e-Lecture Mode
  function ENTER_LECTURE_MODE() { }

  // This function will be called before returning to Explore Mode
  function ENTER_EXPLORE_MODE() { }

  // Lecture action functions
  function CUSTOM_ACTION(action, data, mode) { }

  // This function will be called everytime 1.0x is changed to 0.5x or vice versa
  function redraw() { }

  $(document).ready(function () {
    setTimeout(function () {
      $('#change-lang-popup').fadeOut('slow')
    }, 5000)
  })
