/**
 * APEX Initialization
 **/
$.fn.ignore = function(selector) {
    return this.clone().find(selector || ">*").remove().end();
};

$.fn.removeEmpty = function() {
    return this.filter(function() {
        return $.trim($(this).text()) === "" && $(this).children().length === 0;
    }).remove();
};

var classExists = function(className) {
    return document.getElementsByClassName(className).length > 0;
};


/**
 * @materialAPEX
 **/
var materialAPEX = materialAPEX || {};

materialAPEX.debug = {
    time: function(name) {
        if (apex.debug.getLevel() > apex.debug.LOG_LEVEL.OFF) {
            console.time(name);
        }
    },

    timeEnd: function(name) {
        if (apex.debug.getLevel() > apex.debug.LOG_LEVEL.OFF) {
            console.timeEnd(name);
        }
    }
};

materialAPEX.sideNav = {
    init: function() {
        if (!classExists("side-nav")) return;
        materialAPEX.debug.time("materialAPEX.sideNav.init");

        $("#app-sidenav li.active")
            .parents(".collapsible-body").css("display", "block")
            .siblings(".collapsible-header")
            .addClass("active")
            .parents("li")
            .addClass("active");

        $(".side-nav").prepend(function() {
            return $(".userView");
        });

        $(".userView").wrap("<li></li>");
        materialAPEX.debug.timeEnd("materialAPEX.sideNav.init");
    }
};

materialAPEX.wizard = {
    init: function() {
        if (!classExists("ma-wizard")) return;
        materialAPEX.debug.time("materialAPEX.wizard.init");

        // finds the current step and flags all previous ones to complete
        $(".ma-wizard")
            .find(".ma-wizard-step.is-active")
            .prevAll(".ma-wizard-step")
            .addClass("is-complete");

        materialAPEX.debug.timeEnd("materialAPEX.wizard.init");
    }
};

materialAPEX.messages = {
    init: function() {
        // message is missing for theme roller
        apex.lang.addMessages({"PE.SELECT": "- Select -"});
    }
};

materialAPEX.items = {
    init: function(selectorPrefix) {
        materialAPEX.debug.time("materialAPEX.items.init");

        var prefix = selectorPrefix || "";
        // fix for empty checkbox and radio labels
        $(".a-GV " + prefix + " input[type='checkbox'], .a-GV " + prefix + " input[type='radio']").addClass("filled-in");

        // fix for empty checkbox and radio labels
        $(prefix + " [type='checkbox'], " + prefix + " [type='radio']").each(function() {
            // add an ID to the checkbox or radio if it doesn't exist
            if (!this.id) {
                this.id = Materialize.guid();
            }

            // add a label next to the checkbox or radio if it doesn't exist
            // UNLESS IT'S IN A SWITCH COMPONENT
            if (!$(this).next().is("label") && !$(this).next().is("span.lever")) {
                $(this).after("<label for='" + this.id + "'></label>");
            }
        });

        // Fix for label issue with many components. Need to have label after component.
        $(".input-field > label, .input-field fieldset > label").each(function() {
            $(this).appendTo($(this).parent());
        });

        materialAPEX.debug.timeEnd("materialAPEX.items.init");
    },

    utr: function() {
        if (!classExists("a-LiveTemplateOptions")) return;
        $(".a-Property-checkbox-input").addClass("filled-in");
    }
};

materialAPEX.ir = {
    init: function() {
        if (!classExists("a-IRR")) return;
        materialAPEX.debug.time("materialAPEX.ir.init");

        if (!$('.a-IRR-table').hasClass("table-responsive")) {
            $('.a-IRR-table').addClass("table-responsive");

            $(".a-IRR-search-field")
                .attr("placeholder", apex.lang.getMessage("APEX.IG.SEARCH"))
                .parent().addClass("input-field");

            $(".a-IRR-button--actions").html('<i class="material-icons">more_vert</i>')/*.show()*/;
            $(".a-IRR-button--colSearch").html('<i class="material-icons">search</i>')/*.show()*/;

            $(".a-IRR-table td").each(function(index) {
                $(this)
                    .attr("data-label",
                        $(this).closest('table')
                        .find('th')
                        .not(".a-IRR-header--group")
                        .eq($(this).index())
                        .find("a")
                        .ignore("span")
                        .text());
            });

            $(".a-IRR-header:not(.a-IRR-header--group)").closest("tr").addClass("a-IRR-header-tr");
            $(".a-IRR-header.a-IRR-header--group").closest("tr").addClass("a-IRR-header-tr--group");
        }

        $("[id*='_column_filter'], .a-IRR-dialogContent--highlight table table")
            .addClass("table-responsive")
            .find("td")
            .each(function(index) {
                $(this).attr("data-label", $(this).closest('table').find('.a-IRR-dialogTable-header').eq($(this).index()).text());
            });

        $("[id*='_chart_type'] input[type='radio'], [id*='_default_type'] input[type='radio']").each(function() {
            $(this).after("<label for='" + $(this).attr("id") + "'></label>").parent().removeAttr("nowrap");
        });

        $(".a-IRR-controlsCheckbox").addClass("filled-in");

        materialAPEX.debug.timeEnd("materialAPEX.ir.init");
    }
};

materialAPEX.textarea = {
    init: function() {
        $("[id*='_CHAR_COUNTER']").parent().addClass("character-counter");

        $("fieldset.textarea").prepend(function() {
            return $(this).siblings();
        });

        $('textarea').addClass('materialize-textarea');
    }
};

materialAPEX.initial = {
    init: function() {
        materialAPEX.debug.time("materialAPEX.initial.init");
        // App Menu
        if (document.getElementById('app-sidenav')) {
            $("#app-sidenav-trigger").removeClass("hide");
        }

        // Grid - Handling s12 default override
        $(".s1,.s2,.s3,.s4,.s5,.s6,.s7,.s8,.s9,.s10,.s11").removeClass("s12");

        // Deletes empty html tags
        $('.card-action, .card-content, span.badge, i.material-icons, .ma-button-label').removeEmpty();

        // Support for APEX 5.1 item icons
        $(".apex-item-icon").each(function(index) {
            var el = $(this);

            if (!el.hasClass("fa")) {
                el
                    .removeClass("apex-item-icon")
                    .text(el.attr("class"))
                    .addClass("material-icons");
            }

            el.addClass("prefix").prependTo(el.parent());
        });

        // Font Awesome & Font APEX Support with Material Icons HTML markup
        $(".material-icons:contains('fa-')").each(function(index) {
            $(this).attr("class", $(this).text()).text('');
        });

        // Fixed Action Button
        $(".fixed-action-btn").each(function() {
            var position = "";
            var fab = $(this);
            if (fab.hasClass("fab-right")) position += "fab-right ";
            if (fab.hasClass("fab-left")) position += "fab-left ";
            if (fab.hasClass("fab-absolute")) position += "fab-absolute ";
            if (fab.hasClass("horizontal")) position += "horizontal ";
            if (fab.hasClass("click-to-toggle")) position += "click-to-toggle ";
            if (fab.hasClass("toolbar")) position += "toolbar ";

            fab.siblings(".btn, .btn-flat").addClass("btn-floating").removeClass("btn btn-flat");
            fab.siblings(".btn-floating").addBack().wrapAll("<div class='fixed-action-btn " + position + "'>");
            fab.siblings(".btn-floating").wrapAll("<ul>").wrap("<li>");
            fab.removeClass("fixed-action-btn horizontal click-to-toggle toolbar fab-right fab-left fab-absolute");
        });

        $(".fixed-action-btn ul li .btn-floating").each(function() {
            $(this)
                .attr("data-tooltip", $(this).find(".ma-button-label").text())
                .attr("data-position", "left");
        });

        $("div.fab-absolute").parent().addClass("fab-relative");

        // Fix for APEX  Select Template
        $("select").closest('.input-field').removeClass('input-field');

        // Parallax
        $(".parallax-container")
            .closest(".col").removeClass()
            .closest(".row").removeClass();

        // Display only & read only
        $(".display_only")
            .siblings("label")
            .addClass("active");

        // Fieldset
        $("fieldset.checkbox_group, fieldset.radio_group")
            .siblings("label")
            .addClass("active label-block")
            .closest('.input-field')
            .removeClass('input-field');

        // Textarea
        materialAPEX.textarea.init();

        // Popup LOV
        $("fieldset.lov").parent().addClass("ma-popuplov");
        $(".ma-popuplov .uPopupLOVIcon").parent().addClass("ma-chevron-up");

        // Media
        $(".apex-materialbox img").addClass("materialboxed responsive-img").each(function() {
            $(this).attr("data-caption", $(this).parent().attr("data-caption"));
            $(this).parent().removeAttr("data-caption");
        });

        // Tooltips
        $("[data-tooltip][data-tooltip!='']").each(function() {
            $(this).siblings("i, span").attr("data-tooltip", $(this).attr("data-tooltip"));
        });

        // Icons
        $("i[class='']").remove();

        // Search Bar
        $(".top-nav li a i:contains('search')").parent().click(function() {
            $(".main-nav-wrapper").toggleClass("hide");
            $(".search-nav-wrapper").toggleClass("hide");
            $("#P0_SEARCH").focus();
        });

        $("#P0_SEARCH")
            .attr("type", "search")
            .blur(function() {
                $(".main-nav-wrapper").toggleClass("hide");
                $(".search-nav-wrapper").toggleClass("hide");
            });

        //  closes a toast
        $(document).on("click", ".ma-toast-close", function() {
            $(this).closest(".toast").remove();
        });

        //  closes a panel
        $(document).on("click", ".panel-close", function() {
            $(this).closest(".card-panel").remove();
        });

        // checkboxes and radio alternate look
        $(".ma-alternate-look input[type='checkbox']").addClass("filled-in");
        $(".ma-alternate-look input[type='radio']").addClass("with-gap");

        // this is for displaying a success message when a modal page closes
        $("body").on("apexafterclosedialog", function(e, data) {
            if (data.successMessage.text) {
                $('#toast-container').append('<div class="ma-success-message toast velocity-animating green lighten-2 white-text">' +
                    '<div class="ma-success-message-content white-text">' + data.successMessage.text + '</div>' +
                    '<i class="ma-toast-close material-icons right">close</i>' +
                    '</div>');

                // relaunch close event
                $(".ma-toast-close").click(function() {
                    $(this).closest(".toast").remove();
                });
            }
        });

        // overwrites apex.theme.defaultStickyTop to help with the region display selector
        apex.theme.defaultStickyTop = function() {
            return $("header").height();
        };

        // showSpinner
        if (typeof apex.util.showSpinner === "function") {
            var showSpinnerOld = apex.util.showSpinner;
            apex.util.showSpinner = function(container, options) {
                var opt = options || {};
                var newSpinner = showSpinnerOld(container, options);

                var spinnerLayer = function(layerColor) {
                    return '<div class="spinner-layer spinner-' + layerColor + '"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>';
                };

                var layers = (opt.color ?
                    spinnerLayer(opt.color + "-only") :
                    spinnerLayer("blue") +
                    spinnerLayer("red") +
                    spinnerLayer("yellow") +
                    spinnerLayer("green")
                );

                $(".u-Processing").append('<div class="preloader-wrapper ' + opt.size + ' active">' + layers + '</div>');

                return newSpinner;
            };
        }

        materialAPEX.debug.timeEnd("materialAPEX.initial.init");
    }
};

$(function() {
    materialAPEX.initial.init();
    materialAPEX.messages.init();
    materialAPEX.items.init();
});
