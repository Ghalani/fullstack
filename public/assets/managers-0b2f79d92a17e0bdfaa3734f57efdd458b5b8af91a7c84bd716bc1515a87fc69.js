/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */


if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.6'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.6
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.6'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.6
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.6'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.6
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.6'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.6
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.6'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.6'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.6'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.6
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.6'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.6
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.6'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.6'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.6'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
/*! @license Firebase v3.0.5
    Build: 3.0.5-rc.2
    Terms: https://developers.google.com/terms */

(function() { var h="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global?global:this,l=function(){h.Symbol||(h.Symbol=aa);l=function(){}},ba=0,aa=function(a){return"jscomp_symbol_"+a+ba++},m=function(){l();h.Symbol.iterator||(h.Symbol.iterator=h.Symbol("iterator"));m=function(){}},ca=function(){var a=["next","error","complete"];m();if(a[h.Symbol.iterator])return a[h.Symbol.iterator]();var b=0;return{next:function(){return b==a.length?{done:!0}:{done:!1,value:a[b++]}}}},p=function(){return{done:!0,
value:void 0}},q=function(a,b){a instanceof String&&(a=String(a));var c=0;l();m();var d={},e=(d.next=function(){if(c<a.length){var d=c++;return{value:b(d,a[d]),done:!1}}e.next=p;return p()},d[Symbol.iterator]=function(){return e},d);return e},r=function(a,b){!Array.prototype[a]&&Object.defineProperties&&Object.defineProperty&&Object.defineProperty(Array.prototype,a,{configurable:!0,enumerable:!1,writable:!0,value:b})},t=function(a,b){if(null==a)throw new TypeError("The 'this' value for String.prototype."+
b+" must not be null or undefined");},u=function(a,b){if(a instanceof RegExp)throw new TypeError("First argument to String.prototype."+b+" must not be a regular expression");},da=function(a){t(this,"repeat");var b=String(this);if(0>a||1342177279<a)throw new RangeError("Invalid count value");a|=0;for(var c="";a;)if(a&1&&(c+=b),a>>>=1)b+=b;return c},ea=function(a){t(this,"codePointAt");var b=String(this),c=b.length;a=Number(a)||0;if(0<=a&&a<c){a|=0;var d=b.charCodeAt(a);if(55296>d||56319<d||a+1===c)return d;
a=b.charCodeAt(a+1);return 56320>a||57343<a?d:1024*(d-55296)+a+9216}},fa=function(a,b){b=void 0===b?0:b;u(a,"includes");t(this,"includes");return-1!==String(this).indexOf(a,b)},ga=function(a,b){b=void 0===b?0:b;u(a,"startsWith");t(this,"startsWith");var c=String(this);a+="";var d=c.length,e=a.length;b=Math.max(0,Math.min(b|0,c.length));for(var f=0;f<e&&b<d;)if(c[b++]!=a[f++])return!1;return f>=e},ha=function(a,b){u(a,"endsWith");t(this,"endsWith");var c=String(this);a+="";void 0===b&&(b=c.length);
b=Math.max(0,Math.min(b|0,c.length));for(var d=a.length;0<d&&0<b;)if(c[--b]!=a[--d])return!1;return 0>=d};String.prototype.endsWith||(String.prototype.endsWith=ha);String.prototype.startsWith||(String.prototype.startsWith=ga);String.prototype.includes||(String.prototype.includes=fa);String.prototype.codePointAt||(String.prototype.codePointAt=ea);String.prototype.repeat||(String.prototype.repeat=da);r("values",function(){return q(this,function(a,b){return b})});r("keys",function(){return q(this,function(a){return a})});
r("entries",function(){return q(this,function(a,b){return[a,b]})});
var v=this,w=function(){},x=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b},y=function(a){return"function"==x(a)},ia=function(a,b,c){return a.call.apply(a.bind,arguments)},ja=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},z=function(a,b,c){z=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?
ia:ja;return z.apply(null,arguments)},ka=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},la=function(a,b){function c(){}c.prototype=b.prototype;a.ba=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.aa=function(a,c,f){for(var k=Array(arguments.length-2),g=2;g<arguments.length;g++)k[g-2]=arguments[g];return b.prototype[c].apply(a,k)}};function __extends(a,b){function c(){this.constructor=a}for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);a.prototype=null===b?Object.create(b):(c.prototype=b.prototype,new c)}
function __decorate(a,b,c,d){var e=arguments.length,f=3>e?b:null===d?d=Object.getOwnPropertyDescriptor(b,c):d,k;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)f=Reflect.decorate(a,b,c,d);else for(var g=a.length-1;0<=g;g--)if(k=a[g])f=(3>e?k(f):3<e?k(b,c,f):k(b,c))||f;return 3<e&&f&&Object.defineProperty(b,c,f),f}function __metadata(a,b){if("object"===typeof Reflect&&"function"===typeof Reflect.metadata)return Reflect.metadata(a,b)}
var __param=function(a,b){return function(c,d){b(c,d,a)}},__awaiter=function(a,b,c,d){return new (c||(c=Promise))(function(e,f){function k(a){try{n(d.next(a))}catch(b){f(b)}}function g(a){try{n(d.throw(a))}catch(b){f(b)}}function n(a){a.done?e(a.value):(new c(function(b){b(a.value)})).then(k,g)}n((d=d.apply(a,b)).next())})};var A=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,A);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};la(A,Error);A.prototype.name="CustomError";var ma=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")};var B=function(a,b){b.unshift(a);A.call(this,ma.apply(null,b));b.shift()};la(B,A);B.prototype.name="AssertionError";var na=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);throw new B(""+e,f||[]);},C=function(a,b,c){a||na("",null,b,Array.prototype.slice.call(arguments,2))},D=function(a,b,c){y(a)||na("Expected function but got %s: %s.",[x(a),a],b,Array.prototype.slice.call(arguments,2))};var E=function(a,b,c){this.S=c;this.L=a;this.U=b;this.s=0;this.o=null};E.prototype.get=function(){var a;0<this.s?(this.s--,a=this.o,this.o=a.next,a.next=null):a=this.L();return a};E.prototype.put=function(a){this.U(a);this.s<this.S&&(this.s++,a.next=this.o,this.o=a)};var F;a:{var oa=v.navigator;if(oa){var pa=oa.userAgent;if(pa){F=pa;break a}}F=""};var qa=function(a){v.setTimeout(function(){throw a;},0)},G,ra=function(){var a=v.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==F.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+
"//"+b.location.host,a=z(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==F.indexOf("Trident")&&-1==F.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.F;c.F=null;a()}};return function(a){d.next={F:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in
document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){v.setTimeout(a,0)}};var H=function(){this.v=this.f=null},sa=new E(function(){return new I},function(a){a.reset()},100);H.prototype.add=function(a,b){var c=sa.get();c.set(a,b);this.v?this.v.next=c:(C(!this.f),this.f=c);this.v=c};H.prototype.remove=function(){var a=null;this.f&&(a=this.f,this.f=this.f.next,this.f||(this.v=null),a.next=null);return a};var I=function(){this.next=this.scope=this.B=null};I.prototype.set=function(a,b){this.B=a;this.scope=b;this.next=null};
I.prototype.reset=function(){this.next=this.scope=this.B=null};var L=function(a,b){J||ta();K||(J(),K=!0);ua.add(a,b)},J,ta=function(){if(v.Promise&&v.Promise.resolve){var a=v.Promise.resolve(void 0);J=function(){a.then(va)}}else J=function(){var a=va,c;!(c=!y(v.setImmediate))&&(c=v.Window&&v.Window.prototype)&&(c=-1==F.indexOf("Edge")&&v.Window.prototype.setImmediate==v.setImmediate);c?(G||(G=ra()),G(a)):v.setImmediate(a)}},K=!1,ua=new H,va=function(){for(var a;a=ua.remove();){try{a.B.call(a.scope)}catch(b){qa(b)}sa.put(a)}K=!1};var O=function(a,b){this.b=0;this.K=void 0;this.j=this.g=this.u=null;this.m=this.A=!1;if(a!=w)try{var c=this;a.call(b,function(a){M(c,2,a)},function(a){try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(b){}M(c,3,a)})}catch(d){M(this,3,d)}},wa=function(){this.next=this.context=this.h=this.c=this.child=null;this.w=!1};wa.prototype.reset=function(){this.context=this.h=this.c=this.child=null;this.w=!1};
var xa=new E(function(){return new wa},function(a){a.reset()},100),ya=function(a,b,c){var d=xa.get();d.c=a;d.h=b;d.context=c;return d},Aa=function(a,b,c){za(a,b,c,null)||L(ka(b,a))};O.prototype.then=function(a,b,c){null!=a&&D(a,"opt_onFulfilled should be a function.");null!=b&&D(b,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return Ba(this,y(a)?a:null,y(b)?b:null,c)};O.prototype.then=O.prototype.then;O.prototype.$goog_Thenable=!0;
O.prototype.X=function(a,b){return Ba(this,null,a,b)};var Da=function(a,b){a.g||2!=a.b&&3!=a.b||Ca(a);C(null!=b.c);a.j?a.j.next=b:a.g=b;a.j=b},Ba=function(a,b,c,d){var e=ya(null,null,null);e.child=new O(function(a,k){e.c=b?function(c){try{var e=b.call(d,c);a(e)}catch(N){k(N)}}:a;e.h=c?function(b){try{var e=c.call(d,b);a(e)}catch(N){k(N)}}:k});e.child.u=a;Da(a,e);return e.child};O.prototype.Y=function(a){C(1==this.b);this.b=0;M(this,2,a)};O.prototype.Z=function(a){C(1==this.b);this.b=0;M(this,3,a)};
var M=function(a,b,c){0==a.b&&(a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself")),a.b=1,za(c,a.Y,a.Z,a)||(a.K=c,a.b=b,a.u=null,Ca(a),3!=b||Ea(a,c)))},za=function(a,b,c,d){if(a instanceof O)return null!=b&&D(b,"opt_onFulfilled should be a function."),null!=c&&D(c,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"),Da(a,ya(b||w,c||null,d)),!0;var e;if(a)try{e=!!a.$goog_Thenable}catch(k){e=!1}else e=!1;if(e)return a.then(b,c,d),
!0;e=typeof a;if("object"==e&&null!=a||"function"==e)try{var f=a.then;if(y(f))return Fa(a,f,b,c,d),!0}catch(k){return c.call(d,k),!0}return!1},Fa=function(a,b,c,d,e){var f=!1,k=function(a){f||(f=!0,c.call(e,a))},g=function(a){f||(f=!0,d.call(e,a))};try{b.call(a,k,g)}catch(n){g(n)}},Ca=function(a){a.A||(a.A=!0,L(a.N,a))},Ga=function(a){var b=null;a.g&&(b=a.g,a.g=b.next,b.next=null);a.g||(a.j=null);null!=b&&C(null!=b.c);return b};
O.prototype.N=function(){for(var a;a=Ga(this);){var b=this.b,c=this.K;if(3==b&&a.h&&!a.w){var d;for(d=this;d&&d.m;d=d.u)d.m=!1}if(a.child)a.child.u=null,Ha(a,b,c);else try{a.w?a.c.call(a.context):Ha(a,b,c)}catch(e){Ia.call(null,e)}xa.put(a)}this.A=!1};var Ha=function(a,b,c){2==b?a.c.call(a.context,c):a.h&&a.h.call(a.context,c)},Ea=function(a,b){a.m=!0;L(function(){a.m&&Ia.call(null,b)})},Ia=qa;function P(a,b){if(!(b instanceof Object))return b;switch(b.constructor){case Date:return new Date(b.getTime());case Object:void 0===a&&(a={});break;case Array:a=[];break;default:return b}for(var c in b)b.hasOwnProperty(c)&&(a[c]=P(a[c],b[c]));return a};var Ja=Error.captureStackTrace,R=function(a,b){this.code=a;this.message=b;if(Ja)Ja(this,Q.prototype.create);else{var c=Error.apply(this,arguments);this.name="FirebaseError";Object.defineProperty(this,"stack",{get:function(){return c.stack}})}};R.prototype=Object.create(Error.prototype);R.prototype.constructor=R;R.prototype.name="FirebaseError";var Q=function(a,b,c){this.V=a;this.W=b;this.M=c;this.pattern=/\{\$([^}]+)}/g};
Q.prototype.create=function(a,b){void 0===b&&(b={});var c=this.M[a];a=this.V+"/"+a;var c=void 0===c?"Error":c.replace(this.pattern,function(a,c){return void 0!==b[c]?b[c].toString():"<"+c+"?>"}),c=this.W+": "+c+" ("+a+").",c=new R(a,c),d;for(d in b)b.hasOwnProperty(d)&&"_"!==d.slice(-1)&&(c[d]=b[d]);return c};O.all=function(a){return new O(function(b,c){var d=a.length,e=[];if(d)for(var f=function(a,c){d--;e[a]=c;0==d&&b(e)},k=function(a){c(a)},g=0,n;g<a.length;g++)n=a[g],Aa(n,ka(f,g),k);else b(e)})};O.resolve=function(a){if(a instanceof O)return a;var b=new O(w);M(b,2,a);return b};O.reject=function(a){return new O(function(b,c){c(a)})};O.prototype["catch"]=O.prototype.X;var S=O;"undefined"!==typeof Promise&&(S=Promise);var Ka=S;function La(a,b){a=new T(a,b);return a.subscribe.bind(a)}var T=function(a,b){var c=this;this.a=[];this.J=0;this.task=Ka.resolve();this.l=!1;this.D=b;this.task.then(function(){a(c)}).catch(function(a){c.error(a)})};T.prototype.next=function(a){U(this,function(b){b.next(a)})};T.prototype.error=function(a){U(this,function(b){b.error(a)});this.close(a)};T.prototype.complete=function(){U(this,function(a){a.complete()});this.close()};
T.prototype.subscribe=function(a,b,c){var d=this,e;if(void 0===a&&void 0===b&&void 0===c)throw Error("Missing Observer.");e=Ma(a)?a:{next:a,error:b,complete:c};void 0===e.next&&(e.next=V);void 0===e.error&&(e.error=V);void 0===e.complete&&(e.complete=V);a=this.$.bind(this,this.a.length);this.l&&this.task.then(function(){try{d.G?e.error(d.G):e.complete()}catch(a){}});this.a.push(e);return a};
T.prototype.$=function(a){void 0!==this.a&&void 0!==this.a[a]&&(this.a[a]=void 0,--this.J,0===this.J&&void 0!==this.D&&this.D(this))};var U=function(a,b){if(!a.l)for(var c=0;c<a.a.length;c++)Na(a,c,b)},Na=function(a,b,c){a.task.then(function(){if(void 0!==a.a&&void 0!==a.a[b])try{c(a.a[b])}catch(d){}})};T.prototype.close=function(a){var b=this;this.l||(this.l=!0,void 0!==a&&(this.G=a),this.task.then(function(){b.a=void 0;b.D=void 0}))};
function Ma(a){if("object"!==typeof a||null===a)return!1;for(var b=ca(),c=b.next();!c.done;c=b.next())if(c=c.value,c in a&&"function"===typeof a[c])return!0;return!1}function V(){};var W=S,X=function(a,b,c){var d=this;this.H=c;this.I=!1;this.i={};this.P={};this.C=b;this.T=P(void 0,a);Object.keys(c.INTERNAL.factories).forEach(function(a){d[a]=d.R.bind(d,a)})};X.prototype.delete=function(){var a=this;return(new W(function(b){Y(a);b()})).then(function(){a.H.INTERNAL.removeApp(a.C);return W.all(Object.keys(a.i).map(function(b){return a.i[b].INTERNAL.delete()}))}).then(function(){a.I=!0;a.i=null;a.P=null})};
X.prototype.R=function(a){Y(this);void 0===this.i[a]&&(this.i[a]=this.H.INTERNAL.factories[a](this,this.O.bind(this)));return this.i[a]};X.prototype.O=function(a){P(this,a)};var Y=function(a){a.I&&Z(Oa("deleted",{name:a.C}))};Object.defineProperties(X.prototype,{name:{configurable:!0,enumerable:!0,get:function(){Y(this);return this.C}},options:{configurable:!0,enumerable:!0,get:function(){Y(this);return this.T}}});X.prototype.name&&X.prototype.options||X.prototype.delete||console.log("dc");
function Pa(){function a(a){a=a||"[DEFAULT]";var c=b[a];void 0===c&&Z("noApp",{name:a});return c}var b={},c={},d=[],e={initializeApp:function(a,c){void 0===c?c="[DEFAULT]":"string"===typeof c&&""!==c||Z("bad-app-name",{name:c+""});void 0!==b[c]&&Z("dupApp",{name:c});var g=new X(a,c,e);b[c]=g;d.forEach(function(a){return a("create",g)});void 0!=g.INTERNAL&&void 0!=g.INTERNAL.getToken||P(g,{INTERNAL:{getToken:function(){return W.resolve(null)},addAuthTokenListener:function(){},removeAuthTokenListener:function(){}}});
return g},app:a,apps:null,Promise:W,SDK_VERSION:"0.0.0",INTERNAL:{registerService:function(b,d,g){c[b]&&Z("dupService",{name:b});c[b]=d;d=function(c){void 0===c&&(c=a());return c[b]()};void 0!==g&&P(d,g);return e[b]=d},createFirebaseNamespace:Pa,extendNamespace:function(a){P(e,a)},createSubscribe:La,ErrorFactory:Q,registerAppHook:function(a){d.push(a)},removeApp:function(a){d.forEach(function(c){return c("delete",b[a])});delete b[a]},factories:c,Promise:O,deepExtend:P}};Object.defineProperty(e,"apps",
{get:function(){return Object.keys(b).map(function(a){return b[a]})}});a.App=X;return e}function Z(a,b){throw Error(Oa(a,b));}
function Oa(a,b){b=b||{};b={noApp:"No Firebase App '"+b.name+"' has been created - call Firebase App.initializeApp().","bad-app-name":"Illegal App name: '"+b.name+"'.",dupApp:"Firebase App named '"+b.name+"' already exists.",deleted:"Firebase App named '"+b.name+"' already deleted.",dupService:"Firebase Service named '"+b.name+"' already registered."}[a];return void 0===b?"Application Error: ("+a+")":b};"undefined"!==typeof window&&(window.firebase=Pa()); })();
firebase.SDK_VERSION = "3.0.5";
(function(){var k,aa=aa||{},l=this,ba=function(){},ca=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&
!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},da=function(a){return null===a},ea=function(a){return"array"==ca(a)},fa=function(a){var b=ca(a);return"array"==b||"object"==b&&"number"==typeof a.length},m=function(a){return"string"==typeof a},ga=function(a){return"number"==typeof a},n=function(a){return"function"==ca(a)},ha=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},ia=function(a,
b,c){return a.call.apply(a.bind,arguments)},ja=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},p=function(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ia:ja;return p.apply(null,arguments)},ka=function(a,b){var c=Array.prototype.slice.call(arguments,
1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}},la=Date.now||function(){return+new Date},q=function(a,b){function c(){}c.prototype=b.prototype;a.Bc=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Ce=function(a,c,f){for(var g=Array(arguments.length-2),h=2;h<arguments.length;h++)g[h-2]=arguments[h];return b.prototype[c].apply(a,g)}};var t=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,t);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};q(t,Error);t.prototype.name="CustomError";var ma=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")},na=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},oa=/&/g,pa=/</g,qa=/>/g,ra=/"/g,sa=/'/g,ta=/\x00/g,ua=/[\x00&<>"']/,u=function(a,b){return-1!=a.indexOf(b)},va=function(a,b){return a<b?-1:a>b?1:0};var wa=function(a,b){b.unshift(a);t.call(this,ma.apply(null,b));b.shift()};q(wa,t);wa.prototype.name="AssertionError";
var xa=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);throw new wa(""+e,f||[]);},v=function(a,b,c){a||xa("",null,b,Array.prototype.slice.call(arguments,2))},ya=function(a,b){throw new wa("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));},za=function(a,b,c){ga(a)||xa("Expected number but got %s: %s.",[ca(a),a],b,Array.prototype.slice.call(arguments,2));return a},Aa=function(a,b,c){m(a)||xa("Expected string but got %s: %s.",[ca(a),a],b,Array.prototype.slice.call(arguments,
2));return a},Ba=function(a,b,c){n(a)||xa("Expected function but got %s: %s.",[ca(a),a],b,Array.prototype.slice.call(arguments,2))};var Ca=Array.prototype.indexOf?function(a,b,c){v(null!=a.length);return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(m(a))return m(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},w=Array.prototype.forEach?function(a,b,c){v(null!=a.length);Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=m(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Da=function(a,b){for(var c=m(a)?
a.split(""):a,d=a.length-1;0<=d;--d)d in c&&b.call(void 0,c[d],d,a)},Ea=Array.prototype.map?function(a,b,c){v(null!=a.length);return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=m(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},Fa=Array.prototype.some?function(a,b,c){v(null!=a.length);return Array.prototype.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=m(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1},
Ha=function(a){var b;a:{b=Ga;for(var c=a.length,d=m(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:m(a)?a.charAt(b):a[b]},Ia=function(a,b){return 0<=Ca(a,b)},Ka=function(a,b){var c=Ca(a,b),d;(d=0<=c)&&Ja(a,c);return d},Ja=function(a,b){v(null!=a.length);return 1==Array.prototype.splice.call(a,b,1).length},La=function(a,b){var c=0;Da(a,function(d,e){b.call(void 0,d,e,a)&&Ja(a,e)&&c++})},Ma=function(a){return Array.prototype.concat.apply(Array.prototype,
arguments)},Na=function(a){return Array.prototype.concat.apply(Array.prototype,arguments)},Oa=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]},Pa=function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c];if(fa(d)){var e=a.length||0,f=d.length||0;a.length=e+f;for(var g=0;g<f;g++)a[e+g]=d[g]}else a.push(d)}};var Qa=function(a,b){for(var c in a)b.call(void 0,a[c],c,a)},Ra=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b},Sa=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b},Ta=function(a){for(var b in a)return!1;return!0},Ua=function(a,b){for(var c in a)if(!(c in b)||a[c]!==b[c])return!1;for(c in b)if(!(c in a))return!1;return!0},Va=function(a){var b={},c;for(c in a)b[c]=a[c];return b},Wa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),
Xa=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Wa.length;f++)c=Wa[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var $a;a:{var ab=l.navigator;if(ab){var bb=ab.userAgent;if(bb){$a=bb;break a}}$a=""}var x=function(a){return u($a,a)};var cb=x("Opera"),y=x("Trident")||x("MSIE"),db=x("Edge"),eb=db||y,fb=x("Gecko")&&!(u($a.toLowerCase(),"webkit")&&!x("Edge"))&&!(x("Trident")||x("MSIE"))&&!x("Edge"),gb=u($a.toLowerCase(),"webkit")&&!x("Edge"),hb=function(){var a=l.document;return a?a.documentMode:void 0},ib;
a:{var jb="",kb=function(){var a=$a;if(fb)return/rv\:([^\);]+)(\)|;)/.exec(a);if(db)return/Edge\/([\d\.]+)/.exec(a);if(y)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(gb)return/WebKit\/(\S+)/.exec(a);if(cb)return/(?:Version)[ \/]?(\S+)/.exec(a)}();kb&&(jb=kb?kb[1]:"");if(y){var lb=hb();if(null!=lb&&lb>parseFloat(jb)){ib=String(lb);break a}}ib=jb}
var mb=ib,nb={},z=function(a){var b;if(!(b=nb[a])){b=0;for(var c=na(String(mb)).split("."),d=na(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",h=d[f]||"",r=RegExp("(\\d*)(\\D*)","g"),Z=RegExp("(\\d*)(\\D*)","g");do{var Ya=r.exec(g)||["","",""],Za=Z.exec(h)||["","",""];if(0==Ya[0].length&&0==Za[0].length)break;b=va(0==Ya[1].length?0:parseInt(Ya[1],10),0==Za[1].length?0:parseInt(Za[1],10))||va(0==Ya[2].length,0==Za[2].length)||va(Ya[2],Za[2])}while(0==b)}b=nb[a]=
0<=b}return b},ob=l.document,pb=ob&&y?hb()||("CSS1Compat"==ob.compatMode?parseInt(mb,10):5):void 0;var qb=null,rb=null,tb=function(a){var b="";sb(a,function(a){b+=String.fromCharCode(a)});return b},sb=function(a,b){function c(b){for(;d<a.length;){var c=a.charAt(d++),e=rb[c];if(null!=e)return e;if(!/^[\s\xa0]*$/.test(c))throw Error("Unknown base64 encoding at char: "+c);}return b}ub();for(var d=0;;){var e=c(-1),f=c(0),g=c(64),h=c(64);if(64===h&&-1===e)break;b(e<<2|f>>4);64!=g&&(b(f<<4&240|g>>2),64!=h&&b(g<<6&192|h))}},ub=function(){if(!qb){qb={};rb={};for(var a=0;65>a;a++)qb[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),
rb[qb[a]]=a,62<=a&&(rb["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)]=a)}};var wb=function(){this.Rb="";this.Ad=vb};wb.prototype.kc=!0;wb.prototype.ic=function(){return this.Rb};wb.prototype.toString=function(){return"Const{"+this.Rb+"}"};var xb=function(a){if(a instanceof wb&&a.constructor===wb&&a.Ad===vb)return a.Rb;ya("expected object of type Const, got '"+a+"'");return"type_error:Const"},vb={};var A=function(){this.ca="";this.zd=yb};A.prototype.kc=!0;A.prototype.ic=function(){return this.ca};A.prototype.toString=function(){return"SafeUrl{"+this.ca+"}"};
var zb=function(a){if(a instanceof A&&a.constructor===A&&a.zd===yb)return a.ca;ya("expected object of type SafeUrl, got '"+a+"' of type "+ca(a));return"type_error:SafeUrl"},Ab=/^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/i,Cb=function(a){if(a instanceof A)return a;a=a.kc?a.ic():String(a);Ab.test(a)||(a="about:invalid#zClosurez");return Bb(a)},yb={},Bb=function(a){var b=new A;b.ca=a;return b};Bb("about:blank");var Eb=function(){this.ca="";this.yd=Db};Eb.prototype.kc=!0;Eb.prototype.ic=function(){return this.ca};Eb.prototype.toString=function(){return"SafeHtml{"+this.ca+"}"};var Fb=function(a){if(a instanceof Eb&&a.constructor===Eb&&a.yd===Db)return a.ca;ya("expected object of type SafeHtml, got '"+a+"' of type "+ca(a));return"type_error:SafeHtml"},Db={};Eb.prototype.ce=function(a){this.ca=a;return this};var Gb=function(a,b){var c;c=b instanceof A?b:Cb(b);a.href=zb(c)};var Hb=function(a){Hb[" "](a);return a};Hb[" "]=ba;var Ib=!y||9<=Number(pb),Jb=y&&!z("9");!gb||z("528");fb&&z("1.9b")||y&&z("8")||cb&&z("9.5")||gb&&z("528");fb&&!z("8")||y&&z("9");var Kb=function(){this.sa=this.sa;this.Ib=this.Ib};Kb.prototype.sa=!1;Kb.prototype.isDisposed=function(){return this.sa};Kb.prototype.Ha=function(){if(this.Ib)for(;this.Ib.length;)this.Ib.shift()()};var Lb=function(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.Pa=!1;this.jd=!0};Lb.prototype.preventDefault=function(){this.defaultPrevented=!0;this.jd=!1};var Mb=function(a,b){Lb.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.wb=this.state=null;a&&this.init(a,b)};q(Mb,Lb);
Mb.prototype.init=function(a,b){var c=this.type=a.type,d=a.changedTouches?a.changedTouches[0]:null;this.target=a.target||a.srcElement;this.currentTarget=b;var e=a.relatedTarget;if(e){if(fb){var f;a:{try{Hb(e.nodeName);f=!0;break a}catch(g){}f=!1}f||(e=null)}}else"mouseover"==c?e=a.fromElement:"mouseout"==c&&(e=a.toElement);this.relatedTarget=e;null===d?(this.offsetX=gb||void 0!==a.offsetX?a.offsetX:a.layerX,this.offsetY=gb||void 0!==a.offsetY?a.offsetY:a.layerY,this.clientX=void 0!==a.clientX?a.clientX:
a.pageX,this.clientY=void 0!==a.clientY?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0):(this.clientX=void 0!==d.clientX?d.clientX:d.pageX,this.clientY=void 0!==d.clientY?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0);this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.wb=a;a.defaultPrevented&&
this.preventDefault()};Mb.prototype.preventDefault=function(){Mb.Bc.preventDefault.call(this);var a=this.wb;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,Jb)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var Nb="closure_listenable_"+(1E6*Math.random()|0),Ob=0;var Pb=function(a,b,c,d,e){this.listener=a;this.Kb=null;this.src=b;this.type=c;this.tb=!!d;this.Cb=e;this.key=++Ob;this.Ra=this.sb=!1},Qb=function(a){a.Ra=!0;a.listener=null;a.Kb=null;a.src=null;a.Cb=null};var Rb=function(a){this.src=a;this.v={};this.rb=0};Rb.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.v[f];a||(a=this.v[f]=[],this.rb++);var g=Sb(a,b,d,e);-1<g?(b=a[g],c||(b.sb=!1)):(b=new Pb(b,this.src,f,!!d,e),b.sb=c,a.push(b));return b};Rb.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.v))return!1;var e=this.v[a];b=Sb(e,b,c,d);return-1<b?(Qb(e[b]),Ja(e,b),0==e.length&&(delete this.v[a],this.rb--),!0):!1};
var Tb=function(a,b){var c=b.type;c in a.v&&Ka(a.v[c],b)&&(Qb(b),0==a.v[c].length&&(delete a.v[c],a.rb--))};Rb.prototype.gc=function(a,b,c,d){a=this.v[a.toString()];var e=-1;a&&(e=Sb(a,b,c,d));return-1<e?a[e]:null};var Sb=function(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.Ra&&f.listener==b&&f.tb==!!c&&f.Cb==d)return e}return-1};var Ub="closure_lm_"+(1E6*Math.random()|0),Vb={},Wb=0,Xb=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)Xb(a,b[f],c,d,e);else c=Yb(c),a&&a[Nb]?Zb(a,b,c,d,e):$b(a,b,c,!1,d,e)},$b=function(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=!!e,h=ac(a);h||(a[Ub]=h=new Rb(a));c=h.add(b,c,d,e,f);if(!c.Kb){d=bc();c.Kb=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,g);else if(a.attachEvent)a.attachEvent(cc(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");
Wb++}},bc=function(){var a=dc,b=Ib?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b},ec=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)ec(a,b[f],c,d,e);else c=Yb(c),a&&a[Nb]?fc(a,b,c,d,e):$b(a,b,c,!0,d,e)},gc=function(a,b,c,d,e){if(ea(b))for(var f=0;f<b.length;f++)gc(a,b[f],c,d,e);else c=Yb(c),a&&a[Nb]?a.T.remove(String(b),c,d,e):a&&(a=ac(a))&&(b=a.gc(b,c,!!d,e))&&hc(b)},hc=function(a){if(!ga(a)&&a&&!a.Ra){var b=a.src;if(b&&
b[Nb])Tb(b.T,a);else{var c=a.type,d=a.Kb;b.removeEventListener?b.removeEventListener(c,d,a.tb):b.detachEvent&&b.detachEvent(cc(c),d);Wb--;(c=ac(b))?(Tb(c,a),0==c.rb&&(c.src=null,b[Ub]=null)):Qb(a)}}},cc=function(a){return a in Vb?Vb[a]:Vb[a]="on"+a},jc=function(a,b,c,d){var e=!0;if(a=ac(a))if(b=a.v[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.tb==c&&!f.Ra&&(f=ic(f,d),e=e&&!1!==f)}return e},ic=function(a,b){var c=a.listener,d=a.Cb||a.src;a.sb&&hc(a);return c.call(d,b)},dc=function(a,
b){if(a.Ra)return!0;if(!Ib){var c;if(!(c=b))a:{c=["window","event"];for(var d=l,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new Mb(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(r){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.currentTarget;f;f=f.parentNode)e.push(f);for(var f=a.type,g=e.length-1;!c.Pa&&0<=g;g--){c.currentTarget=e[g];var h=jc(e[g],f,!0,c),d=d&&h}for(g=0;!c.Pa&&g<e.length;g++)c.currentTarget=
e[g],h=jc(e[g],f,!1,c),d=d&&h}return d}return ic(a,new Mb(b,this))},ac=function(a){a=a[Ub];return a instanceof Rb?a:null},kc="__closure_events_fn_"+(1E9*Math.random()>>>0),Yb=function(a){v(a,"Listener can not be null.");if(n(a))return a;v(a.handleEvent,"An object listener must have handleEvent method.");a[kc]||(a[kc]=function(b){return a.handleEvent(b)});return a[kc]};var lc=/^[+a-zA-Z0-9_.!#$%&'*\/=?^`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,63}$/;var mc=function(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);},pc=function(a){var b=[];nc(new oc,a,b);return b.join("")},oc=function(){this.Nb=void 0},nc=function(a,b,c){if(null==
b)c.push("null");else{if("object"==typeof b){if(ea(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),e=d[f],nc(a,a.Nb?a.Nb.call(d,String(f),e):e,c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else{c.push("{");f="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(e=b[d],"function"!=typeof e&&(c.push(f),qc(d,c),c.push(":"),nc(a,a.Nb?a.Nb.call(b,d,e):e,c),f=","));c.push("}");return}}switch(typeof b){case "string":qc(b,
c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?String(b):"null");break;case "boolean":c.push(String(b));break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}},rc={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},sc=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g,qc=function(a,b){b.push('"',a.replace(sc,function(a){var b=rc[a];b||(b="\\u"+(a.charCodeAt(0)|65536).toString(16).substr(1),
rc[a]=b);return b}),'"')};var tc=function(){};tc.prototype.Ec=null;var uc=function(a){return a.Ec||(a.Ec=a.Wc())};var vc,wc=function(){};q(wc,tc);wc.prototype.bc=function(){var a=xc(this);return a?new ActiveXObject(a):new XMLHttpRequest};wc.prototype.Wc=function(){var a={};xc(this)&&(a[0]=!0,a[1]=!0);return a};
var xc=function(a){if(!a.Sc&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.Sc=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.Sc};vc=new wc;var yc=function(){};q(yc,tc);yc.prototype.bc=function(){var a=new XMLHttpRequest;if("withCredentials"in a)return a;if("undefined"!=typeof XDomainRequest)return new zc;throw Error("Unsupported browser");};yc.prototype.Wc=function(){return{}};
var zc=function(){this.ha=new XDomainRequest;this.readyState=0;this.responseText=this.onreadystatechange=null;this.status=-1;this.statusText=this.responseXML=null;this.ha.onload=p(this.Rd,this);this.ha.onerror=p(this.Qc,this);this.ha.onprogress=p(this.Sd,this);this.ha.ontimeout=p(this.Td,this)};k=zc.prototype;k.open=function(a,b,c){if(null!=c&&!c)throw Error("Only async requests are supported.");this.ha.open(a,b)};
k.send=function(a){if(a)if("string"==typeof a)this.ha.send(a);else throw Error("Only string data is supported");else this.ha.send()};k.abort=function(){this.ha.abort()};k.setRequestHeader=function(){};k.Rd=function(){this.status=200;this.responseText=this.ha.responseText;Ac(this,4)};k.Qc=function(){this.status=500;this.responseText=null;Ac(this,4)};k.Td=function(){this.Qc()};k.Sd=function(){this.status=200;Ac(this,1)};var Ac=function(a,b){a.readyState=b;if(a.onreadystatechange)a.onreadystatechange()};var B=function(a,b){this.h=[];this.g=b;for(var c=!0,d=a.length-1;0<=d;d--){var e=a[d]|0;c&&e==b||(this.h[d]=e,c=!1)}},Bc={},Cc=function(a){if(-128<=a&&128>a){var b=Bc[a];if(b)return b}b=new B([a|0],0>a?-1:0);-128<=a&&128>a&&(Bc[a]=b);return b},E=function(a){if(isNaN(a)||!isFinite(a))return C;if(0>a)return D(E(-a));for(var b=[],c=1,d=0;a>=c;d++)b[d]=a/c|0,c*=4294967296;return new B(b,0)},Dc=function(a,b){if(0==a.length)throw Error("number format error: empty string");var c=b||10;if(2>c||36<c)throw Error("radix out of range: "+
c);if("-"==a.charAt(0))return D(Dc(a.substring(1),c));if(0<=a.indexOf("-"))throw Error('number format error: interior "-" character');for(var d=E(Math.pow(c,8)),e=C,f=0;f<a.length;f+=8){var g=Math.min(8,a.length-f),h=parseInt(a.substring(f,f+g),c);8>g?(g=E(Math.pow(c,g)),e=e.multiply(g).add(E(h))):(e=e.multiply(d),e=e.add(E(h)))}return e},C=Cc(0),Ec=Cc(1),Fc=Cc(16777216),Gc=function(a){if(-1==a.g)return-Gc(D(a));for(var b=0,c=1,d=0;d<a.h.length;d++)b+=Hc(a,d)*c,c*=4294967296;return b};
B.prototype.toString=function(a){a=a||10;if(2>a||36<a)throw Error("radix out of range: "+a);if(Ic(this))return"0";if(-1==this.g)return"-"+D(this).toString(a);for(var b=E(Math.pow(a,6)),c=this,d="";;){var e=Jc(c,b),c=Kc(c,e.multiply(b)),f=((0<c.h.length?c.h[0]:c.g)>>>0).toString(a),c=e;if(Ic(c))return f+d;for(;6>f.length;)f="0"+f;d=""+f+d}};
var F=function(a,b){return 0>b?0:b<a.h.length?a.h[b]:a.g},Hc=function(a,b){var c=F(a,b);return 0<=c?c:4294967296+c},Ic=function(a){if(0!=a.g)return!1;for(var b=0;b<a.h.length;b++)if(0!=a.h[b])return!1;return!0};B.prototype.vb=function(a){if(this.g!=a.g)return!1;for(var b=Math.max(this.h.length,a.h.length),c=0;c<b;c++)if(F(this,c)!=F(a,c))return!1;return!0};B.prototype.compare=function(a){a=Kc(this,a);return-1==a.g?-1:Ic(a)?0:1};
var D=function(a){for(var b=a.h.length,c=[],d=0;d<b;d++)c[d]=~a.h[d];return(new B(c,~a.g)).add(Ec)};B.prototype.add=function(a){for(var b=Math.max(this.h.length,a.h.length),c=[],d=0,e=0;e<=b;e++){var f=d+(F(this,e)&65535)+(F(a,e)&65535),g=(f>>>16)+(F(this,e)>>>16)+(F(a,e)>>>16),d=g>>>16,f=f&65535,g=g&65535;c[e]=g<<16|f}return new B(c,c[c.length-1]&-2147483648?-1:0)};var Kc=function(a,b){return a.add(D(b))};
B.prototype.multiply=function(a){if(Ic(this)||Ic(a))return C;if(-1==this.g)return-1==a.g?D(this).multiply(D(a)):D(D(this).multiply(a));if(-1==a.g)return D(this.multiply(D(a)));if(0>this.compare(Fc)&&0>a.compare(Fc))return E(Gc(this)*Gc(a));for(var b=this.h.length+a.h.length,c=[],d=0;d<2*b;d++)c[d]=0;for(d=0;d<this.h.length;d++)for(var e=0;e<a.h.length;e++){var f=F(this,d)>>>16,g=F(this,d)&65535,h=F(a,e)>>>16,r=F(a,e)&65535;c[2*d+2*e]+=g*r;Lc(c,2*d+2*e);c[2*d+2*e+1]+=f*r;Lc(c,2*d+2*e+1);c[2*d+2*e+
1]+=g*h;Lc(c,2*d+2*e+1);c[2*d+2*e+2]+=f*h;Lc(c,2*d+2*e+2)}for(d=0;d<b;d++)c[d]=c[2*d+1]<<16|c[2*d];for(d=b;d<2*b;d++)c[d]=0;return new B(c,0)};
var Lc=function(a,b){for(;(a[b]&65535)!=a[b];)a[b+1]+=a[b]>>>16,a[b]&=65535},Jc=function(a,b){if(Ic(b))throw Error("division by zero");if(Ic(a))return C;if(-1==a.g)return-1==b.g?Jc(D(a),D(b)):D(Jc(D(a),b));if(-1==b.g)return D(Jc(a,D(b)));if(30<a.h.length){if(-1==a.g||-1==b.g)throw Error("slowDivide_ only works with positive integers.");for(var c=Ec,d=b;0>=d.compare(a);)c=c.shiftLeft(1),d=d.shiftLeft(1);for(var e=Mc(c,1),f=Mc(d,1),g,d=Mc(d,2),c=Mc(c,2);!Ic(d);)g=f.add(d),0>=g.compare(a)&&(e=e.add(c),
f=g),d=Mc(d,1),c=Mc(c,1);return e}c=C;for(d=a;0<=d.compare(b);){e=Math.max(1,Math.floor(Gc(d)/Gc(b)));f=Math.ceil(Math.log(e)/Math.LN2);f=48>=f?1:Math.pow(2,f-48);g=E(e);for(var h=g.multiply(b);-1==h.g||0<h.compare(d);)e-=f,g=E(e),h=g.multiply(b);Ic(g)&&(g=Ec);c=c.add(g);d=Kc(d,h)}return c},Nc=function(a,b){for(var c=Math.max(a.h.length,b.h.length),d=[],e=0;e<c;e++)d[e]=F(a,e)|F(b,e);return new B(d,a.g|b.g)};
B.prototype.shiftLeft=function(a){var b=a>>5;a%=32;for(var c=this.h.length+b+(0<a?1:0),d=[],e=0;e<c;e++)d[e]=0<a?F(this,e-b)<<a|F(this,e-b-1)>>>32-a:F(this,e-b);return new B(d,this.g)};var Mc=function(a,b){for(var c=b>>5,d=b%32,e=a.h.length-c,f=[],g=0;g<e;g++)f[g]=0<d?F(a,g+c)>>>d|F(a,g+c+1)<<32-d:F(a,g+c);return new B(f,a.g)};var Oc=function(a,b){this.fb=a;this.ga=b};Oc.prototype.vb=function(a){return this.ga==a.ga&&this.fb.vb(Va(a.fb))};
var Rc=function(a){try{var b;if(b=0==a.lastIndexOf("[",0)){var c=a.length-1;b=0<=c&&a.indexOf("]",c)==c}return b?new Pc(a.substring(1,a.length-1)):new Qc(a)}catch(d){return null}},Qc=function(a){var b=C;if(a instanceof B){if(0!=a.g||0>a.compare(C)||0<a.compare(Sc))throw Error("The address does not look like an IPv4.");b=Va(a)}else{if(!Tc.test(a))throw Error(a+" does not look like an IPv4 address.");var c=a.split(".");if(4!=c.length)throw Error(a+" does not look like an IPv4 address.");for(var d=0;d<
c.length;d++){var e;e=c[d];var f=Number(e);e=0==f&&/^[\s\xa0]*$/.test(e)?NaN:f;if(isNaN(e)||0>e||255<e||1!=c[d].length&&0==c[d].lastIndexOf("0",0))throw Error("In "+a+", octet "+d+" is not valid");e=E(e);b=Nc(b.shiftLeft(8),e)}}Oc.call(this,b,4)};q(Qc,Oc);var Tc=/^[0-9.]*$/,Sc=Kc(Ec.shiftLeft(32),Ec);Qc.prototype.toString=function(){if(this.wa)return this.wa;for(var a=Hc(this.fb,0),b=[],c=3;0<=c;c--)b[c]=String(a&255),a>>>=8;return this.wa=b.join(".")};
var Pc=function(a){var b=C;if(a instanceof B){if(0!=a.g||0>a.compare(C)||0<a.compare(Uc))throw Error("The address does not look like a valid IPv6.");b=Va(a)}else{if(!Vc.test(a))throw Error(a+" is not a valid IPv6 address.");var c=a.split(":");if(-1!=c[c.length-1].indexOf(".")){a=Hc(Va((new Qc(c[c.length-1])).fb),0);var d=[];d.push((a>>>16&65535).toString(16));d.push((a&65535).toString(16));Ja(c,c.length-1);Pa(c,d);a=c.join(":")}d=a.split("::");if(2<d.length||1==d.length&&8!=c.length)throw Error(a+
" is not a valid IPv6 address.");if(1<d.length){c=d[0].split(":");d=d[1].split(":");1==c.length&&""==c[0]&&(c=[]);1==d.length&&""==d[0]&&(d=[]);var e=8-(c.length+d.length);if(1>e)c=[];else{for(var f=[],g=0;g<e;g++)f[g]="0";c=Na(c,f,d)}}if(8!=c.length)throw Error(a+" is not a valid IPv6 address");for(d=0;d<c.length;d++){e=Dc(c[d],16);if(0>e.compare(C)||0<e.compare(Wc))throw Error(c[d]+" in "+a+" is not a valid hextet.");b=Nc(b.shiftLeft(16),e)}}Oc.call(this,b,6)};q(Pc,Oc);
var Vc=/^([a-fA-F0-9]*:){2}[a-fA-F0-9:.]*$/,Wc=Cc(65535),Uc=Kc(Ec.shiftLeft(128),Ec);Pc.prototype.toString=function(){if(this.wa)return this.wa;for(var a=[],b=3;0<=b;b--){var c=Hc(this.fb,b),d=c&65535;a.push((c>>>16).toString(16));a.push(d.toString(16))}for(var c=b=-1,e=d=0,f=0;f<a.length;f++)"0"==a[f]?(e++,-1==c&&(c=f),e>d&&(d=e,b=c)):(c=-1,e=0);0<d&&(b+d==a.length&&a.push(""),a.splice(b,d,""),0==b&&(a=[""].concat(a)));return this.wa=a.join(":")};!fb&&!y||y&&9<=Number(pb)||fb&&z("1.9.1");y&&z("9");var Yc=function(a,b){Qa(b,function(b,d){"style"==d?a.style.cssText=b:"class"==d?a.className=b:"for"==d?a.htmlFor=b:Xc.hasOwnProperty(d)?a.setAttribute(Xc[d],b):0==d.lastIndexOf("aria-",0)||0==d.lastIndexOf("data-",0)?a.setAttribute(d,b):a[d]=b})},Xc={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",nonce:"nonce",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};var Zc=function(a,b,c){this.ee=c;this.Gd=a;this.oe=b;this.Hb=0;this.Db=null};Zc.prototype.get=function(){var a;0<this.Hb?(this.Hb--,a=this.Db,this.Db=a.next,a.next=null):a=this.Gd();return a};Zc.prototype.put=function(a){this.oe(a);this.Hb<this.ee&&(this.Hb++,a.next=this.Db,this.Db=a)};var $c=function(a){l.setTimeout(function(){throw a;},0)},ad,bd=function(){var a=l.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!x("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,
a=p(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!x("Trident")&&!x("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Ic;c.Ic=null;a()}};return function(a){d.next={Ic:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?
function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){l.setTimeout(a,0)}};var cd=function(){this.Vb=this.Ea=null},ed=new Zc(function(){return new dd},function(a){a.reset()},100);cd.prototype.add=function(a,b){var c=ed.get();c.set(a,b);this.Vb?this.Vb.next=c:(v(!this.Ea),this.Ea=c);this.Vb=c};cd.prototype.remove=function(){var a=null;this.Ea&&(a=this.Ea,this.Ea=this.Ea.next,this.Ea||(this.Vb=null),a.next=null);return a};var dd=function(){this.next=this.scope=this.fc=null};dd.prototype.set=function(a,b){this.fc=a;this.scope=b;this.next=null};
dd.prototype.reset=function(){this.next=this.scope=this.fc=null};var jd=function(a,b){fd||gd();hd||(fd(),hd=!0);id.add(a,b)},fd,gd=function(){if(l.Promise&&l.Promise.resolve){var a=l.Promise.resolve(void 0);fd=function(){a.then(kd)}}else fd=function(){var a=kd;!n(l.setImmediate)||l.Window&&l.Window.prototype&&!x("Edge")&&l.Window.prototype.setImmediate==l.setImmediate?(ad||(ad=bd()),ad(a)):l.setImmediate(a)}},hd=!1,id=new cd,kd=function(){for(var a;a=id.remove();){try{a.fc.call(a.scope)}catch(b){$c(b)}ed.put(a)}hd=!1};var ld=function(a){a.prototype.then=a.prototype.then;a.prototype.$goog_Thenable=!0},md=function(a){if(!a)return!1;try{return!!a.$goog_Thenable}catch(b){return!1}};var G=function(a,b){this.A=0;this.ea=void 0;this.Ga=this.$=this.m=null;this.Bb=this.ec=!1;if(a!=ba)try{var c=this;a.call(b,function(a){nd(c,2,a)},function(a){if(!(a instanceof od))try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(b){}nd(c,3,a)})}catch(d){nd(this,3,d)}},pd=function(){this.next=this.context=this.Ma=this.xa=this.child=null;this.Ya=!1};pd.prototype.reset=function(){this.context=this.Ma=this.xa=this.child=null;this.Ya=!1};
var qd=new Zc(function(){return new pd},function(a){a.reset()},100),rd=function(a,b,c){var d=qd.get();d.xa=a;d.Ma=b;d.context=c;return d},H=function(a){if(a instanceof G)return a;var b=new G(ba);nd(b,2,a);return b},I=function(a){return new G(function(b,c){c(a)})},td=function(a,b,c){sd(a,b,c,null)||jd(ka(b,a))},ud=function(a){return new G(function(b){var c=a.length,d=[];if(c)for(var e=function(a,e,f){c--;d[a]=e?{Pd:!0,value:f}:{Pd:!1,reason:f};0==c&&b(d)},f=0,g;f<a.length;f++)g=a[f],td(g,ka(e,f,!0),
ka(e,f,!1));else b(d)})};G.prototype.then=function(a,b,c){null!=a&&Ba(a,"opt_onFulfilled should be a function.");null!=b&&Ba(b,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return vd(this,n(a)?a:null,n(b)?b:null,c)};ld(G);var xd=function(a,b){var c=rd(b,b,void 0);c.Ya=!0;wd(a,c);return a};G.prototype.M=function(a,b){return vd(this,null,a,b)};G.prototype.cancel=function(a){0==this.A&&jd(function(){var b=new od(a);yd(this,b)},this)};
var yd=function(a,b){if(0==a.A)if(a.m){var c=a.m;if(c.$){for(var d=0,e=null,f=null,g=c.$;g&&(g.Ya||(d++,g.child==a&&(e=g),!(e&&1<d)));g=g.next)e||(f=g);e&&(0==c.A&&1==d?yd(c,b):(f?(d=f,v(c.$),v(null!=d),d.next==c.Ga&&(c.Ga=d),d.next=d.next.next):zd(c),Ad(c,e,3,b)))}a.m=null}else nd(a,3,b)},wd=function(a,b){a.$||2!=a.A&&3!=a.A||Bd(a);v(null!=b.xa);a.Ga?a.Ga.next=b:a.$=b;a.Ga=b},vd=function(a,b,c,d){var e=rd(null,null,null);e.child=new G(function(a,g){e.xa=b?function(c){try{var e=b.call(d,c);a(e)}catch(Z){g(Z)}}:
a;e.Ma=c?function(b){try{var e=c.call(d,b);void 0===e&&b instanceof od?g(b):a(e)}catch(Z){g(Z)}}:g});e.child.m=a;wd(a,e);return e.child};G.prototype.ye=function(a){v(1==this.A);this.A=0;nd(this,2,a)};G.prototype.ze=function(a){v(1==this.A);this.A=0;nd(this,3,a)};
var nd=function(a,b,c){0==a.A&&(a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself")),a.A=1,sd(c,a.ye,a.ze,a)||(a.ea=c,a.A=b,a.m=null,Bd(a),3!=b||c instanceof od||Cd(a,c)))},sd=function(a,b,c,d){if(a instanceof G)return null!=b&&Ba(b,"opt_onFulfilled should be a function."),null!=c&&Ba(c,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"),wd(a,rd(b||ba,c||null,d)),!0;if(md(a))return a.then(b,c,d),!0;if(ha(a))try{var e=a.then;if(n(e))return Dd(a,
e,b,c,d),!0}catch(f){return c.call(d,f),!0}return!1},Dd=function(a,b,c,d,e){var f=!1,g=function(a){f||(f=!0,c.call(e,a))},h=function(a){f||(f=!0,d.call(e,a))};try{b.call(a,g,h)}catch(r){h(r)}},Bd=function(a){a.ec||(a.ec=!0,jd(a.Kd,a))},zd=function(a){var b=null;a.$&&(b=a.$,a.$=b.next,b.next=null);a.$||(a.Ga=null);null!=b&&v(null!=b.xa);return b};G.prototype.Kd=function(){for(var a;a=zd(this);)Ad(this,a,this.A,this.ea);this.ec=!1};
var Ad=function(a,b,c,d){if(3==c&&b.Ma&&!b.Ya)for(;a&&a.Bb;a=a.m)a.Bb=!1;if(b.child)b.child.m=null,Ed(b,c,d);else try{b.Ya?b.xa.call(b.context):Ed(b,c,d)}catch(e){Fd.call(null,e)}qd.put(b)},Ed=function(a,b,c){2==b?a.xa.call(a.context,c):a.Ma&&a.Ma.call(a.context,c)},Cd=function(a,b){a.Bb=!0;jd(function(){a.Bb&&Fd.call(null,b)})},Fd=$c,od=function(a){t.call(this,a)};q(od,t);od.prototype.name="cancel";/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
var Gd=function(a,b){this.Ob=[];this.bd=a;this.Kc=b||null;this.bb=this.Ja=!1;this.ea=void 0;this.zc=this.Dc=this.Zb=!1;this.Tb=0;this.m=null;this.$b=0};Gd.prototype.cancel=function(a){if(this.Ja)this.ea instanceof Gd&&this.ea.cancel();else{if(this.m){var b=this.m;delete this.m;a?b.cancel(a):(b.$b--,0>=b.$b&&b.cancel())}this.bd?this.bd.call(this.Kc,this):this.zc=!0;this.Ja||Hd(this,new Id)}};Gd.prototype.Jc=function(a,b){this.Zb=!1;Jd(this,a,b)};
var Jd=function(a,b,c){a.Ja=!0;a.ea=c;a.bb=!b;Kd(a)},Md=function(a){if(a.Ja){if(!a.zc)throw new Ld;a.zc=!1}};Gd.prototype.callback=function(a){Md(this);Nd(a);Jd(this,!0,a)};var Hd=function(a,b){Md(a);Nd(b);Jd(a,!1,b)},Nd=function(a){v(!(a instanceof Gd),"An execution sequence may not be initiated with a blocking Deferred.")},Pd=function(a,b){Od(a,null,b,void 0)},Od=function(a,b,c,d){v(!a.Dc,"Blocking Deferreds can not be re-used");a.Ob.push([b,c,d]);a.Ja&&Kd(a)};
Gd.prototype.then=function(a,b,c){var d,e,f=new G(function(a,b){d=a;e=b});Od(this,d,function(a){a instanceof Id?f.cancel():e(a)});return f.then(a,b,c)};ld(Gd);
var Qd=function(a){return Fa(a.Ob,function(a){return n(a[1])})},Kd=function(a){if(a.Tb&&a.Ja&&Qd(a)){var b=a.Tb,c=Rd[b];c&&(l.clearTimeout(c.cb),delete Rd[b]);a.Tb=0}a.m&&(a.m.$b--,delete a.m);for(var b=a.ea,d=c=!1;a.Ob.length&&!a.Zb;){var e=a.Ob.shift(),f=e[0],g=e[1],e=e[2];if(f=a.bb?g:f)try{var h=f.call(e||a.Kc,b);void 0!==h&&(a.bb=a.bb&&(h==b||h instanceof Error),a.ea=b=h);if(md(b)||"function"===typeof l.Promise&&b instanceof l.Promise)d=!0,a.Zb=!0}catch(r){b=r,a.bb=!0,Qd(a)||(c=!0)}}a.ea=b;d&&
(h=p(a.Jc,a,!0),d=p(a.Jc,a,!1),b instanceof Gd?(Od(b,h,d),b.Dc=!0):b.then(h,d));c&&(b=new Sd(b),Rd[b.cb]=b,a.Tb=b.cb)},Ld=function(){t.call(this)};q(Ld,t);Ld.prototype.message="Deferred has already fired";Ld.prototype.name="AlreadyCalledError";var Id=function(){t.call(this)};q(Id,t);Id.prototype.message="Deferred was canceled";Id.prototype.name="CanceledError";var Sd=function(a){this.cb=l.setTimeout(p(this.xe,this),0);this.D=a};
Sd.prototype.xe=function(){v(Rd[this.cb],"Cannot throw an error that is not scheduled.");delete Rd[this.cb];throw this.D;};var Rd={};var Xd=function(a){var b={},c=b.document||document,d=document.createElement("SCRIPT"),e={ld:d,qb:void 0},f=new Gd(Td,e),g=null,h=null!=b.timeout?b.timeout:5E3;0<h&&(g=window.setTimeout(function(){Ud(d,!0);Hd(f,new Vd(1,"Timeout reached for loading script "+a))},h),e.qb=g);d.onload=d.onreadystatechange=function(){d.readyState&&"loaded"!=d.readyState&&"complete"!=d.readyState||(Ud(d,b.De||!1,g),f.callback(null))};d.onerror=function(){Ud(d,!0,g);Hd(f,new Vd(0,"Error while loading script "+a))};e=b.attributes||
{};Xa(e,{type:"text/javascript",charset:"UTF-8",src:a});Yc(d,e);Wd(c).appendChild(d);return f},Wd=function(a){var b=a.getElementsByTagName("HEAD");return b&&0!=b.length?b[0]:a.documentElement},Td=function(){if(this&&this.ld){var a=this.ld;a&&"SCRIPT"==a.tagName&&Ud(a,!0,this.qb)}},Ud=function(a,b,c){null!=c&&l.clearTimeout(c);a.onload=ba;a.onerror=ba;a.onreadystatechange=ba;b&&window.setTimeout(function(){a&&a.parentNode&&a.parentNode.removeChild(a)},0)},Vd=function(a,b){var c="Jsloader error (code #"+
a+")";b&&(c+=": "+b);t.call(this,c);this.code=a};q(Vd,t);var J=function(){Kb.call(this);this.T=new Rb(this);this.Cd=this;this.oc=null};q(J,Kb);J.prototype[Nb]=!0;J.prototype.addEventListener=function(a,b,c,d){Xb(this,a,b,c,d)};J.prototype.removeEventListener=function(a,b,c,d){gc(this,a,b,c,d)};
J.prototype.dispatchEvent=function(a){Yd(this);var b,c=this.oc;if(c){b=[];for(var d=1;c;c=c.oc)b.push(c),v(1E3>++d,"infinite loop")}c=this.Cd;d=a.type||a;if(m(a))a=new Lb(a,c);else if(a instanceof Lb)a.target=a.target||c;else{var e=a;a=new Lb(d,c);Xa(a,e)}var e=!0,f;if(b)for(var g=b.length-1;!a.Pa&&0<=g;g--)f=a.currentTarget=b[g],e=Zd(f,d,!0,a)&&e;a.Pa||(f=a.currentTarget=c,e=Zd(f,d,!0,a)&&e,a.Pa||(e=Zd(f,d,!1,a)&&e));if(b)for(g=0;!a.Pa&&g<b.length;g++)f=a.currentTarget=b[g],e=Zd(f,d,!1,a)&&e;return e};
J.prototype.Ha=function(){J.Bc.Ha.call(this);if(this.T){var a=this.T,b=0,c;for(c in a.v){for(var d=a.v[c],e=0;e<d.length;e++)++b,Qb(d[e]);delete a.v[c];a.rb--}}this.oc=null};
var Zb=function(a,b,c,d,e){Yd(a);a.T.add(String(b),c,!1,d,e)},fc=function(a,b,c,d,e){a.T.add(String(b),c,!0,d,e)},Zd=function(a,b,c,d){b=a.T.v[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.Ra&&g.tb==c){var h=g.listener,r=g.Cb||g.src;g.sb&&Tb(a.T,g);e=!1!==h.call(r,d)&&e}}return e&&0!=d.jd};J.prototype.gc=function(a,b,c,d){return this.T.gc(String(a),b,c,d)};var Yd=function(a){v(a.T,"Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")};var $d="StopIteration"in l?l.StopIteration:{message:"StopIteration",stack:""},ae=function(){};ae.prototype.next=function(){throw $d;};ae.prototype.Xa=function(){return this};
var be=function(a){if(a instanceof ae)return a;if("function"==typeof a.Xa)return a.Xa(!1);if(fa(a)){var b=0,c=new ae;c.next=function(){for(;;){if(b>=a.length)throw $d;if(b in a)return a[b++];b++}};return c}throw Error("Not implemented");},ce=function(a,b){if(fa(a))try{w(a,b,void 0)}catch(c){if(c!==$d)throw c;}else{a=be(a);try{for(;;)b.call(void 0,a.next(),void 0,a)}catch(c){if(c!==$d)throw c;}}};var de=function(a,b){this.U={};this.o=[];this.ga=this.i=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else a&&this.addAll(a)};k=de.prototype;k.yb=function(){return this.i};k.N=function(){ee(this);for(var a=[],b=0;b<this.o.length;b++)a.push(this.U[this.o[b]]);return a};k.aa=function(){ee(this);return this.o.concat()};k.$a=function(a){return fe(this.U,a)};
k.vb=function(a,b){if(this===a)return!0;if(this.i!=a.yb())return!1;var c=b||ge;ee(this);for(var d,e=0;d=this.o[e];e++)if(!c(this.get(d),a.get(d)))return!1;return!0};var ge=function(a,b){return a===b};de.prototype.remove=function(a){return fe(this.U,a)?(delete this.U[a],this.i--,this.ga++,this.o.length>2*this.i&&ee(this),!0):!1};
var ee=function(a){if(a.i!=a.o.length){for(var b=0,c=0;b<a.o.length;){var d=a.o[b];fe(a.U,d)&&(a.o[c++]=d);b++}a.o.length=c}if(a.i!=a.o.length){for(var e={},c=b=0;b<a.o.length;)d=a.o[b],fe(e,d)||(a.o[c++]=d,e[d]=1),b++;a.o.length=c}};k=de.prototype;k.get=function(a,b){return fe(this.U,a)?this.U[a]:b};k.set=function(a,b){fe(this.U,a)||(this.i++,this.o.push(a),this.ga++);this.U[a]=b};
k.addAll=function(a){var b;a instanceof de?(b=a.aa(),a=a.N()):(b=Sa(a),a=Ra(a));for(var c=0;c<b.length;c++)this.set(b[c],a[c])};k.forEach=function(a,b){for(var c=this.aa(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};k.clone=function(){return new de(this)};k.Xa=function(a){ee(this);var b=0,c=this.ga,d=this,e=new ae;e.next=function(){if(c!=d.ga)throw Error("The map has changed since the iterator was created");if(b>=d.o.length)throw $d;var e=d.o[b++];return a?e:d.U[e]};return e};
var fe=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)};var he=function(a){if(a.N&&"function"==typeof a.N)return a.N();if(m(a))return a.split("");if(fa(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Ra(a)},ie=function(a){if(a.aa&&"function"==typeof a.aa)return a.aa();if(!a.N||"function"!=typeof a.N){if(fa(a)||m(a)){var b=[];a=a.length;for(var c=0;c<a;c++)b.push(c);return b}return Sa(a)}},je=function(a,b){if(a.forEach&&"function"==typeof a.forEach)a.forEach(b,void 0);else if(fa(a)||m(a))w(a,b,void 0);else for(var c=ie(a),d=he(a),e=
d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)};var ke=function(a,b,c,d,e){this.reset(a,b,c,d,e)};ke.prototype.Mc=null;var le=0;ke.prototype.reset=function(a,b,c,d,e){"number"==typeof e||le++;d||la();this.ib=a;this.ge=b;delete this.Mc};ke.prototype.nd=function(a){this.ib=a};var me=function(a){this.he=a;this.Rc=this.ac=this.ib=this.m=null},ne=function(a,b){this.name=a;this.value=b};ne.prototype.toString=function(){return this.name};var oe=new ne("SEVERE",1E3),pe=new ne("CONFIG",700),qe=new ne("FINE",500);me.prototype.getParent=function(){return this.m};me.prototype.nd=function(a){this.ib=a};var re=function(a){if(a.ib)return a.ib;if(a.m)return re(a.m);ya("Root logger has no level set.");return null};
me.prototype.log=function(a,b,c){if(a.value>=re(this).value)for(n(b)&&(b=b()),a=new ke(a,String(b),this.he),c&&(a.Mc=c),c="log:"+a.ge,l.console&&(l.console.timeStamp?l.console.timeStamp(c):l.console.markTimeline&&l.console.markTimeline(c)),l.msWriteProfilerMark&&l.msWriteProfilerMark(c),c=this;c;){b=c;var d=a;if(b.Rc)for(var e=0,f;f=b.Rc[e];e++)f(d);c=c.getParent()}};
var se={},te=null,ue=function(a){te||(te=new me(""),se[""]=te,te.nd(pe));var b;if(!(b=se[a])){b=new me(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=ue(a.substr(0,c));c.ac||(c.ac={});c.ac[d]=b;b.m=c;se[a]=b}return b};var K=function(a,b){a&&a.log(qe,b,void 0)};var ve=function(a,b,c){if(n(a))c&&(a=p(a,c));else if(a&&"function"==typeof a.handleEvent)a=p(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(b)?-1:l.setTimeout(a,b||0)},we=function(a){var b=null;return(new G(function(c,d){b=ve(function(){c(void 0)},a);-1==b&&d(Error("Failed to schedule timer."))})).M(function(a){l.clearTimeout(b);throw a;})};var xe=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/,ye=function(a,b){if(a)for(var c=a.split("&"),d=0;d<c.length;d++){var e=c[d].indexOf("="),f,g=null;0<=e?(f=c[d].substring(0,e),g=c[d].substring(e+1)):f=c[d];b(f,g?decodeURIComponent(g.replace(/\+/g," ")):"")}};var L=function(a){J.call(this);this.headers=new de;this.Xb=a||null;this.ia=!1;this.Wb=this.a=null;this.hb=this.Yc=this.Fb="";this.va=this.lc=this.Eb=this.dc=!1;this.Ua=0;this.Sb=null;this.hd="";this.Ub=this.ne=this.ud=!1};q(L,J);var ze=L.prototype,Ae=ue("goog.net.XhrIo");ze.I=Ae;var Be=/^https?$/i,Ce=["POST","PUT"];
L.prototype.send=function(a,b,c,d){if(this.a)throw Error("[goog.net.XhrIo] Object is active with another request="+this.Fb+"; newUri="+a);b=b?b.toUpperCase():"GET";this.Fb=a;this.hb="";this.Yc=b;this.dc=!1;this.ia=!0;this.a=this.Xb?this.Xb.bc():vc.bc();this.Wb=this.Xb?uc(this.Xb):uc(vc);this.a.onreadystatechange=p(this.dd,this);this.ne&&"onprogress"in this.a&&(this.a.onprogress=p(function(a){this.cd(a,!0)},this),this.a.upload&&(this.a.upload.onprogress=p(this.cd,this)));try{K(this.I,De(this,"Opening Xhr")),
this.lc=!0,this.a.open(b,String(a),!0),this.lc=!1}catch(f){K(this.I,De(this,"Error opening Xhr: "+f.message));this.D(5,f);return}a=c||"";var e=this.headers.clone();d&&je(d,function(a,b){e.set(b,a)});d=Ha(e.aa());c=l.FormData&&a instanceof l.FormData;!Ia(Ce,b)||d||c||e.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");e.forEach(function(a,b){this.a.setRequestHeader(b,a)},this);this.hd&&(this.a.responseType=this.hd);"withCredentials"in this.a&&this.a.withCredentials!==this.ud&&(this.a.withCredentials=
this.ud);try{Ee(this),0<this.Ua&&(this.Ub=Fe(this.a),K(this.I,De(this,"Will abort after "+this.Ua+"ms if incomplete, xhr2 "+this.Ub)),this.Ub?(this.a.timeout=this.Ua,this.a.ontimeout=p(this.qb,this)):this.Sb=ve(this.qb,this.Ua,this)),K(this.I,De(this,"Sending request")),this.Eb=!0,this.a.send(a),this.Eb=!1}catch(f){K(this.I,De(this,"Send error: "+f.message)),this.D(5,f)}};var Fe=function(a){return y&&z(9)&&ga(a.timeout)&&void 0!==a.ontimeout},Ga=function(a){return"content-type"==a.toLowerCase()};
L.prototype.qb=function(){"undefined"!=typeof aa&&this.a&&(this.hb="Timed out after "+this.Ua+"ms, aborting",K(this.I,De(this,this.hb)),this.dispatchEvent("timeout"),this.abort(8))};L.prototype.D=function(a,b){this.ia=!1;this.a&&(this.va=!0,this.a.abort(),this.va=!1);this.hb=b;Ge(this);He(this)};var Ge=function(a){a.dc||(a.dc=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))};
L.prototype.abort=function(){this.a&&this.ia&&(K(this.I,De(this,"Aborting")),this.ia=!1,this.va=!0,this.a.abort(),this.va=!1,this.dispatchEvent("complete"),this.dispatchEvent("abort"),He(this))};L.prototype.Ha=function(){this.a&&(this.ia&&(this.ia=!1,this.va=!0,this.a.abort(),this.va=!1),He(this,!0));L.Bc.Ha.call(this)};L.prototype.dd=function(){this.isDisposed()||(this.lc||this.Eb||this.va?Ie(this):this.le())};L.prototype.le=function(){Ie(this)};
var Ie=function(a){if(a.ia&&"undefined"!=typeof aa)if(a.Wb[1]&&4==Je(a)&&2==Ke(a))K(a.I,De(a,"Local request error detected and ignored"));else if(a.Eb&&4==Je(a))ve(a.dd,0,a);else if(a.dispatchEvent("readystatechange"),4==Je(a)){K(a.I,De(a,"Request complete"));a.ia=!1;try{var b=Ke(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}var d;if(!(d=c)){var e;if(e=0===b){var f=String(a.Fb).match(xe)[1]||null;if(!f&&l.self&&l.self.location)var g=l.self.location.protocol,
f=g.substr(0,g.length-1);e=!Be.test(f?f.toLowerCase():"")}d=e}if(d)a.dispatchEvent("complete"),a.dispatchEvent("success");else{var h;try{h=2<Je(a)?a.a.statusText:""}catch(r){K(a.I,"Can not get status: "+r.message),h=""}a.hb=h+" ["+Ke(a)+"]";Ge(a)}}finally{He(a)}}};L.prototype.cd=function(a,b){v("progress"===a.type,"goog.net.EventType.PROGRESS is of the same type as raw XHR progress.");this.dispatchEvent(Le(a,"progress"));this.dispatchEvent(Le(a,b?"downloadprogress":"uploadprogress"))};
var Le=function(a,b){return{type:b,lengthComputable:a.lengthComputable,loaded:a.loaded,total:a.total}},He=function(a,b){if(a.a){Ee(a);var c=a.a,d=a.Wb[0]?ba:null;a.a=null;a.Wb=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=d}catch(e){(c=a.I)&&c.log(oe,"Problem encountered resetting onreadystatechange: "+e.message,void 0)}}},Ee=function(a){a.a&&a.Ub&&(a.a.ontimeout=null);ga(a.Sb)&&(l.clearTimeout(a.Sb),a.Sb=null)},Je=function(a){return a.a?a.a.readyState:0},Ke=function(a){try{return 2<Je(a)?
a.a.status:-1}catch(b){return-1}},Me=function(a){try{return a.a?a.a.responseText:""}catch(b){return K(a.I,"Can not get responseText: "+b.message),""}},De=function(a,b){return b+" ["+a.Yc+" "+a.Fb+" "+Ke(a)+"]"};var Ne=function(a,b){this.ja=this.Da=this.oa="";this.Oa=null;this.ua=this.la="";this.F=this.de=!1;var c;if(a instanceof Ne)this.F=void 0!==b?b:a.F,Oe(this,a.oa),c=a.Da,M(this),this.Da=c,Pe(this,a.ja),Qe(this,a.Oa),Re(this,a.la),Se(this,a.W.clone()),c=a.ua,M(this),this.ua=c;else if(a&&(c=String(a).match(xe))){this.F=!!b;Oe(this,c[1]||"",!0);var d=c[2]||"";M(this);this.Da=Te(d);Pe(this,c[3]||"",!0);Qe(this,c[4]);Re(this,c[5]||"",!0);Se(this,c[6]||"",!0);c=c[7]||"";M(this);this.ua=Te(c)}else this.F=
!!b,this.W=new N(null,0,this.F)};Ne.prototype.toString=function(){var a=[],b=this.oa;b&&a.push(Ue(b,Ve,!0),":");var c=this.ja;if(c||"file"==b)a.push("//"),(b=this.Da)&&a.push(Ue(b,Ve,!0),"@"),a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),c=this.Oa,null!=c&&a.push(":",String(c));if(c=this.la)this.ja&&"/"!=c.charAt(0)&&a.push("/"),a.push(Ue(c,"/"==c.charAt(0)?We:Xe,!0));(c=this.W.toString())&&a.push("?",c);(c=this.ua)&&a.push("#",Ue(c,Ye));return a.join("")};
Ne.prototype.resolve=function(a){var b=this.clone(),c=!!a.oa;c?Oe(b,a.oa):c=!!a.Da;if(c){var d=a.Da;M(b);b.Da=d}else c=!!a.ja;c?Pe(b,a.ja):c=null!=a.Oa;d=a.la;if(c)Qe(b,a.Oa);else if(c=!!a.la){if("/"!=d.charAt(0))if(this.ja&&!this.la)d="/"+d;else{var e=b.la.lastIndexOf("/");-1!=e&&(d=b.la.substr(0,e+1)+d)}e=d;if(".."==e||"."==e)d="";else if(u(e,"./")||u(e,"/.")){for(var d=0==e.lastIndexOf("/",0),e=e.split("/"),f=[],g=0;g<e.length;){var h=e[g++];"."==h?d&&g==e.length&&f.push(""):".."==h?((1<f.length||
1==f.length&&""!=f[0])&&f.pop(),d&&g==e.length&&f.push("")):(f.push(h),d=!0)}d=f.join("/")}else d=e}c?Re(b,d):c=""!==a.W.toString();c?Se(b,Te(a.W.toString())):c=!!a.ua;c&&(a=a.ua,M(b),b.ua=a);return b};Ne.prototype.clone=function(){return new Ne(this)};
var Oe=function(a,b,c){M(a);a.oa=c?Te(b,!0):b;a.oa&&(a.oa=a.oa.replace(/:$/,""))},Pe=function(a,b,c){M(a);a.ja=c?Te(b,!0):b},Qe=function(a,b){M(a);if(b){b=Number(b);if(isNaN(b)||0>b)throw Error("Bad port number "+b);a.Oa=b}else a.Oa=null},Re=function(a,b,c){M(a);a.la=c?Te(b,!0):b},Se=function(a,b,c){M(a);b instanceof N?(a.W=b,a.W.yc(a.F)):(c||(b=Ue(b,Ze)),a.W=new N(b,0,a.F))},O=function(a,b,c){M(a);a.W.set(b,c)},M=function(a){if(a.de)throw Error("Tried to modify a read-only Uri");};
Ne.prototype.yc=function(a){this.F=a;this.W&&this.W.yc(a);return this};
var $e=function(a,b){var c=new Ne(null,void 0);Oe(c,"https");a&&Pe(c,a);b&&Re(c,b);return c},Te=function(a,b){return a?b?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""},Ue=function(a,b,c){return m(a)?(a=encodeURI(a).replace(b,af),c&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null},af=function(a){a=a.charCodeAt(0);return"%"+(a>>4&15).toString(16)+(a&15).toString(16)},Ve=/[#\/\?@]/g,Xe=/[\#\?:]/g,We=/[\#\?]/g,Ze=/[\#\?@]/g,Ye=/#/g,N=function(a,b,c){this.i=this.j=null;this.C=a||null;
this.F=!!c},bf=function(a){a.j||(a.j=new de,a.i=0,a.C&&ye(a.C,function(b,c){a.add(decodeURIComponent(b.replace(/\+/g," ")),c)}))},df=function(a){var b=ie(a);if("undefined"==typeof b)throw Error("Keys are undefined");var c=new N(null,0,void 0);a=he(a);for(var d=0;d<b.length;d++){var e=b[d],f=a[d];ea(f)?cf(c,e,f):c.add(e,f)}return c};k=N.prototype;k.yb=function(){bf(this);return this.i};
k.add=function(a,b){bf(this);this.C=null;a=this.l(a);var c=this.j.get(a);c||this.j.set(a,c=[]);c.push(b);this.i=za(this.i)+1;return this};k.remove=function(a){bf(this);a=this.l(a);return this.j.$a(a)?(this.C=null,this.i=za(this.i)-this.j.get(a).length,this.j.remove(a)):!1};k.$a=function(a){bf(this);a=this.l(a);return this.j.$a(a)};k.aa=function(){bf(this);for(var a=this.j.N(),b=this.j.aa(),c=[],d=0;d<b.length;d++)for(var e=a[d],f=0;f<e.length;f++)c.push(b[d]);return c};
k.N=function(a){bf(this);var b=[];if(m(a))this.$a(a)&&(b=Ma(b,this.j.get(this.l(a))));else{a=this.j.N();for(var c=0;c<a.length;c++)b=Ma(b,a[c])}return b};k.set=function(a,b){bf(this);this.C=null;a=this.l(a);this.$a(a)&&(this.i=za(this.i)-this.j.get(a).length);this.j.set(a,[b]);this.i=za(this.i)+1;return this};k.get=function(a,b){var c=a?this.N(a):[];return 0<c.length?String(c[0]):b};var cf=function(a,b,c){a.remove(b);0<c.length&&(a.C=null,a.j.set(a.l(b),Oa(c)),a.i=za(a.i)+c.length)};
N.prototype.toString=function(){if(this.C)return this.C;if(!this.j)return"";for(var a=[],b=this.j.aa(),c=0;c<b.length;c++)for(var d=b[c],e=encodeURIComponent(String(d)),d=this.N(d),f=0;f<d.length;f++){var g=e;""!==d[f]&&(g+="="+encodeURIComponent(String(d[f])));a.push(g)}return this.C=a.join("&")};N.prototype.clone=function(){var a=new N;a.C=this.C;this.j&&(a.j=this.j.clone(),a.i=this.i);return a};N.prototype.l=function(a){a=String(a);this.F&&(a=a.toLowerCase());return a};
N.prototype.yc=function(a){a&&!this.F&&(bf(this),this.C=null,this.j.forEach(function(a,c){var d=c.toLowerCase();c!=d&&(this.remove(c),cf(this,d,a))},this));this.F=a};var ef=function(a,b){var c=[],d;for(d in a)d in b?typeof a[d]!=typeof b[d]?c.push(d):ea(a[d])?Ua(a[d],b[d])||c.push(d):"object"==typeof a[d]&&null!=a[d]&&null!=b[d]?0<ef(a[d],b[d]).length&&c.push(d):a[d]!==b[d]&&c.push(d):c.push(d);for(d in b)d in a||c.push(d);return c},ff=function(a,b,c){var d=Math.floor(1E9*Math.random()).toString();b=b||500;c=c||600;var e=(window.screen.availHeight-c)/2,f=(window.screen.availWidth-b)/2;b={width:b,height:c,top:0<e?e:0,left:0<f?f:0,location:!0,resizable:!0,statusbar:!0,
toolbar:!1};d&&(b.target=d);navigator.userAgent&&-1!=navigator.userAgent.indexOf("Firefox/")&&(a=a||"http://localhost");var g;c=a||"about:blank";(d=b)||(d={});a=window;b=c instanceof A?c:Cb("undefined"!=typeof c.href?c.href:String(c));c=d.target||c.target;e=[];for(g in d)switch(g){case "width":case "height":case "top":case "left":e.push(g+"="+d[g]);break;case "target":case "noreferrer":break;default:e.push(g+"="+(d[g]?1:0))}g=e.join(",");(x("iPhone")&&!x("iPod")&&!x("iPad")||x("iPad")||x("iPod"))&&
a.navigator&&a.navigator.standalone&&c&&"_self"!=c?(g=a.document.createElement("A"),b=b instanceof A?b:Cb(b),g.href=zb(b),g.setAttribute("target",c),d.noreferrer&&g.setAttribute("rel","noreferrer"),d=document.createEvent("MouseEvent"),d.initMouseEvent("click",!0,!0,a,1),g.dispatchEvent(d),g={}):d.noreferrer?(g=a.open("",c,g),d=zb(b),g&&(eb&&u(d,";")&&(d="'"+d.replace(/'/g,"%27")+"'"),g.opener=null,a=new wb,a.Rb="b/12014412, meta tag with sanitized URL",ua.test(d)&&(-1!=d.indexOf("&")&&(d=d.replace(oa,
"&amp;")),-1!=d.indexOf("<")&&(d=d.replace(pa,"&lt;")),-1!=d.indexOf(">")&&(d=d.replace(qa,"&gt;")),-1!=d.indexOf('"')&&(d=d.replace(ra,"&quot;")),-1!=d.indexOf("'")&&(d=d.replace(sa,"&#39;")),-1!=d.indexOf("\x00")&&(d=d.replace(ta,"&#0;"))),d='<META HTTP-EQUIV="refresh" content="0; url='+d+'">',Aa(xb(a),"must provide justification"),v(!/^[\s\xa0]*$/.test(xb(a)),"must provide non-empty justification"),g.document.write(Fb((new Eb).ce(d))),g.document.close())):g=a.open(zb(b),c,g);if(g)try{g.focus()}catch(h){}return g},
gf=function(a){return new G(function(b){var c=function(){we(2E3).then(function(){if(!a||a.closed)b();else return c()})};return c()})},hf=function(){var a=null;return(new G(function(b){"complete"==l.document.readyState?b():(a=function(){b()},ec(window,"load",a))})).M(function(b){gc(window,"load",a);throw b;})},jf=function(){var a=navigator.userAgent,b=a.toLowerCase();if(u(b,"opera/")||u(b,"opr/")||u(b,"opios/"))return"Opera";if(u(b,"msie")||u(b,"trident/"))return"IE";if(u(b,"edge/"))return"Edge";if(u(b,
"firefox/"))return"Firefox";if(u(b,"silk/"))return"Silk";if(u(b,"safari/")&&!u(b,"chrome/"))return"Safari";if(!u(b,"chrome/")&&!u(b,"crios/")||u(b,"edge/")){if((a=a.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/))&&2==a.length)return a[1]}else return"Chrome";return"Other"},kf=function(a){return jf()+"/JsCore/"+a},lf=function(a){a=a.split(".");for(var b=l,c=0;c<a.length&&"object"==typeof b&&null!=b;c++)b=b[a[c]];c!=a.length&&(b=void 0);return b},mf=function(){return!(!l.location||!l.location.protocol||"http:"!=
l.location.protocol&&"https:"!=l.location.protocol)},nf=function(){var a=navigator.userAgent,b=a.match(/(ipad)|(iphone)|(ipod)/i),a=a.match(/\sOS\s(\d+)_/i);return b&&b.length&&a&&2==a.length&&8>parseInt(a[1],10)?!1:!0};var of;try{var pf={};Object.defineProperty(pf,"abcd",{configurable:!0,enumerable:!0,value:1});Object.defineProperty(pf,"abcd",{configurable:!0,enumerable:!0,value:2});of=2==pf.abcd}catch(a){of=!1}
var P=function(a,b,c){of?Object.defineProperty(a,b,{configurable:!0,enumerable:!0,value:c}):a[b]=c},qf=function(a,b){if(b)for(var c in b)b.hasOwnProperty(c)&&P(a,c,b[c])},rf=function(a){var b={},c;for(c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b},sf=function(a,b){if(!b||!b.length)return!0;if(!a)return!1;for(var c=0;c<b.length;c++){var d=a[b[c]];if(void 0===d||null===d||""===d)return!1}return!0};var tf={vd:{mb:985,lb:735,providerId:"facebook.com"},wd:{mb:1040,lb:620,providerId:"github.com"},xd:{mb:485,lb:640,providerId:"google.com"},Bd:{mb:485,lb:705,providerId:"twitter.com"}},uf=function(a){for(var b in tf)if(tf[b].providerId==a)return tf[b];return null};var Q=function(a,b){this.code="auth/"+a;this.message=b||vf[a]||""};q(Q,Error);Q.prototype.P=function(){return{name:this.code,code:this.code,message:this.message}};
var vf={"argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
"email-already-in-use":"The email address is already in use by another account.","expired-action-code":"The action code has expired. ","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal error has occurred.","invalid-user-token":"The user's credential is no longer valid. The user must sign in again.","invalid-auth-event":"An internal error has occurred.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.",
"invalid-email":"The email address is badly formatted.","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-credential":"The supplied auth credential is malformed or has expired.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
"invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","missing-iframe-start":"An internal error has occurred.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","app-deleted":"This instance of FirebaseApp has been deleted.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
"network-request-failed":"A network error (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal error has occurred.","no-such-provider":"User was not linked to an account with the given provider.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http or https.',
"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.",
"user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported."};var wf=function(a,b,c,d,e){this.qa=a;this.ta=b||null;this.Wa=c||null;this.xc=d||null;this.D=e||null;if(this.Wa||this.D){if(this.Wa&&this.D)throw new Q("invalid-auth-event");if(this.Wa&&!this.xc)throw new Q("invalid-auth-event");}else throw new Q("invalid-auth-event");};wf.prototype.hc=function(){return this.xc};wf.prototype.getError=function(){return this.D};wf.prototype.P=function(){return{type:this.qa,eventId:this.ta,urlResponse:this.Wa,sessionId:this.xc,error:this.D&&this.D.P()}};var xf=function(a){this.fe=a.sub;la();this.ub=a.email||null};var yf=function(a,b,c,d){var e={};ha(c)?e=c:b&&m(c)&&m(d)?e={oauthToken:c,oauthTokenSecret:d}:!b&&m(c)&&(e={accessToken:c});if(b||!e.idToken&&!e.accessToken)if(b&&e.oauthToken&&e.oauthTokenSecret)P(this,"accessToken",e.oauthToken),P(this,"secret",e.oauthTokenSecret);else{if(b)throw new Q("argument-error","credential failed: expected 2 arguments (the OAuth access token and secret).");throw new Q("argument-error","credential failed: expected 1 argument (the OAuth access token).");}else e.idToken&&P(this,
"idToken",e.idToken),e.accessToken&&P(this,"accessToken",e.accessToken);P(this,"provider",a)};yf.prototype.zb=function(a){return zf(a,Af(this))};yf.prototype.Zc=function(a,b){var c=Af(this);c.idToken=b;return R(a,Bf,c)};var Af=function(a){var b={};a.idToken&&(b.id_token=a.idToken);a.accessToken&&(b.access_token=a.accessToken);a.secret&&(b.oauth_token_secret=a.secret);b.providerId=a.provider;return{postBody:df(b).toString(),requestUri:window.location.href}};
yf.prototype.P=function(){var a={provider:this.provider};this.idToken&&(a.oauthIdToken=this.idToken);this.accessToken&&(a.oauthAccessToken=this.accessToken);this.secret&&(a.oauthTokenSecret=this.secret);return a};
var Cf=function(a,b){var c=!!b,d=function(){qf(this,{providerId:a,isOAuthProvider:!0});this.wc=[]};c||(d.prototype.addScope=function(a){Ia(this.wc,a)||this.wc.push(a)});d.prototype.Ab=function(){return Oa(this.wc)};d.credential=function(b,d){return new yf(a,c,b,d)};qf(d,{PROVIDER_ID:a});return d},Df=Cf("facebook.com");Df.prototype.addScope=Df.prototype.addScope||void 0;var Ef=Cf("github.com");Ef.prototype.addScope=Ef.prototype.addScope||void 0;var Ff=Cf("google.com");
Ff.prototype.addScope=Ff.prototype.addScope||void 0;Ff.credential=function(a,b){if(!a&&!b)throw new Q("argument-error","credential failed: must provide the ID token and/or the access token.");return new yf("google.com",!1,ha(a)?a:{idToken:a||null,accessToken:b||null})};var Gf=Cf("twitter.com",!0),Hf=function(a,b){this.ub=a;this.pc=b;P(this,"provider","password")};Hf.prototype.zb=function(a){return R(a,If,{email:this.ub,password:this.pc})};
Hf.prototype.Zc=function(a,b){return R(a,Jf,{idToken:b,email:this.ub,password:this.pc})};Hf.prototype.P=function(){return{email:this.ub,password:this.pc}};var Kf=function(){qf(this,{providerId:"password",isOAuthProvider:!1})};qf(Kf,{PROVIDER_ID:"password"});
var Lf={Be:Kf,vd:Df,xd:Ff,wd:Ef,Bd:Gf},Mf=function(a){var b=a&&a.providerId;if(!b)return null;var c=a&&a.oauthAccessToken,d=a&&a.oauthTokenSecret;a=a&&a.oauthIdToken;for(var e in Lf)if(Lf[e].PROVIDER_ID==b)try{return Lf[e].credential({accessToken:c,idToken:a,oauthToken:c,oauthTokenSecret:d})}catch(f){break}return null};var Nf=function(a,b,c){Q.call(this,"account-exists-with-different-credential",c);P(this,"email",a);P(this,"credential",b)};q(Nf,Q);Nf.prototype.P=function(){var a={code:this.code,message:this.message,email:this.email},b=this.credential&&this.credential.P();b&&(Xa(a,b),a.providerId=b.provider,delete a.provider);return a};var S=function(a,b,c){this.u=a;a=b||{};this.qe=a.secureTokenEndpoint||"https://securetoken.googleapis.com/v1/token";this.se=a.secureTokenTimeout||1E4;this.re=Va(a.secureTokenHeaders||Of);this.Nd=a.firebaseEndpoint||"https://www.googleapis.com/identitytoolkit/v3/relyingparty/";this.Od=a.firebaseTimeout||1E4;this.Oc=Va(a.firebaseHeaders||Pf);c&&(this.Oc["X-Client-Version"]=c);this.Fd=new yc},Qf,Of={"Content-Type":"application/x-www-form-urlencoded"},Pf={"Content-Type":"application/json"},Sf=function(a,
b,c,d,e,f,g){!y||!pb||9<pb?a=p(a.ue,a):(Qf||(Qf=new G(function(a,b){Rf(a,b)})),a=p(a.te,a));a(b,c,d,e,f,g)};
S.prototype.ue=function(a,b,c,d,e,f){var g=new L(this.Fd),h;f&&(g.Ua=Math.max(0,f),h=setTimeout(function(){g.dispatchEvent("timeout")},f));Zb(g,"complete",function(){h&&clearTimeout(h);var a=null;try{var c;c=this.a?mc(this.a.responseText):void 0;a=c||null}catch(d){try{a=JSON.parse(Me(this))||null}catch(e){a=null}}b&&b(a)});fc(g,"ready",function(){h&&clearTimeout(h);this.sa||(this.sa=!0,this.Ha())});fc(g,"timeout",function(){h&&clearTimeout(h);this.sa||(this.sa=!0,this.Ha());b&&b(null)});g.send(a,
c,d,e)};var Tf="__fcb"+Math.floor(1E6*Math.random()).toString(),Rf=function(a,b){((window.gapi||{}).client||{}).request?a():(l[Tf]=function(){((window.gapi||{}).client||{}).request?a():b(Error("CORS_UNSUPPORTED"))},Pd(Xd("https://apis.google.com/js/client.js?onload="+Tf),function(){b(Error("CORS_UNSUPPORTED"))}))};
S.prototype.te=function(a,b,c,d,e){var f=this;Qf.then(function(){window.gapi.client.setApiKey(f.u);var g=window.gapi.auth.getToken();window.gapi.auth.setToken(null);window.gapi.client.request({path:a,method:c,body:d,headers:e,authType:"none",callback:function(a){window.gapi.auth.setToken(g);b&&b(a)}})}).M(function(a){b&&b({error:{message:a&&a.message||"CORS_UNSUPPORTED"}})})};
var Vf=function(a,b){return new G(function(c,d){"refresh_token"==b.grant_type&&b.refresh_token||"authorization_code"==b.grant_type&&b.code?Sf(a,a.qe+"?key="+encodeURIComponent(a.u),function(a){a?a.error?d(Uf(a)):a.access_token&&a.refresh_token?c(a):d(new Q("internal-error")):d(new Q("network-request-failed"))},"POST",df(b).toString(),a.re,a.se):d(new Q("internal-error"))})},Wf=function(a){var b={},c;for(c in a)null!==a[c]&&void 0!==a[c]&&(b[c]=a[c]);return pc(b)},Xf=function(a,b,c,d,e){var f=a.Nd+
b+"?key="+encodeURIComponent(a.u);e&&(f+="&cb="+la().toString());return new G(function(b,e){Sf(a,f,function(a){a?a.error?e(Uf(a)):b(a):e(new Q("network-request-failed"))},c,Wf(d),a.Oc,a.Od)})},Yf=function(a){if(!lc.test(a.email))throw new Q("invalid-email");},Zf=function(a){"email"in a&&Yf(a)},ag=function(a,b){return R(a,$f,{identifier:b,continueUri:mf()?window.location.href:"http://localhost"}).then(function(a){return a.allProviders||[]})},cg=function(a){return R(a,bg,{}).then(function(a){return a.authorizedDomains||
[]})},dg=function(a){if(!a.idToken)throw new Q("internal-error");};S.prototype.signInAnonymously=function(){return R(this,eg,{})};S.prototype.updateEmail=function(a,b){return R(this,fg,{idToken:a,email:b})};S.prototype.updatePassword=function(a,b){return R(this,Jf,{idToken:a,password:b})};var gg={displayName:"DISPLAY_NAME",photoUrl:"PHOTO_URL"};
S.prototype.updateProfile=function(a,b){var c={idToken:a},d=[];Qa(gg,function(a,f){var g=b[f];null===g?d.push(a):f in b&&(c[f]=g)});d.length&&(c.deleteAttribute=d);return R(this,fg,c)};S.prototype.sendPasswordResetEmail=function(a){return R(this,hg,{requestType:"PASSWORD_RESET",email:a})};S.prototype.sendEmailVerification=function(a){return R(this,ig,{requestType:"VERIFY_EMAIL",idToken:a})};
var kg=function(a,b,c){return R(a,jg,{idToken:b,deleteProvider:c})},lg=function(a){if(!a.requestUri||!a.sessionId&&!a.postBody)throw new Q("internal-error");},mg=function(a){if(a.needConfirmation)throw(a&&a.email?new Nf(a.email,Mf(a),a.message):null)||new Q("account-exists-with-different-credential");if(!a.idToken)throw new Q("internal-error");},zf=function(a,b){return R(a,ng,b)},og=function(a){if(!a.oobCode)throw new Q("invalid-action-code");};
S.prototype.confirmPasswordReset=function(a,b){return R(this,pg,{oobCode:a,newPassword:b})};S.prototype.checkActionCode=function(a){return R(this,qg,{oobCode:a})};S.prototype.applyActionCode=function(a){return R(this,rg,{oobCode:a})};
var rg={endpoint:"setAccountInfo",w:og,Ta:"email"},qg={endpoint:"resetPassword",w:og,ma:function(a){if(!lc.test(a.email))throw new Q("internal-error");}},sg={endpoint:"signupNewUser",w:function(a){Yf(a);if(!a.password)throw new Q("weak-password");},ma:dg,na:!0},$f={endpoint:"createAuthUri"},tg={endpoint:"deleteAccount",Sa:["idToken"]},jg={endpoint:"setAccountInfo",Sa:["idToken","deleteProvider"],w:function(a){if(!ea(a.deleteProvider))throw new Q("internal-error");}},ug={endpoint:"getAccountInfo"},
ig={endpoint:"getOobConfirmationCode",Sa:["idToken","requestType"],w:function(a){if("VERIFY_EMAIL"!=a.requestType)throw new Q("internal-error");},Ta:"email"},hg={endpoint:"getOobConfirmationCode",Sa:["requestType"],w:function(a){if("PASSWORD_RESET"!=a.requestType)throw new Q("internal-error");Yf(a)},Ta:"email"},bg={Ed:!0,endpoint:"getProjectConfig",Wd:"GET"},pg={endpoint:"resetPassword",w:og,Ta:"email"},fg={endpoint:"setAccountInfo",Sa:["idToken"],w:Zf,na:!0},Jf={endpoint:"setAccountInfo",Sa:["idToken"],
w:function(a){Zf(a);if(!a.password)throw new Q("weak-password");},ma:dg,na:!0},eg={endpoint:"signupNewUser",ma:dg,na:!0},ng={endpoint:"verifyAssertion",w:lg,ma:mg,na:!0},Bf={endpoint:"verifyAssertion",w:function(a){lg(a);if(!a.idToken)throw new Q("internal-error");},ma:mg,na:!0},vg={endpoint:"verifyCustomToken",w:function(a){if(!a.token)throw new Q("invalid-custom-token");},ma:dg,na:!0},If={endpoint:"verifyPassword",w:function(a){Yf(a);if(!a.password)throw new Q("wrong-password");},ma:dg,na:!0},R=
function(a,b,c){if(!sf(c,b.Sa))return I(new Q("internal-error"));var d=b.Wd||"POST",e;return H(c).then(b.w).then(function(){b.na&&(c.returnSecureToken=!0);return Xf(a,b.endpoint,d,c,b.Ed||!1)}).then(function(a){return e=a}).then(b.ma).then(function(){if(!b.Ta)return e;if(!(b.Ta in e))throw new Q("internal-error");return e[b.Ta]})},Uf=function(a){var b;b=(a.error&&a.error.errors&&a.error.errors[0]||{}).reason||"";var c={keyInvalid:"invalid-api-key",ipRefererBlocked:"app-not-authorized"};if(b=c[b]?
new Q(c[b]):null)return b;a=a.error&&a.error.message||"";b={INVALID_CUSTOM_TOKEN:"invalid-custom-token",CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_EMAIL:"invalid-email",INVALID_PASSWORD:"wrong-password",USER_DISABLED:"user-disabled",MISSING_PASSWORD:"internal-error",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",
FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",EMAIL_NOT_FOUND:"user-not-found",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",CORS_UNSUPPORTED:"cors-unsupported"};if(b[a])return new Q(b[a]);b={TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",WEAK_PASSWORD:"weak-password",
OPERATION_NOT_ALLOWED:"operation-not-allowed"};for(var d in b)if(0===a.indexOf(d))return new Q(b[d]);return new Q("internal-error")};var wg=function(a){this.J=a};wg.prototype.value=function(){return this.J};wg.prototype.od=function(a){this.J.style=a;return this};var xg=function(a){this.J=a||{}};xg.prototype.value=function(){return this.J};xg.prototype.od=function(a){this.J.style=a;return this};var zg=function(a){this.Ae=a;this.jc=null;this.ke=yg(this)},Ag,Bg=function(a){var b=new xg;b.J.where=document.body;b.J.url=a.Ae;b.J.messageHandlersFilter=lf("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER");b.J.attributes=b.J.attributes||{};(new wg(b.J.attributes)).od({position:"absolute",top:"-100px",width:"1px",height:"1px"});b.J.dontclear=!0;return b},yg=function(a){return Cg().then(function(){return new G(function(b){lf("gapi.iframes.getContext")().open(Bg(a).value(),function(c){a.jc=c;a.jc.restyle({setHideOnLeave:!1});
b()})})})},Dg=function(a,b){a.ke.then(function(){a.jc.register("authEvent",b,lf("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"))})},Eg="__iframefcb"+Math.floor(1E6*Math.random()).toString(),Cg=function(){return Ag?Ag:Ag=new G(function(a,b){var c=function(){lf("gapi.load")("gapi.iframes",function(){a()})};lf("gapi.iframes.Iframe")?a():lf("gapi.load")?c():(l[Eg]=function(){lf("gapi.load")?c():b()},Pd(Xd("https://apis.google.com/js/api.js?onload="+Eg),function(){b()}))})};var Gg=function(a,b,c,d){this.S=a;this.u=b;this.R=c;d=this.ra=d||null;a=$e(a,"/__/auth/iframe");O(a,"apiKey",b);O(a,"appName",c);d&&O(a,"v",d);this.Yd=a.toString();this.Zd=new zg(this.Yd);this.Yb=[];Fg(this)},Hg=function(a,b,c,d,e,f,g,h,r){a=$e(a,"/__/auth/handler");O(a,"apiKey",b);O(a,"appName",c);O(a,"authType",d);O(a,"providerId",e);f&&f.length&&O(a,"scopes",f.join(","));g&&O(a,"redirectUrl",g);h&&O(a,"eventId",h);r&&O(a,"v",r);return a.toString()},Fg=function(a){Dg(a.Zd,function(b){var c={};if(b&&
b.authEvent){var d=!1;b=b.authEvent||{};if(b.type){if(c=b.error)var e=(c=b.error)&&(c.name||c.code),c=e?new Q(e.substring(5),c.message):null;b=new wf(b.type,b.eventId,b.urlResponse,b.sessionId,c)}else b=null;for(c=0;c<a.Yb.length;c++)d=a.Yb[c](b)||d;c={};c.status=d?"ACK":"ERROR";return H(c)}c.status="ERROR";return H(c)})};Gg.prototype.Cc=function(a){this.Yb.push(a)};var Ig=function(a){this.Gb=a};Ig.prototype.set=function(a,b){void 0!==b?this.Gb.set(a,pc(b)):this.Gb.remove(a)};Ig.prototype.get=function(a){var b;try{b=this.Gb.get(a)}catch(c){return}if(null!==b)try{return mc(b)}catch(c){throw"Storage: Invalid value was encountered";}};Ig.prototype.remove=function(a){this.Gb.remove(a)};var Jg=function(){};var Kg=function(){};q(Kg,Jg);Kg.prototype.yb=function(){var a=0;ce(this.Xa(!0),function(b){Aa(b);a++});return a};var Lg=function(a){this.L=a};q(Lg,Kg);var Mg=function(a){if(!a.L)return!1;try{return a.L.setItem("__sak","1"),a.L.removeItem("__sak"),!0}catch(b){return!1}};k=Lg.prototype;k.set=function(a,b){try{this.L.setItem(a,b)}catch(c){if(0==this.L.length)throw"Storage mechanism: Storage disabled";throw"Storage mechanism: Quota exceeded";}};k.get=function(a){a=this.L.getItem(a);if(!m(a)&&null!==a)throw"Storage mechanism: Invalid value was encountered";return a};k.remove=function(a){this.L.removeItem(a)};
k.yb=function(){return this.L.length};k.Xa=function(a){var b=0,c=this.L,d=new ae;d.next=function(){if(b>=c.length)throw $d;var d=Aa(c.key(b++));if(a)return d;d=c.getItem(d);if(!m(d))throw"Storage mechanism: Invalid value was encountered";return d};return d};k.key=function(a){return this.L.key(a)};var Ng=function(){var a=null;try{a=window.localStorage||null}catch(b){}this.L=a};q(Ng,Lg);var Og=function(){var a=null;try{a=window.sessionStorage||null}catch(b){}this.L=a};q(Og,Lg);var Pg="First Second Third Fourth Fifth Sixth Seventh Eighth Ninth".split(" "),T=function(a,b){return{name:a||"",Y:"a valid string",optional:!!b,Z:m}},Qg=function(a){return{name:a||"",Y:"a valid object",optional:!1,Z:ha}},Rg=function(a,b){return{name:a||"",Y:"a function",optional:!!b,Z:n}},Sg=function(){return{name:"",Y:"null",optional:!1,Z:da}},Tg=function(){return{name:"credential",Y:"a valid credential",optional:!1,Z:function(a){return!(!a||!a.zb)}}},Ug=function(){return{name:"authProvider",Y:"a valid Auth provider",
optional:!1,Z:function(a){return!!(a&&a.providerId&&a.hasOwnProperty&&a.hasOwnProperty("isOAuthProvider"))}}},Vg=function(a,b,c,d){return{name:c||"",Y:a.Y+" or "+b.Y,optional:!!d,Z:function(c){return a.Z(c)||b.Z(c)}}};var Xg=function(a,b){for(var c in b){var d=b[c].name;a[d]=Wg(d,a[c],b[c].b)}},U=function(a,b,c,d){a[b]=Wg(b,c,d)},Wg=function(a,b,c){if(!c)return b;var d=Yg(a);a=function(){var a=Array.prototype.slice.call(arguments),e;a:{e=Array.prototype.slice.call(a);var h;h=0;for(var r=!1,Z=0;Z<c.length;Z++)if(c[Z].optional)r=!0;else{if(r)throw new Q("internal-error","Argument validator encountered a required argument after an optional argument.");h++}r=c.length;if(e.length<h||r<e.length)e="Expected "+(h==r?1==
h?"1 argument":h+" arguments":h+"-"+r+" arguments")+" but got "+e.length+".";else{for(h=0;h<e.length;h++)if(r=c[h].optional&&void 0===e[h],!c[h].Z(e[h])&&!r){e=c[h];if(0>h||h>=Pg.length)throw new Q("internal-error","Argument validator received an unsupported number of arguments.");e=Pg[h]+" argument "+(e.name?'"'+e.name+'" ':"")+"must be "+e.Y+".";break a}e=null}}if(e)throw new Q("argument-error",d+" failed: "+e);return b.apply(this,a)};for(var e in b)a[e]=b[e];for(e in b.prototype)a.prototype[e]=
b.prototype[e];return a},Yg=function(a){a=a.split(".");return a[a.length-1]};var ah=function(a,b,c){var d=(this.ra=firebase.SDK_VERSION||null)?kf(this.ra):null;this.c=new S(b,null,d);this.Na=null;this.S=a;this.u=b;this.R=c;this.pb=[];this.Vc=!1;this.Dd=p(this.Qd,this);this.nb=new Zg;this.fd=new $g;this.Va={};this.Va.unknown=this.nb;this.Va.signInViaRedirect=this.nb;this.Va.linkViaRedirect=this.nb;this.Va.signInViaPopup=this.fd;this.Va.linkViaPopup=this.fd},bh=function(a){var b=window.location.href;return cg(a).then(function(a){a:{for(var d=(b instanceof Ne?b.clone():new Ne(b,
void 0)).ja,e=0;e<a.length;e++){var f;var g=a[e];f=d;var h=Rc(g);h?f=(f=Rc(f))?h.vb(f):!1:(h=g.split(".").join("\\."),f=(new RegExp("^(.+."+h+"|"+h+")$","i")).test(f));if(f){a=!0;break a}}a=!1}if(!a)throw new Q("unauthorized-domain");})},ch=function(a){a.Vc=!0;hf().then(function(){a.Xd=new Gg(a.S,a.u,a.R,a.ra);a.Xd.Cc(a.Dd)})};ah.prototype.subscribe=function(a){Ia(this.pb,a)||this.pb.push(a);this.Vc||ch(this)};ah.prototype.unsubscribe=function(a){La(this.pb,function(b){return b==a})};
ah.prototype.Qd=function(a){if(!a)throw new Q("invalid-auth-event");for(var b=!1,c=0;c<this.pb.length;c++){var d=this.pb[c];if(d.Hc(a.qa,a.ta)){(b=this.Va[a.qa])&&b.gd(a,d);b=!0;break}}a=this.nb;a.tc||(a.tc=!0,dh(a,!1,null,null));return b};ah.prototype.getRedirectResult=function(){return this.nb.getRedirectResult()};
var fh=function(a,b,c,d,e){if(!b)return I(new Q("popup-blocked"));a.Na||(a.Na=bh(a.c));return a.Na.then(function(){eh(d);var f=Hg(a.S,a.u,a.R,c,d.providerId,d.Ab(),null,e,a.ra);Gb((b||window).location,f);return b})},gh=function(a,b,c,d){a.Na||(a.Na=bh(a.c));return a.Na.then(function(){eh(c);var e=Hg(a.S,a.u,a.R,b,c.providerId,c.Ab(),window.location.href,d,a.ra);Gb(window.location,e)})},hh=function(a,b,c,d){var e=new Q("popup-closed-by-user");return gf(c).then(function(){return we(3E4).then(function(){a.Ca(b,
null,e,d)})})},eh=function(a){if(!a.isOAuthProvider)throw new Q("invalid-oauth-provider");},ih={},jh=function(a,b,c){var d=b+":"+c;ih[d]||(ih[d]=new ah(a,b,c));return ih[d]},Zg=function(){this.uc=this.Mb=this.Qa=this.X=null;this.tc=!1};Zg.prototype.gd=function(a,b){if(!a)return I(new Q("invalid-auth-event"));this.tc=!0;var c=a.qa,d=a.ta;"unknown"==c?(this.X||dh(this,!1,null,null),c=H()):c=a.D?this.rc(a,b):b.ab(c,d)?this.sc(a,b):I(new Q("invalid-auth-event"));return c};
Zg.prototype.rc=function(a){this.X||dh(this,!0,null,a.getError());return H()};Zg.prototype.sc=function(a,b){var c=this,d=a.qa,e=b.ab(d,a.ta),f=a.Wa,g=a.hc(),h="signInViaRedirect"==d||"linkViaRedirect"==d;return e(f,g).then(function(a){c.X||dh(c,h,a,null)}).M(function(a){c.X||dh(c,h,null,a)})};var dh=function(a,b,c,d){b?d?(a.X=function(){return I(d)},a.Mb&&a.Mb(d)):(a.X=function(){return H(c)},a.Qa&&a.Qa(c)):(a.X=function(){return H({user:null})},a.Qa&&a.Qa({user:null}));a.Qa=null;a.Mb=null};
Zg.prototype.getRedirectResult=function(){var a=this;this.Fc||(this.Fc=new G(function(b,c){a.X?a.X().then(b,c):(a.Qa=b,a.Mb=c,kh(a))}));return this.Fc};var kh=function(a){var b=new Q("timeout");a.uc&&a.uc.cancel();a.uc=we(3E4).then(function(){a.X||dh(a,!0,null,b)})},$g=function(){};$g.prototype.gd=function(a,b){if(!a)return I(new Q("invalid-auth-event"));var c=a.qa,d=a.ta;return a.D?this.rc(a,b):b.ab(c,d)?this.sc(a,b):I(new Q("invalid-auth-event"))};
$g.prototype.rc=function(a,b){b.Ca(a.qa,null,a.getError(),a.ta);return H()};$g.prototype.sc=function(a,b){var c=a.ta,d=a.qa,e=b.ab(d,c),f=a.Wa,g=a.hc();return e(f,g).then(function(a){b.Ca(d,a,null,c)}).M(function(a){b.Ca(d,null,a,c)})};var lh=function(a){this.c=a;this.Fa=this.da=null;this.Ia=0};lh.prototype.P=function(){return{apiKey:this.c.u,refreshToken:this.da,accessToken:this.Fa,expirationTime:this.Ia}};var nh=function(a,b){var c=b.idToken,d=b.refreshToken,e=mh(b.expiresIn);a.Fa=c;a.Ia=e;a.da=d},mh=function(a){return la()+1E3*parseInt(a,10)},oh=function(a,b){return Vf(a.c,b).then(function(b){a.Fa=b.access_token;a.Ia=mh(b.expires_in);a.da=b.refresh_token;return{accessToken:a.Fa,expirationTime:a.Ia,refreshToken:a.da}})};
lh.prototype.getToken=function(a){return a||!this.Fa||la()>this.Ia-3E4?this.da?oh(this,{grant_type:"refresh_token",refresh_token:this.da}):H(null):H({accessToken:this.Fa,expirationTime:this.Ia,refreshToken:this.da})};var ph=function(a,b,c,d,e){qf(this,{uid:a,displayName:d||null,photoURL:e||null,email:c||null,providerId:b})},qh=function(a,b){Lb.call(this,a);for(var c in b)this[c]=b[c]};q(qh,Lb);
var V=function(a,b,c){this.O=[];this.u=a.apiKey;this.R=a.appName;this.S=a.authDomain||null;a=firebase.SDK_VERSION?kf(firebase.SDK_VERSION):null;this.c=new S(this.u,null,a);this.pa=new lh(this.c);rh(this,b.idToken);nh(this.pa,b);P(this,"refreshToken",this.pa.da);sh(this,c||{});J.call(this);this.Jb=!1;this.S&&mf()&&(this.s=jh(this.S,this.u,this.R));this.Pb=[]};q(V,J);
var rh=function(a,b){a.Xc=b;P(a,"_lat",b)},th=function(a,b){La(a.Pb,function(a){return a==b})},uh=function(a){for(var b=[],c=0;c<a.Pb.length;c++)b.push(a.Pb[c](a));return ud(b).then(function(){return a})},vh=function(a){a.s&&!a.Jb&&(a.Jb=!0,a.s.subscribe(a))},sh=function(a,b){qf(a,{uid:b.uid,displayName:b.displayName||null,photoURL:b.photoURL||null,email:b.email||null,emailVerified:b.emailVerified||!1,isAnonymous:b.isAnonymous||!1,providerData:[]})};P(V.prototype,"providerId","firebase");
var wh=function(){},xh=function(a){return H().then(function(){if(a.Id)throw new Q("app-deleted");})},yh=function(a){return Ea(a.providerData,function(a){return a.providerId})},Ah=function(a,b){b&&(zh(a,b.providerId),a.providerData.push(b))},zh=function(a,b){La(a.providerData,function(a){return a.providerId==b})},Bh=function(a,b,c){("uid"!=b||c)&&a.hasOwnProperty(b)&&P(a,b,c)};
V.prototype.copy=function(a){var b=this;b!=a&&(qf(this,{uid:a.uid,displayName:a.displayName,photoURL:a.photoURL,email:a.email,emailVerified:a.emailVerified,isAnonymous:a.isAnonymous,providerData:[]}),w(a.providerData,function(a){Ah(b,a)}),this.pa=a.pa,P(this,"refreshToken",this.pa.da))};V.prototype.reload=function(){var a=this;return xh(this).then(function(){return Ch(a).then(function(){return uh(a)}).then(wh)})};
var Ch=function(a){return a.getToken().then(function(b){var c=a.isAnonymous;return Dh(a,b).then(function(){c||Bh(a,"isAnonymous",!1);return b}).M(function(b){"auth/user-token-expired"==b.code&&(a.dispatchEvent(new qh("userDeleted")),Eh(a));throw b;})})};V.prototype.getToken=function(a){var b=this;return xh(this).then(function(){return b.pa.getToken(a)}).then(function(a){if(!a)throw new Q("internal-error");a.accessToken!=b.Xc&&(rh(b,a.accessToken),b.ka());Bh(b,"refreshToken",a.refreshToken);return a.accessToken})};
var Fh=function(a,b){b.idToken&&a.Xc!=b.idToken&&(nh(a.pa,b),a.ka(),rh(a,b.idToken))};V.prototype.ka=function(){this.dispatchEvent(new qh("tokenChanged"))};var Dh=function(a,b){return R(a.c,ug,{idToken:b}).then(p(a.me,a))};
V.prototype.me=function(a){a=a.users;if(!a||!a.length)throw new Q("internal-error");a=a[0];sh(this,{uid:a.localId,displayName:a.displayName,photoURL:a.photoUrl,email:a.email,emailVerified:!!a.emailVerified});for(var b=Gh(a),c=0;c<b.length;c++)Ah(this,b[c]);Bh(this,"isAnonymous",!(this.email&&a.passwordHash)&&!(this.providerData&&this.providerData.length))};
var Gh=function(a){return(a=a.providerUserInfo)&&a.length?Ea(a,function(a){return new ph(a.rawId,a.providerId,a.email,a.displayName,a.photoUrl)}):[]};V.prototype.reauthenticate=function(a){var b=this;return this.f(a.zb(this.c).then(function(a){var d;a:{var e=a.idToken.split(".");if(3==e.length){for(var e=e[1],f=(4-e.length%4)%4,g=0;g<f;g++)e+=".";try{var h=mc(tb(e));if(h.sub&&h.iss&&h.aud&&h.exp){d=new xf(h);break a}}catch(r){}}d=null}if(!d||b.uid!=d.fe)throw new Q("user-mismatch");Fh(b,a);return b.reload()}))};
var Hh=function(a,b){return Ch(a).then(function(){if(Ia(yh(a),b))return uh(a).then(function(){throw new Q("provider-already-linked");})})};k=V.prototype;k.link=function(a){var b=this;return this.f(Hh(this,a.provider).then(function(){return b.getToken()}).then(function(c){return a.Zc(b.c,c)}).then(p(this.Nc,this)))};k.Nc=function(a){Fh(this,a);var b=this;return this.reload().then(function(){return b})};
k.updateEmail=function(a){var b=this;return this.f(this.getToken().then(function(c){return b.c.updateEmail(c,a)}).then(function(a){Fh(b,a);return b.reload()}))};k.updatePassword=function(a){var b=this;return this.f(this.getToken().then(function(c){return b.c.updatePassword(c,a)}).then(function(a){Fh(b,a);return b.reload()}))};
k.updateProfile=function(a){if(void 0===a.displayName&&void 0===a.photoURL)return xh(this);var b=this;return this.f(this.getToken().then(function(c){return b.c.updateProfile(c,{displayName:a.displayName,photoUrl:a.photoURL})}).then(function(a){Fh(b,a);Bh(b,"displayName",a.displayName||null);Bh(b,"photoURL",a.photoUrl||null);return uh(b)}).then(wh))};
k.unlink=function(a){var b=this;return this.f(Ch(this).then(function(c){return Ia(yh(b),a)?kg(b.c,c,[a]).then(function(a){var c={};w(a.providerUserInfo||[],function(a){c[a.providerId]=!0});w(yh(b),function(a){c[a]||zh(b,a)});return uh(b)}):uh(b).then(function(){throw new Q("no-such-provider");})}))};k["delete"]=function(){var a=this;return this.f(this.getToken().then(function(b){return R(a.c,tg,{idToken:b})}).then(function(){a.dispatchEvent(new qh("userDeleted"))})).then(function(){Eh(a)})};
k.Hc=function(a,b){return"linkViaPopup"==a&&(this.ba||null)==b&&this.V||"linkViaRedirect"==a&&(this.Lb||null)==b?!0:!1};k.Ca=function(a,b,c,d){"linkViaPopup"==a&&d==(this.ba||null)&&(c&&this.ya?this.ya(c):b&&!c&&this.V&&this.V(b),this.za&&(this.za.cancel(),this.za=null),delete this.V,delete this.ya)};k.ab=function(a,b){return"linkViaPopup"==a&&b==(this.ba||null)||"linkViaRedirect"==a&&(this.Lb||null)==b?p(this.Ld,this):null};k.xb=function(){return this.uid+":::"+Math.floor(1E9*Math.random()).toString()};
k.linkWithPopup=function(a){if(!mf())return I(new Q("operation-not-supported-in-this-environment"));var b=this,c=uf(a.providerId),d=this.xb(),e=null;!nf()&&this.S&&a.isOAuthProvider&&(e=Hg(this.S,this.u,this.R,"linkViaPopup",a.providerId,a.Ab(),null,d,firebase.SDK_VERSION||null));var f=ff(e,c&&c.mb,c&&c.lb),c=Hh(this,a.providerId).then(function(){return uh(b)}).then(function(){b.Ka();return b.getToken()}).then(function(){return e?f:fh(b.s,f,"linkViaPopup",a,d)}).then(function(a){return new G(function(c,
e){b.Ca("linkViaPopup",null,new Q("cancelled-popup-request"),b.ba||null);b.V=c;b.ya=e;b.ba=d;b.za=hh(b,"linkViaPopup",a,d)})}).then(function(a){f&&(f||window).close();return a}).M(function(a){f&&(f||window).close();throw a;});return this.f(c)};
k.linkWithRedirect=function(a){if(!mf())return I(new Q("operation-not-supported-in-this-environment"));var b=this,c=null,d=this.xb(),e=Hh(this,a.providerId).then(function(){b.Ka();return b.getToken()}).then(function(){b.Lb=d;return uh(b)}).then(function(a){b.Aa&&(a=b.u+":"+b.R,a=Ih(b.Aa,Jh,b.P(),a));return a}).then(function(){return gh(b.s,"linkViaRedirect",a,d)}).M(function(a){c=a;if(b.Aa)return Kh(b.Aa,Jh,b.u+":"+b.R);throw c;}).then(function(){if(c)throw c;});return this.f(e)};
k.Ka=function(){if(this.s&&this.Jb)return this.s;if(this.s&&!this.Jb)throw new Q("internal-error");throw new Q("auth-domain-config-required");};k.Ld=function(a,b){var c=this,d=null,e=this.getToken().then(function(d){return R(c.c,Bf,{requestUri:a,sessionId:b,idToken:d})}).then(function(a){d=Mf(a);return c.Nc(a)}).then(function(a){return{user:a,credential:d}});return this.f(e)};
k.sendEmailVerification=function(){var a=this;return this.f(this.getToken().then(function(b){return a.c.sendEmailVerification(b)}).then(function(b){if(a.email!=b)return a.reload()}).then(function(){}))};var Eh=function(a){for(var b=0;b<a.O.length;b++)a.O[b].cancel("app-deleted");a.O=[];a.Id=!0;P(a,"refreshToken",null);a.s&&a.s.unsubscribe(a)};V.prototype.f=function(a){var b=this;this.O.push(a);xd(a,function(){Ka(b.O,a)});return a};
V.prototype.P=function(){var a={uid:this.uid,displayName:this.displayName,photoURL:this.photoURL,email:this.email,emailVerified:this.emailVerified,isAnonymous:this.isAnonymous,providerData:[],apiKey:this.u,appName:this.R,authDomain:this.S,stsTokenManager:this.pa.P(),redirectEventId:this.Lb||null};w(this.providerData,function(b){a.providerData.push(rf(b))});return a};
var Lh=function(a){if(!a.apiKey)return null;var b={apiKey:a.apiKey,authDomain:a.authDomain,appName:a.appName},c={};if(a.stsTokenManager&&a.stsTokenManager.accessToken&&a.stsTokenManager.refreshToken&&a.stsTokenManager.expirationTime)c.idToken=a.stsTokenManager.accessToken,c.refreshToken=a.stsTokenManager.refreshToken,c.expiresIn=(a.stsTokenManager.expirationTime-la())/1E3;else return null;var d=new V(b,c,a);a.providerData&&w(a.providerData,function(a){if(a){var b={};qf(b,a);Ah(d,b)}});a.redirectEventId&&
(d.Lb=a.redirectEventId);return d},Mh=function(a,b,c){var d=new V(a,b);c&&(d.Aa=c);return d.reload().then(function(){return d})};var Nh,Oh=function(a,b,c,d,e,f){this.Hd=a;this.nc=b;this.cc=c;this.td=d;this.ga=e;this.H={};this.ob=[];this.kb=0;this.$d=f||l.indexedDB},Ph=function(a){return new G(function(b,c){var d=a.$d.open(a.Hd,a.ga);d.onerror=function(a){c(Error(a.target.errorCode))};d.onupgradeneeded=function(b){b=b.target.result;try{b.createObjectStore(a.nc,{keyPath:a.cc})}catch(d){c(d)}};d.onsuccess=function(a){b(a.target.result)}})},Qh=function(a){a.Uc||(a.Uc=Ph(a));return a.Uc},Rh=function(a,b){return b.objectStore(a.nc)},
Sh=function(a,b,c){return b.transaction([a.nc],c?"readwrite":"readonly")},Th=function(a){return new G(function(b,c){a.onsuccess=function(a){a&&a.target?b(a.target.result):b()};a.onerror=function(a){c(Error(a.target.errorCode))}})};
Oh.prototype.set=function(a,b){var c=!1,d,e=this;return xd(Qh(this).then(function(b){d=b;b=Rh(e,Sh(e,d,!0));return Th(b.get(a))}).then(function(f){var g=Rh(e,Sh(e,d,!0));if(f)return f.value=b,Th(g.put(f));e.kb++;c=!0;f={};f[e.cc]=a;f[e.td]=b;return Th(g.add(f))}).then(function(){e.H[a]=b}),function(){c&&e.kb--})};Oh.prototype.get=function(a){var b=this;return Qh(this).then(function(c){return Th(Rh(b,Sh(b,c,!1)).get(a))})};
Oh.prototype.remove=function(a){var b=!1,c=this;return xd(Qh(this).then(function(d){b=!0;c.kb++;return Th(Rh(c,Sh(c,d,!0))["delete"](a))}).then(function(){delete c.H[a]}),function(){b&&c.kb--})};
Oh.prototype.we=function(){var a=this;return Qh(this).then(function(b){var c=Rh(a,Sh(a,b,!1));return c.getAll?Th(c.getAll()):new G(function(a,b){var f=[],g=c.openCursor();g.onsuccess=function(b){(b=b.target.result)?(f.push(b.value),b["continue"]()):a(f)};g.onerror=function(a){b(Error(a.target.errorCode))}})}).then(function(b){var c={},d=[];if(0==a.kb){for(d=0;d<b.length;d++)c[b[d][a.cc]]=b[d][a.td];d=ef(a.H,c);a.H=c}return d})};
var Uh=function(a,b){La(a.ob,function(a){return a==b});0==a.ob.length&&a.Qb()};Oh.prototype.Ac=function(){var a=this;this.Qb();var b=function(){a.qc=we(1E3).then(p(a.we,a)).then(function(b){0<b.length&&w(a.ob,function(a){a(b)})}).then(b).M(function(a){"STOP_EVENT"!=a.message&&b()});return a.qc};b()};Oh.prototype.Qb=function(){this.qc&&this.qc.cancel("STOP_EVENT")};var Jh={name:"redirectUser",K:!1},Vh={name:"sessionId",K:!1},Wh={name:"authEvent",K:!0},Xh={name:"authUser",K:!0},Yh=function(a,b,c,d,e,f){this.ie=a;this.md=b;this.jb=d;this.pe=e;this.kd=f;if(!Mg(new Ng)||!Mg(new Og))throw new Q("web-storage-unsupported");this.G={};this.eb=c;this.$c=p(this.ad,this);this.Tc=p(this.ae,this);this.H={}},Zh,$h=function(){if(!Zh){Nh||(Nh=new Oh("firebaseLocalStorageDb","firebaseLocalStorage","fbase_key","value",1));var a=navigator.userAgent.toLowerCase();Zh=new Yh("firebase",
":",Nh,y&&!!pb&&11==pb||/Edge\/\d+/.test($a),-1!=a.indexOf("safari")&&-1==a.indexOf("chrome")&&window!=window.top?!0:!1,nf())}return Zh},ai=function(a,b){var c;b?(a.ed||(c=new Ng,c=Mg(c)?c:null,a.ed=new Ig(c)),c=a.ed):(a.pd||(c=new Og,c=Mg(c)?c:null,a.pd=new Ig(c)),c=a.pd);return c};Yh.prototype.l=function(a,b){return this.ie+this.md+a.name+(b?this.md+b:"")};
var bi=function(a,b,c){if(a.jb&&b.K)return a.eb.get(a.l(b,c)).then(function(a){return a&&a.value});var d=a.l(b,c);c=null;try{c=ai(a,b.K).get(d)}catch(e){if(a=(b.K?window.localStorage:window.sessionStorage).getItem(d),null===a)c=null;else try{c=JSON.parse(a)}catch(f){return I(e)}}return H(c)},Kh=function(a,b,c){if(a.jb&&b.K)return a.eb.remove(a.l(b,c));ai(a,b.K).remove(a.l(b,c));b.K&&(a.H[a.l(b,c)]=null);return H()},Ih=function(a,b,c,d){if(a.jb&&b.K)return a.eb.set(a.l(b,d),c);ai(a,b.K).set(a.l(b,
d),c);b.K&&(a.H[a.l(b,d)]=window.localStorage.getItem(a.l(b,d)));return H()};Yh.prototype.hc=function(a){return bi(this,Vh,a)};Yh.prototype.Cc=function(a,b){ci(this,this.l(Wh,a),b)};
var di=function(a,b,c){return bi(a,Xh,b).then(function(a){a&&c&&(a.authDomain=c);return Lh(a||{})})},ei=function(a,b,c){return bi(a,Jh,b).then(function(a){a&&c&&(a.authDomain=c);return Lh(a||{})})},ci=function(a,b,c){a.H[b]=window.localStorage.getItem(b);Ta(a.G)&&a.Ac();a.G[b]||(a.G[b]=[]);a.G[b].push(c)},fi=function(a,b,c){a.G[b]&&(La(a.G[b],function(a){return a==c}),0==a.G[b].length&&delete a.G[b]);Ta(a.G)&&a.Qb()};
Yh.prototype.Ac=function(){if(this.jb){var a=this.eb,b=this.Tc;0==a.ob.length&&a.Ac();a.ob.push(b)}else Xb(window,"storage",this.$c),this.kd||gi(this)};var gi=function(a){hi(a);a.mc=setInterval(function(){for(var b in a.G){var c=window.localStorage.getItem(b);c!=a.H[b]&&(a.H[b]=c,c=new Mb({type:"storage",key:b,target:window,oldValue:a.H[b],newValue:c}),a.ad(c))}},2E3)},hi=function(a){a.mc&&(clearInterval(a.mc),a.mc=null)};
Yh.prototype.Qb=function(){this.jb?Uh(this.eb,this.Tc):(gc(window,"storage",this.$c),this.kd||hi(this))};Yh.prototype.ad=function(a){var b=a.wb.key;if(this.pe){var c=window.localStorage.getItem(b);a=a.wb.newValue;a!=c&&(a?window.localStorage.setItem(b,a):a||window.localStorage.removeItem(b))}this.H[b]=window.localStorage.getItem(b);this.Gc(b)};Yh.prototype.ae=function(a){w(a,p(this.Gc,this))};Yh.prototype.Gc=function(a){this.G[a]&&w(this.G[a],function(a){a()})};var X=function(a){this.Lc=!1;P(this,"app",a);if(W(this).options&&W(this).options.apiKey)a=firebase.SDK_VERSION?kf(firebase.SDK_VERSION):null,this.c=new S(W(this).options&&W(this).options.apiKey,null,a);else throw new Q("invalid-api-key");this.O=[];this.Za=[];this.je=firebase.INTERNAL.createSubscribe(p(this.be,this));ii(this,null);this.Ba=this.fa=null;try{this.fa=$h(),this.Ba=$h(),this.B=ji(this)}catch(b){this.B=I(b)}this.gb=!1;this.Pc=p(this.ve,this);this.rd=p(this.La,this);this.sd=p(this.Vd,this);
this.qd=p(this.Ud,this);ki(this);this.INTERNAL={};this.INTERNAL["delete"]=p(this["delete"],this)};X.prototype.Ka=function(){return this.Jd||I(new Q("auth-domain-config-required"))};var ki=function(a){var b=W(a).options.authDomain,c=W(a).options.apiKey;b&&mf()&&(a.Jd=a.B.then(function(){a.s=jh(b,c,W(a).name);a.s.subscribe(a);Y(a)&&vh(Y(a));a.vc&&(vh(a.vc),a.vc=null);return a.s}))};k=X.prototype;
k.Hc=function(a,b){switch(a){case "unknown":case "signInViaRedirect":return!0;case "signInViaPopup":return this.ba==b&&!!this.V;default:return!1}};k.Ca=function(a,b,c,d){"signInViaPopup"==a&&this.ba==d&&(c&&this.ya?this.ya(c):b&&!c&&this.V&&this.V(b),this.za&&(this.za.cancel(),this.za=null),delete this.V,delete this.ya)};k.ab=function(a,b){return"signInViaRedirect"==a||"signInViaPopup"==a&&this.ba==b&&this.V?p(this.Md,this):null};
k.Md=function(a,b){var c=this,d=null,e=zf(c.c,{requestUri:a,sessionId:b}).then(function(a){d=Mf(a);return a}),f=c.B.then(function(){return e}).then(function(a){return li(c,a)}).then(function(){return{user:Y(c),credential:d}});return this.f(f)};k.xb=function(){return Math.floor(1E9*Math.random()).toString()};
k.signInWithPopup=function(a){if(!mf())return I(new Q("operation-not-supported-in-this-environment"));var b=this,c=uf(a.providerId),d=this.xb(),e=null;!nf()&&W(this).options.authDomain&&a.isOAuthProvider&&(e=Hg(W(this).options.authDomain,W(this).options.apiKey,W(this).name,"signInViaPopup",a.providerId,a.Ab(),null,d,firebase.SDK_VERSION||null));var f=ff(e,c&&c.mb,c&&c.lb),c=this.Ka().then(function(b){return e?f:fh(b,f,"signInViaPopup",a,d)}).then(function(a){return new G(function(c,e){b.Ca("signInViaPopup",
null,new Q("cancelled-popup-request"),b.ba);b.V=c;b.ya=e;b.ba=d;b.za=hh(b,"signInViaPopup",a,d)})}).then(function(a){f&&(f||window).close();return a}).M(function(a){f&&(f||window).close();throw a;});return this.f(c)};k.signInWithRedirect=function(a){if(!mf())return I(new Q("operation-not-supported-in-this-environment"));var b=this,c=this.Ka().then(function(){return gh(b.s,"signInViaRedirect",a)});return this.f(c)};
k.getRedirectResult=function(){if(!mf())return I(new Q("operation-not-supported-in-this-environment"));var a=this,b=this.Ka().then(function(){return a.s.getRedirectResult()});return this.f(b)};
var li=function(a,b){var c={};c.apiKey=W(a).options.apiKey;c.authDomain=W(a).options.authDomain;c.appName=W(a).name;return a.B.then(function(){return Mh(c,b,a.Ba)}).then(function(b){if(Y(a)&&b.uid==Y(a).uid)return Y(a).copy(b),a.La(b);ii(a,b);vh(b);return a.La(b)}).then(function(){a.ka()})},ii=function(a,b){Y(a)&&(th(Y(a),a.rd),gc(Y(a),"tokenChanged",a.sd),gc(Y(a),"userDeleted",a.qd));b&&(b.Pb.push(a.rd),Xb(b,"tokenChanged",a.sd),Xb(b,"userDeleted",a.qd));P(a,"currentUser",b)};
X.prototype.signOut=function(){var a=this,b=this.B.then(function(){if(!Y(a))return H();ii(a,null);return Kh(a.fa,Xh,mi(a)).then(function(){a.ka()})});return this.f(b)};
var ni=function(a){var b=mi(a),c=ei(a.Ba,b,W(a).options.authDomain).then(function(c){if(a.vc=c)c.Aa=a.Ba;return Kh(a.Ba,Jh,b)});return a.f(c)},ji=function(a){var b=mi(a),c=W(a).options.authDomain,d=xd(ni(a).then(function(){return di(a.fa,b,c)}).then(function(c){return c?(c.Aa=a.Ba,c.reload().then(function(){return c}).M(function(d){return"auth/network-request-failed"==d.code?c:Kh(a.fa,Xh,b)})):null}).then(function(b){ii(a,b||null);a.gb=!0;a.ka()}),function(){if(!a.Lc){a.gb=!0;var c=a.fa;ci(c,c.l(Xh,
b),a.Pc)}});return a.f(d)};X.prototype.ve=function(){var a=this;return di(this.fa,mi(this),W(this).options.authDomain).then(function(b){var c;if(c=Y(a)&&b){c=Y(a).uid;var d=b.uid;c=void 0===c||null===c||""===c||void 0===d||null===d||""===d?!1:c==d}if(c)return Y(a).copy(b),Y(a).getToken();ii(a,b);b&&(vh(b),b.Aa=a.Ba);a.s.subscribe(a);a.ka()})};X.prototype.La=function(a){var b=mi(this);return Ih(this.fa,Xh,a.P(),b)};X.prototype.Vd=function(){this.gb=!0;this.ka();this.La(Y(this))};X.prototype.Ud=function(){this.signOut()};
var oi=function(a,b){return a.f(b.then(function(b){return li(a,b)}).then(function(){return Y(a)}))};k=X.prototype;k.be=function(a){var b=this;this.addAuthTokenListener(function(){a.next(Y(b))})};k.onAuthStateChanged=function(a,b,c){var d=this;this.gb&&firebase.Promise.resolve().then(function(){n(a)?a(Y(d)):n(a.next)&&a.next(Y(d))});return this.je(a,b,c)};k.getToken=function(a){var b=this,c=this.B.then(function(){return Y(b)?Y(b).getToken(a).then(function(a){return{accessToken:a}}):null});return this.f(c)};
k.signInWithCustomToken=function(a){var b=this;return this.B.then(function(){return oi(b,R(b.c,vg,{token:a}))}).then(function(a){Bh(a,"isAnonymous",!1);return b.La(a)}).then(function(){return Y(b)})};k.signInWithEmailAndPassword=function(a,b){var c=this;return this.B.then(function(){return oi(c,R(c.c,If,{email:a,password:b}))})};k.createUserWithEmailAndPassword=function(a,b){var c=this;return this.B.then(function(){return oi(c,R(c.c,sg,{email:a,password:b}))})};
k.signInWithCredential=function(a){var b=this;return this.B.then(function(){return oi(b,a.zb(b.c))})};k.signInAnonymously=function(){var a=Y(this),b=this;return a&&a.isAnonymous?H(a):this.B.then(function(){return oi(b,b.c.signInAnonymously())}).then(function(a){Bh(a,"isAnonymous",!0);return b.La(a)}).then(function(){return Y(b)})};var mi=function(a){return W(a).options.apiKey+":"+W(a).name},W=function(a){return a.app},Y=function(a){return a.currentUser};k=X.prototype;
k.ka=function(){for(var a=0;a<this.Za.length;a++)if(this.Za[a])this.Za[a](Y(this)&&Y(this)._lat||null)};k.addAuthTokenListener=function(a){this.Za.push(a);var b=this;this.gb&&this.B.then(function(){a(Y(b)&&Y(b)._lat||null)})};k.removeAuthTokenListener=function(a){La(this.Za,function(b){return b==a})};k["delete"]=function(){this.Lc=!0;for(var a=0;a<this.O.length;a++)this.O[a].cancel("app-deleted");this.O=[];this.fa&&(a=this.fa,fi(a,a.l(Xh,mi(this)),this.Pc));this.s&&this.s.unsubscribe(this)};
k.f=function(a){var b=this;this.O.push(a);xd(a,function(){Ka(b.O,a)});return a};k.fetchProvidersForEmail=function(a){return this.f(ag(this.c,a))};k.verifyPasswordResetCode=function(a){return this.checkActionCode(a).then(function(a){return a.data.email})};k.confirmPasswordReset=function(a,b){return this.f(this.c.confirmPasswordReset(a,b).then(function(){}))};k.checkActionCode=function(a){return this.f(this.c.checkActionCode(a).then(function(a){return{data:{email:a.email}}}))};k.applyActionCode=function(a){return this.f(this.c.applyActionCode(a).then(function(){}))};
k.sendPasswordResetEmail=function(a){return this.f(this.c.sendPasswordResetEmail(a).then(function(){}))};Xg(X.prototype,{applyActionCode:{name:"applyActionCode",b:[T("code")]},checkActionCode:{name:"checkActionCode",b:[T("code")]},confirmPasswordReset:{name:"confirmPasswordReset",b:[T("code"),T("newPassword")]},createUserWithEmailAndPassword:{name:"createUserWithEmailAndPassword",b:[T("email"),T("password")]},fetchProvidersForEmail:{name:"fetchProvidersForEmail",b:[T("email")]},getRedirectResult:{name:"getRedirectResult",b:[]},onAuthStateChanged:{name:"onAuthStateChanged",b:[Vg(Qg(),Rg(),"nextOrObserver"),
Rg("opt_error",!0),Rg("opt_completed",!0)]},sendPasswordResetEmail:{name:"sendPasswordResetEmail",b:[T("email")]},signInAnonymously:{name:"signInAnonymously",b:[]},signInWithCredential:{name:"signInWithCredential",b:[Tg()]},signInWithCustomToken:{name:"signInWithCustomToken",b:[T("token")]},signInWithEmailAndPassword:{name:"signInWithEmailAndPassword",b:[T("email"),T("password")]},signInWithPopup:{name:"signInWithPopup",b:[Ug()]},signInWithRedirect:{name:"signInWithRedirect",b:[Ug()]},signOut:{name:"signOut",
b:[]},verifyPasswordResetCode:{name:"verifyPasswordResetCode",b:[T("code")]}});
Xg(V.prototype,{"delete":{name:"delete",b:[]},getToken:{name:"getToken",b:[{name:"opt_forceRefresh",Y:"a boolean",optional:!0,Z:function(a){return"boolean"==typeof a}}]},link:{name:"link",b:[Tg()]},linkWithPopup:{name:"linkWithPopup",b:[Ug()]},linkWithRedirect:{name:"linkWithRedirect",b:[Ug()]},reauthenticate:{name:"reauthenticate",b:[Tg()]},reload:{name:"reload",b:[]},sendEmailVerification:{name:"sendEmailVerification",b:[]},unlink:{name:"unlink",b:[T("provider")]},updateEmail:{name:"updateEmail",
b:[T("email")]},updatePassword:{name:"updatePassword",b:[T("password")]},updateProfile:{name:"updateProfile",b:[Qg("profile")]}});Xg(G.prototype,{M:{name:"catch"},then:{name:"then"}});U(Kf,"credential",function(a,b){return new Hf(a,b)},[T("email"),T("password")]);Xg(Df.prototype,{addScope:{name:"addScope",b:[T("scope")]}});U(Df,"credential",Df.credential,[Vg(T(),Qg(),"token")]);Xg(Ef.prototype,{addScope:{name:"addScope",b:[T("scope")]}});U(Ef,"credential",Ef.credential,[Vg(T(),Qg(),"token")]);
Xg(Ff.prototype,{addScope:{name:"addScope",b:[T("scope")]}});U(Ff,"credential",Ff.credential,[Vg(T(),Vg(Qg(),Sg()),"idToken"),Vg(T(),Sg(),"accessToken",!0)]);U(Gf,"credential",Gf.credential,[Vg(T(),Qg(),"token"),T("secret",!0)]);
(function(){if("undefined"!==typeof firebase&&firebase.INTERNAL&&firebase.INTERNAL.registerService){var a={Auth:X,Error:Q};U(a,"EmailAuthProvider",Kf,[]);U(a,"FacebookAuthProvider",Df,[]);U(a,"GithubAuthProvider",Ef,[]);U(a,"GoogleAuthProvider",Ff,[]);U(a,"TwitterAuthProvider",Gf,[]);firebase.INTERNAL.registerService("auth",function(a,c){var d=new X(a);c({INTERNAL:{getToken:p(d.getToken,d),addAuthTokenListener:p(d.addAuthTokenListener,d),removeAuthTokenListener:p(d.removeAuthTokenListener,d)}});return d},
a);firebase.INTERNAL.registerAppHook(function(a,c){"create"===a&&c.auth()});firebase.INTERNAL.extendNamespace({User:V})}else throw Error("Cannot find the firebase namespace; be sure to include firebase-app.js before this library.");})();})();
(function() {var g,n=this;function p(a){return void 0!==a}function aa(){}function ba(a){a.Wb=function(){return a.af?a.af:a.af=new a}}
function ca(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function da(a){return"array"==ca(a)}function ea(a){var b=ca(a);return"array"==b||"object"==b&&"number"==typeof a.length}function q(a){return"string"==typeof a}function fa(a){return"number"==typeof a}function ga(a){return"function"==ca(a)}function ha(a){var b=typeof a;return"object"==b&&null!=a||"function"==b}function ia(a,b,c){return a.call.apply(a.bind,arguments)}
function ja(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function r(a,b,c){r=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ia:ja;return r.apply(null,arguments)}
function ka(a,b){function c(){}c.prototype=b.prototype;a.Fg=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Cg=function(a,c,f){for(var h=Array(arguments.length-2),k=2;k<arguments.length;k++)h[k-2]=arguments[k];return b.prototype[c].apply(a,h)}};function la(){this.Ya=-1};function ma(){this.Ya=-1;this.Ya=64;this.N=[];this.Wd=[];this.If=[];this.zd=[];this.zd[0]=128;for(var a=1;a<this.Ya;++a)this.zd[a]=0;this.Pd=this.ac=0;this.reset()}ka(ma,la);ma.prototype.reset=function(){this.N[0]=1732584193;this.N[1]=4023233417;this.N[2]=2562383102;this.N[3]=271733878;this.N[4]=3285377520;this.Pd=this.ac=0};
function na(a,b,c){c||(c=0);var d=a.If;if(q(b))for(var e=0;16>e;e++)d[e]=b.charCodeAt(c)<<24|b.charCodeAt(c+1)<<16|b.charCodeAt(c+2)<<8|b.charCodeAt(c+3),c+=4;else for(e=0;16>e;e++)d[e]=b[c]<<24|b[c+1]<<16|b[c+2]<<8|b[c+3],c+=4;for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}b=a.N[0];c=a.N[1];for(var h=a.N[2],k=a.N[3],m=a.N[4],l,e=0;80>e;e++)40>e?20>e?(f=k^c&(h^k),l=1518500249):(f=c^h^k,l=1859775393):60>e?(f=c&h|k&(c|h),l=2400959708):(f=c^h^k,l=3395469782),f=(b<<
5|b>>>27)+f+m+l+d[e]&4294967295,m=k,k=h,h=(c<<30|c>>>2)&4294967295,c=b,b=f;a.N[0]=a.N[0]+b&4294967295;a.N[1]=a.N[1]+c&4294967295;a.N[2]=a.N[2]+h&4294967295;a.N[3]=a.N[3]+k&4294967295;a.N[4]=a.N[4]+m&4294967295}
ma.prototype.update=function(a,b){if(null!=a){p(b)||(b=a.length);for(var c=b-this.Ya,d=0,e=this.Wd,f=this.ac;d<b;){if(0==f)for(;d<=c;)na(this,a,d),d+=this.Ya;if(q(a))for(;d<b;){if(e[f]=a.charCodeAt(d),++f,++d,f==this.Ya){na(this,e);f=0;break}}else for(;d<b;)if(e[f]=a[d],++f,++d,f==this.Ya){na(this,e);f=0;break}}this.ac=f;this.Pd+=b}};function t(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function oa(a,b){var c={},d;for(d in a)c[d]=b.call(void 0,a[d],d,a);return c}function pa(a,b){for(var c in a)if(!b.call(void 0,a[c],c,a))return!1;return!0}function qa(a){var b=0,c;for(c in a)b++;return b}function ra(a){for(var b in a)return b}function sa(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function ta(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}function ua(a,b){for(var c in a)if(a[c]==b)return!0;return!1}
function va(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d}function wa(a,b){var c=va(a,b,void 0);return c&&a[c]}function xa(a){for(var b in a)return!1;return!0}function ya(a){var b={},c;for(c in a)b[c]=a[c];return b};function za(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function Aa(){this.Fd=void 0}
function Ba(a,b,c){switch(typeof b){case "string":Ca(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(null==b){c.push("null");break}if(da(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],Ba(a,a.Fd?a.Fd.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),Ca(f,c),
c.push(":"),Ba(a,a.Fd?a.Fd.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:throw Error("Unknown type: "+typeof b);}}var Da={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Ea=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function Ca(a,b){b.push('"',a.replace(Ea,function(a){if(a in Da)return Da[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return Da[a]=e+b.toString(16)}),'"')};var v;a:{var Fa=n.navigator;if(Fa){var Ga=Fa.userAgent;if(Ga){v=Ga;break a}}v=""};function Ha(a){if(Error.captureStackTrace)Error.captureStackTrace(this,Ha);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}ka(Ha,Error);Ha.prototype.name="CustomError";var w=Array.prototype,Ia=w.indexOf?function(a,b,c){return w.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(q(a))return q(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Ja=w.forEach?function(a,b,c){w.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},Ka=w.filter?function(a,b,c){return w.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,h=q(a)?
a.split(""):a,k=0;k<d;k++)if(k in h){var m=h[k];b.call(c,m,k,a)&&(e[f++]=m)}return e},La=w.map?function(a,b,c){return w.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=q(a)?a.split(""):a,h=0;h<d;h++)h in f&&(e[h]=b.call(c,f[h],h,a));return e},Ma=w.reduce?function(a,b,c,d){for(var e=[],f=1,h=arguments.length;f<h;f++)e.push(arguments[f]);d&&(e[0]=r(b,d));return w.reduce.apply(a,e)}:function(a,b,c,d){var e=c;Ja(a,function(c,h){e=b.call(d,e,c,h,a)});return e},Na=w.every?function(a,b,
c){return w.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};function Oa(a,b){var c=Pa(a,b,void 0);return 0>c?null:q(a)?a.charAt(c):a[c]}function Pa(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1}function Qa(a,b){var c=Ia(a,b);0<=c&&w.splice.call(a,c,1)}function Ra(a,b,c){return 2>=arguments.length?w.slice.call(a,b):w.slice.call(a,b,c)}
function Sa(a,b){a.sort(b||Ta)}function Ta(a,b){return a>b?1:a<b?-1:0};var Ua=-1!=v.indexOf("Opera")||-1!=v.indexOf("OPR"),Va=-1!=v.indexOf("Trident")||-1!=v.indexOf("MSIE"),Wa=-1!=v.indexOf("Gecko")&&-1==v.toLowerCase().indexOf("webkit")&&!(-1!=v.indexOf("Trident")||-1!=v.indexOf("MSIE")),Xa=-1!=v.toLowerCase().indexOf("webkit");
(function(){var a="",b;if(Ua&&n.opera)return a=n.opera.version,ga(a)?a():a;Wa?b=/rv\:([^\);]+)(\)|;)/:Va?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:Xa&&(b=/WebKit\/(\S+)/);b&&(a=(a=b.exec(v))?a[1]:"");return Va&&(b=(b=n.document)?b.documentMode:void 0,b>parseFloat(a))?String(b):a})();var Ya=null,Za=null,$a=null;function ab(a,b){if(!ea(a))throw Error("encodeByteArray takes an array as a parameter");bb();for(var c=b?Za:Ya,d=[],e=0;e<a.length;e+=3){var f=a[e],h=e+1<a.length,k=h?a[e+1]:0,m=e+2<a.length,l=m?a[e+2]:0,u=f>>2,f=(f&3)<<4|k>>4,k=(k&15)<<2|l>>6,l=l&63;m||(l=64,h||(k=64));d.push(c[u],c[f],c[k],c[l])}return d.join("")}
function bb(){if(!Ya){Ya={};Za={};$a={};for(var a=0;65>a;a++)Ya[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a),Za[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a),$a[Za[a]]=a,62<=a&&($a["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(a)]=a)}};function cb(a){n.setTimeout(function(){throw a;},0)}var db;
function eb(){var a=n.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==v.indexOf("Presto")&&(a=function(){var a=document.createElement("iframe");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=r(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==v.indexOf("Trident")&&-1==v.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(p(c.next)){c=c.next;var a=c.Le;c.Le=null;a()}};return function(a){d.next={Le:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("script")?function(a){var b=
document.createElement("script");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){n.setTimeout(a,0)}};function fb(a,b){gb||hb();ib||(gb(),ib=!0);jb.push(new kb(a,b))}var gb;function hb(){if(n.Promise&&n.Promise.resolve){var a=n.Promise.resolve();gb=function(){a.then(lb)}}else gb=function(){var a=lb;!ga(n.setImmediate)||n.Window&&n.Window.prototype&&n.Window.prototype.setImmediate==n.setImmediate?(db||(db=eb()),db(a)):n.setImmediate(a)}}var ib=!1,jb=[];[].push(function(){ib=!1;jb=[]});
function lb(){for(;jb.length;){var a=jb;jb=[];for(var b=0;b<a.length;b++){var c=a[b];try{c.Vf.call(c.scope)}catch(d){cb(d)}}}ib=!1}function kb(a,b){this.Vf=a;this.scope=b};function mb(a,b){this.L=nb;this.tf=void 0;this.Ca=this.Ha=null;this.jd=this.be=!1;if(a==ob)pb(this,qb,b);else try{var c=this;a.call(b,function(a){pb(c,qb,a)},function(a){if(!(a instanceof rb))try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(b){}pb(c,sb,a)})}catch(d){pb(this,sb,d)}}var nb=0,qb=2,sb=3;function ob(){}mb.prototype.then=function(a,b,c){return tb(this,ga(a)?a:null,ga(b)?b:null,c)};mb.prototype.then=mb.prototype.then;mb.prototype.$goog_Thenable=!0;g=mb.prototype;
g.yg=function(a,b){return tb(this,null,a,b)};g.cancel=function(a){this.L==nb&&fb(function(){var b=new rb(a);ub(this,b)},this)};function ub(a,b){if(a.L==nb)if(a.Ha){var c=a.Ha;if(c.Ca){for(var d=0,e=-1,f=0,h;h=c.Ca[f];f++)if(h=h.m)if(d++,h==a&&(e=f),0<=e&&1<d)break;0<=e&&(c.L==nb&&1==d?ub(c,b):(d=c.Ca.splice(e,1)[0],vb(c,d,sb,b)))}a.Ha=null}else pb(a,sb,b)}function wb(a,b){a.Ca&&a.Ca.length||a.L!=qb&&a.L!=sb||xb(a);a.Ca||(a.Ca=[]);a.Ca.push(b)}
function tb(a,b,c,d){var e={m:null,gf:null,jf:null};e.m=new mb(function(a,h){e.gf=b?function(c){try{var e=b.call(d,c);a(e)}catch(l){h(l)}}:a;e.jf=c?function(b){try{var e=c.call(d,b);!p(e)&&b instanceof rb?h(b):a(e)}catch(l){h(l)}}:h});e.m.Ha=a;wb(a,e);return e.m}g.Bf=function(a){this.L=nb;pb(this,qb,a)};g.Cf=function(a){this.L=nb;pb(this,sb,a)};
function pb(a,b,c){if(a.L==nb){if(a==c)b=sb,c=new TypeError("Promise cannot resolve to itself");else{var d;if(c)try{d=!!c.$goog_Thenable}catch(e){d=!1}else d=!1;if(d){a.L=1;c.then(a.Bf,a.Cf,a);return}if(ha(c))try{var f=c.then;if(ga(f)){yb(a,c,f);return}}catch(h){b=sb,c=h}}a.tf=c;a.L=b;a.Ha=null;xb(a);b!=sb||c instanceof rb||zb(a,c)}}function yb(a,b,c){function d(b){f||(f=!0,a.Cf(b))}function e(b){f||(f=!0,a.Bf(b))}a.L=1;var f=!1;try{c.call(b,e,d)}catch(h){d(h)}}
function xb(a){a.be||(a.be=!0,fb(a.Tf,a))}g.Tf=function(){for(;this.Ca&&this.Ca.length;){var a=this.Ca;this.Ca=null;for(var b=0;b<a.length;b++)vb(this,a[b],this.L,this.tf)}this.be=!1};function vb(a,b,c,d){if(c==qb)b.gf(d);else{if(b.m)for(;a&&a.jd;a=a.Ha)a.jd=!1;b.jf(d)}}function zb(a,b){a.jd=!0;fb(function(){a.jd&&Ab.call(null,b)})}var Ab=cb;function rb(a){Ha.call(this,a)}ka(rb,Ha);rb.prototype.name="cancel";function Bb(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function x(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]}function Cb(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])};function y(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);if(e)throw Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+".");}function Db(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:throw Error("errorPrefix called with argumentNumber > 4.  Need to update it?");}return a=a+" failed: "+(d+" argument ")}
function A(a,b,c,d){if((!d||p(c))&&!ga(c))throw Error(Db(a,b,d)+"must be a valid function.");}function Eb(a,b,c){if(p(c)&&(!ha(c)||null===c))throw Error(Db(a,b,!0)+"must be a valid context object.");};function Fb(a){var b=[];Cb(a,function(a,d){da(d)?Ja(d,function(d){b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))}):b.push(encodeURIComponent(a)+"="+encodeURIComponent(d))});return b.length?"&"+b.join("&"):""};var Gb=n.Promise||mb;mb.prototype["catch"]=mb.prototype.yg;function Hb(){var a=this;this.reject=this.resolve=null;this.ra=new Gb(function(b,c){a.resolve=b;a.reject=c})}function Ib(a,b){return function(c,d){c?a.reject(c):a.resolve(d);ga(b)&&(Jb(a.ra),1===b.length?b(c):b(c,d))}}function Jb(a){a.then(void 0,aa)};function Kb(a,b){if(!a)throw Lb(b);}function Lb(a){return Error("Firebase Database ("+firebase.SDK_VERSION+") INTERNAL ASSERT FAILED: "+a)};function Mb(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,Kb(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b}function Nb(a){for(var b=0,c=0;c<a.length;c++){var d=a.charCodeAt(c);128>d?b++:2048>d?b+=2:55296<=d&&56319>=d?(b+=4,c++):b+=3}return b};function Ob(a){return"undefined"!==typeof JSON&&p(JSON.parse)?JSON.parse(a):za(a)}function B(a){if("undefined"!==typeof JSON&&p(JSON.stringify))a=JSON.stringify(a);else{var b=[];Ba(new Aa,a,b);a=b.join("")}return a};function Pb(a,b){this.committed=a;this.snapshot=b};function Qb(a){this.te=a;this.Bd=[];this.Rb=0;this.Yd=-1;this.Gb=null}function Rb(a,b,c){a.Yd=b;a.Gb=c;a.Yd<a.Rb&&(a.Gb(),a.Gb=null)}function Sb(a,b,c){for(a.Bd[b]=c;a.Bd[a.Rb];){var d=a.Bd[a.Rb];delete a.Bd[a.Rb];for(var e=0;e<d.length;++e)if(d[e]){var f=a;Tb(function(){f.te(d[e])})}if(a.Rb===a.Yd){a.Gb&&(clearTimeout(a.Gb),a.Gb(),a.Gb=null);break}a.Rb++}};function Ub(){this.qc={}}Ub.prototype.set=function(a,b){null==b?delete this.qc[a]:this.qc[a]=b};Ub.prototype.get=function(a){return Bb(this.qc,a)?this.qc[a]:null};Ub.prototype.remove=function(a){delete this.qc[a]};Ub.prototype.bf=!0;function Vb(a){this.vc=a;this.Cd="firebase:"}g=Vb.prototype;g.set=function(a,b){null==b?this.vc.removeItem(this.Cd+a):this.vc.setItem(this.Cd+a,B(b))};g.get=function(a){a=this.vc.getItem(this.Cd+a);return null==a?null:Ob(a)};g.remove=function(a){this.vc.removeItem(this.Cd+a)};g.bf=!1;g.toString=function(){return this.vc.toString()};function Wb(a){try{if("undefined"!==typeof window&&"undefined"!==typeof window[a]){var b=window[a];b.setItem("firebase:sentinel","cache");b.removeItem("firebase:sentinel");return new Vb(b)}}catch(c){}return new Ub}var Xb=Wb("localStorage"),Yb=Wb("sessionStorage");function Zb(a,b,c){this.type=$b;this.source=a;this.path=b;this.Ja=c}Zb.prototype.Nc=function(a){return this.path.e()?new Zb(this.source,C,this.Ja.R(a)):new Zb(this.source,D(this.path),this.Ja)};Zb.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" overwrite: "+this.Ja.toString()+")"};function ac(a,b){this.type=bc;this.source=a;this.path=b}ac.prototype.Nc=function(){return this.path.e()?new ac(this.source,C):new ac(this.source,D(this.path))};ac.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" listen_complete)"};function cc(a){this.He=a}cc.prototype.getToken=function(a){return this.He.INTERNAL.getToken(a).then(null,function(a){return a&&"auth/token-not-initialized"===a.code?(E("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(a)})};function dc(a,b){a.He.INTERNAL.addAuthTokenListener(b)};function ec(){this.Jd=F}ec.prototype.j=function(a){return this.Jd.Q(a)};ec.prototype.toString=function(){return this.Jd.toString()};function fc(a,b,c,d,e){this.host=a.toLowerCase();this.domain=this.host.substr(this.host.indexOf(".")+1);this.Sc=b;this.pe=c;this.Ag=d;this.mf=e||"";this.bb=Xb.get("host:"+a)||this.host}function gc(a,b){b!==a.bb&&(a.bb=b,"s-"===a.bb.substr(0,2)&&Xb.set("host:"+a.host,a.bb))}
function hc(a,b,c){H("string"===typeof b,"typeof type must == string");H("object"===typeof c,"typeof params must == object");if("websocket"===b)b=(a.Sc?"wss://":"ws://")+a.bb+"/.ws?";else if("long_polling"===b)b=(a.Sc?"https://":"http://")+a.bb+"/.lp?";else throw Error("Unknown connection type: "+b);a.host!==a.bb&&(c.ns=a.pe);var d=[];t(c,function(a,b){d.push(b+"="+a)});return b+d.join("&")}
fc.prototype.toString=function(){var a=(this.Sc?"https://":"http://")+this.host;this.mf&&(a+="<"+this.mf+">");return a};function ic(a,b){this.yf={};this.Vc=new jc(a);this.va=b;var c=1E4+2E4*Math.random();setTimeout(r(this.qf,this),Math.floor(c))}ic.prototype.qf=function(){var a=this.Vc.get(),b={},c=!1,d;for(d in a)0<a[d]&&Bb(this.yf,d)&&(b[d]=a[d],c=!0);c&&this.va.ye(b);setTimeout(r(this.qf,this),Math.floor(6E5*Math.random()))};function kc(){this.uc={}}function lc(a,b,c){p(c)||(c=1);Bb(a.uc,b)||(a.uc[b]=0);a.uc[b]+=c}kc.prototype.get=function(){return ya(this.uc)};function jc(a){this.Mf=a;this.rd=null}jc.prototype.get=function(){var a=this.Mf.get(),b=ya(a);if(this.rd)for(var c in this.rd)b[c]-=this.rd[c];this.rd=a;return b};var mc={},nc={};function oc(a){a=a.toString();mc[a]||(mc[a]=new kc);return mc[a]}function pc(a,b){var c=a.toString();nc[c]||(nc[c]=b());return nc[c]};function qc(){this.wb=[]}function rc(a,b){for(var c=null,d=0;d<b.length;d++){var e=b[d],f=e.Zb();null===c||f.ca(c.Zb())||(a.wb.push(c),c=null);null===c&&(c=new sc(f));c.add(e)}c&&a.wb.push(c)}function tc(a,b,c){rc(a,c);uc(a,function(a){return a.ca(b)})}function vc(a,b,c){rc(a,c);uc(a,function(a){return a.contains(b)||b.contains(a)})}
function uc(a,b){for(var c=!0,d=0;d<a.wb.length;d++){var e=a.wb[d];if(e)if(e=e.Zb(),b(e)){for(var e=a.wb[d],f=0;f<e.hd.length;f++){var h=e.hd[f];if(null!==h){e.hd[f]=null;var k=h.Ub();wc&&E("event: "+h.toString());Tb(k)}}a.wb[d]=null}else c=!1}c&&(a.wb=[])}function sc(a){this.qa=a;this.hd=[]}sc.prototype.add=function(a){this.hd.push(a)};sc.prototype.Zb=function(){return this.qa};function xc(a,b,c,d){this.ae=b;this.Md=c;this.Dd=d;this.gd=a}xc.prototype.Zb=function(){var a=this.Md.xb();return"value"===this.gd?a.path:a.getParent().path};xc.prototype.ge=function(){return this.gd};xc.prototype.Ub=function(){return this.ae.Ub(this)};xc.prototype.toString=function(){return this.Zb().toString()+":"+this.gd+":"+B(this.Md.Te())};function yc(a,b,c){this.ae=a;this.error=b;this.path=c}yc.prototype.Zb=function(){return this.path};yc.prototype.ge=function(){return"cancel"};
yc.prototype.Ub=function(){return this.ae.Ub(this)};yc.prototype.toString=function(){return this.path.toString()+":cancel"};function zc(){}zc.prototype.We=function(){return null};zc.prototype.fe=function(){return null};var Ac=new zc;function Bc(a,b,c){this.Ff=a;this.Na=b;this.yd=c}Bc.prototype.We=function(a){var b=this.Na.O;if(Cc(b,a))return b.j().R(a);b=null!=this.yd?new Dc(this.yd,!0,!1):this.Na.u();return this.Ff.rc(a,b)};Bc.prototype.fe=function(a,b,c){var d=null!=this.yd?this.yd:Ec(this.Na);a=this.Ff.Xd(d,b,1,c,a);return 0===a.length?null:a[0]};function I(a,b,c,d){this.type=a;this.Ma=b;this.Za=c;this.qe=d;this.Dd=void 0}function Fc(a){return new I(Gc,a)}var Gc="value";function Dc(a,b,c){this.A=a;this.ea=b;this.Tb=c}function Hc(a){return a.ea}function Ic(a){return a.Tb}function Jc(a,b){return b.e()?a.ea&&!a.Tb:Cc(a,J(b))}function Cc(a,b){return a.ea&&!a.Tb||a.A.Fa(b)}Dc.prototype.j=function(){return this.A};function Kc(a,b){return Lc(a.name,b.name)}function Mc(a,b){return Lc(a,b)};function K(a,b){this.name=a;this.S=b}function Nc(a,b){return new K(a,b)};function Oc(a,b){return a&&"object"===typeof a?(H(".sv"in a,"Unexpected leaf node or priority contents"),b[a[".sv"]]):a}function Pc(a,b){var c=new Qc;Rc(a,new L(""),function(a,e){Sc(c,a,Tc(e,b))});return c}function Tc(a,b){var c=a.C().H(),c=Oc(c,b),d;if(a.J()){var e=Oc(a.Ea(),b);return e!==a.Ea()||c!==a.C().H()?new Uc(e,M(c)):a}d=a;c!==a.C().H()&&(d=d.ga(new Uc(c)));a.P(N,function(a,c){var e=Tc(c,b);e!==c&&(d=d.U(a,e))});return d};var Vc=function(){var a=1;return function(){return a++}}(),H=Kb,Wc=Lb;
function Xc(a){try{var b;if("undefined"!==typeof atob)b=atob(a);else{bb();for(var c=$a,d=[],e=0;e<a.length;){var f=c[a.charAt(e++)],h=e<a.length?c[a.charAt(e)]:0;++e;var k=e<a.length?c[a.charAt(e)]:64;++e;var m=e<a.length?c[a.charAt(e)]:64;++e;if(null==f||null==h||null==k||null==m)throw Error();d.push(f<<2|h>>4);64!=k&&(d.push(h<<4&240|k>>2),64!=m&&d.push(k<<6&192|m))}if(8192>d.length)b=String.fromCharCode.apply(null,d);else{a="";for(c=0;c<d.length;c+=8192)a+=String.fromCharCode.apply(null,Ra(d,c,
c+8192));b=a}}return b}catch(l){E("base64Decode failed: ",l)}return null}function Yc(a){var b=Mb(a);a=new ma;a.update(b);var b=[],c=8*a.Pd;56>a.ac?a.update(a.zd,56-a.ac):a.update(a.zd,a.Ya-(a.ac-56));for(var d=a.Ya-1;56<=d;d--)a.Wd[d]=c&255,c/=256;na(a,a.Wd);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c]=a.N[d]>>e&255,++c;return ab(b)}
function Zc(a){for(var b="",c=0;c<arguments.length;c++)b=ea(arguments[c])?b+Zc.apply(null,arguments[c]):"object"===typeof arguments[c]?b+B(arguments[c]):b+arguments[c],b+=" ";return b}var wc=null,$c=!0;
function ad(a,b){Kb(!b||!0===a||!1===a,"Can't turn on custom loggers persistently.");!0===a?("undefined"!==typeof console&&("function"===typeof console.log?wc=r(console.log,console):"object"===typeof console.log&&(wc=function(a){console.log(a)})),b&&Yb.set("logging_enabled",!0)):ga(a)?wc=a:(wc=null,Yb.remove("logging_enabled"))}function E(a){!0===$c&&($c=!1,null===wc&&!0===Yb.get("logging_enabled")&&ad(!0));if(wc){var b=Zc.apply(null,arguments);wc(b)}}
function bd(a){return function(){E(a,arguments)}}function cd(a){if("undefined"!==typeof console){var b="FIREBASE INTERNAL ERROR: "+Zc.apply(null,arguments);"undefined"!==typeof console.error?console.error(b):console.log(b)}}function dd(a){var b=Zc.apply(null,arguments);throw Error("FIREBASE FATAL ERROR: "+b);}function O(a){if("undefined"!==typeof console){var b="FIREBASE WARNING: "+Zc.apply(null,arguments);"undefined"!==typeof console.warn?console.warn(b):console.log(b)}}
function ed(a){var b,c,d,e,f,h=a;f=c=a=b="";d=!0;e="https";if(q(h)){var k=h.indexOf("//");0<=k&&(e=h.substring(0,k-1),h=h.substring(k+2));k=h.indexOf("/");-1===k&&(k=h.length);b=h.substring(0,k);f="";h=h.substring(k).split("/");for(k=0;k<h.length;k++)if(0<h[k].length){var m=h[k];try{m=decodeURIComponent(m.replace(/\+/g," "))}catch(l){}f+="/"+m}h=b.split(".");3===h.length?(a=h[1],c=h[0].toLowerCase()):2===h.length&&(a=h[0]);k=b.indexOf(":");0<=k&&(d="https"===e||"wss"===e)}"firebase"===a&&dd(b+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");
c&&"undefined"!=c||dd("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com");d||"undefined"!==typeof window&&window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:")&&O("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");return{kc:new fc(b,d,c,"ws"===e||"wss"===e),path:new L(f)}}function fd(a){return fa(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}
function gd(a){if("complete"===document.readyState)a();else{var b=!1,c=function(){document.body?b||(b=!0,a()):setTimeout(c,Math.floor(10))};document.addEventListener?(document.addEventListener("DOMContentLoaded",c,!1),window.addEventListener("load",c,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&c()}),window.attachEvent("onload",c))}}
function Lc(a,b){if(a===b)return 0;if("[MIN_NAME]"===a||"[MAX_NAME]"===b)return-1;if("[MIN_NAME]"===b||"[MAX_NAME]"===a)return 1;var c=hd(a),d=hd(b);return null!==c?null!==d?0==c-d?a.length-b.length:c-d:-1:null!==d?1:a<b?-1:1}function id(a,b){if(b&&a in b)return b[a];throw Error("Missing required key ("+a+") in object: "+B(b));}
function jd(a){if("object"!==typeof a||null===a)return B(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=B(b[d]),c+=":",c+=jd(a[b[d]]);return c+"}"}function kd(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}function ld(a,b){if(da(a))for(var c=0;c<a.length;++c)b(c,a[c]);else t(a,b)}
function md(a){H(!fd(a),"Invalid JSON number");var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;--a)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;--a)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&
(d="0"+d),c+=d;return c.toLowerCase()}var nd=/^-?\d{1,10}$/;function hd(a){return nd.test(a)&&(a=Number(a),-2147483648<=a&&2147483647>=a)?a:null}function Tb(a){try{a()}catch(b){setTimeout(function(){O("Exception was thrown by user callback.",b.stack||"");throw b;},Math.floor(0))}}function od(a,b,c){Object.defineProperty(a,b,{get:c})};function pd(a){var b={};try{var c=a.split(".");Ob(Xc(c[0])||"");b=Ob(Xc(c[1])||"");delete b.d}catch(d){}a=b;return"object"===typeof a&&!0===x(a,"admin")};var qd=null;"undefined"!==typeof MozWebSocket?qd=MozWebSocket:"undefined"!==typeof WebSocket&&(qd=WebSocket);function rd(a,b,c,d){this.Zd=a;this.f=bd(this.Zd);this.frames=this.Ac=null;this.qb=this.rb=this.Fe=0;this.Xa=oc(b);a={v:"5"};"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");c&&(a.s=c);d&&(a.ls=d);this.Me=hc(b,"websocket",a)}var td;
rd.prototype.open=function(a,b){this.kb=b;this.gg=a;this.f("Websocket connecting to "+this.Me);this.xc=!1;Xb.set("previous_websocket_failure",!0);try{this.La=new qd(this.Me)}catch(c){this.f("Error instantiating WebSocket.");var d=c.message||c.data;d&&this.f(d);this.fb();return}var e=this;this.La.onopen=function(){e.f("Websocket connected.");e.xc=!0};this.La.onclose=function(){e.f("Websocket connection was disconnected.");e.La=null;e.fb()};this.La.onmessage=function(a){if(null!==e.La)if(a=a.data,e.qb+=
a.length,lc(e.Xa,"bytes_received",a.length),ud(e),null!==e.frames)vd(e,a);else{a:{H(null===e.frames,"We already have a frame buffer");if(6>=a.length){var b=Number(a);if(!isNaN(b)){e.Fe=b;e.frames=[];a=null;break a}}e.Fe=1;e.frames=[]}null!==a&&vd(e,a)}};this.La.onerror=function(a){e.f("WebSocket error.  Closing connection.");(a=a.message||a.data)&&e.f(a);e.fb()}};rd.prototype.start=function(){};
rd.isAvailable=function(){var a=!1;if("undefined"!==typeof navigator&&navigator.userAgent){var b=navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);b&&1<b.length&&4.4>parseFloat(b[1])&&(a=!0)}return!a&&null!==qd&&!td};rd.responsesRequiredToBeHealthy=2;rd.healthyTimeout=3E4;g=rd.prototype;g.sd=function(){Xb.remove("previous_websocket_failure")};function vd(a,b){a.frames.push(b);if(a.frames.length==a.Fe){var c=a.frames.join("");a.frames=null;c=Ob(c);a.gg(c)}}
g.send=function(a){ud(this);a=B(a);this.rb+=a.length;lc(this.Xa,"bytes_sent",a.length);a=kd(a,16384);1<a.length&&wd(this,String(a.length));for(var b=0;b<a.length;b++)wd(this,a[b])};g.Tc=function(){this.Bb=!0;this.Ac&&(clearInterval(this.Ac),this.Ac=null);this.La&&(this.La.close(),this.La=null)};g.fb=function(){this.Bb||(this.f("WebSocket is closing itself"),this.Tc(),this.kb&&(this.kb(this.xc),this.kb=null))};g.close=function(){this.Bb||(this.f("WebSocket is being closed"),this.Tc())};
function ud(a){clearInterval(a.Ac);a.Ac=setInterval(function(){a.La&&wd(a,"0");ud(a)},Math.floor(45E3))}function wd(a,b){try{a.La.send(b)}catch(c){a.f("Exception thrown from WebSocket.send():",c.message||c.data,"Closing connection."),setTimeout(r(a.fb,a),0)}};function xd(a,b,c){this.f=bd("p:rest:");this.M=a;this.Hb=b;this.Vd=c;this.$={}}function yd(a,b){if(p(b))return"tag$"+b;H(zd(a.n),"should have a tag if it's not a default query.");return a.path.toString()}g=xd.prototype;
g.cf=function(a,b,c,d){var e=a.path.toString();this.f("Listen called for "+e+" "+a.ya());var f=yd(a,c),h={};this.$[f]=h;a=Ad(a.n);var k=this;Bd(this,e+".json",a,function(a,b){var u=b;404===a&&(a=u=null);null===a&&k.Hb(e,u,!1,c);x(k.$,f)===h&&d(a?401==a?"permission_denied":"rest_error:"+a:"ok",null)})};g.Df=function(a,b){var c=yd(a,b);delete this.$[c]};g.pf=function(){};g.re=function(){};g.ff=function(){};g.xd=function(){};g.put=function(){};g.df=function(){};g.ye=function(){};
function Bd(a,b,c,d){c=c||{};c.format="export";a.Vd.getToken(!1).then(function(e){(e=e&&e.accessToken)&&(c.auth=e);var f=(a.M.Sc?"https://":"http://")+a.M.host+b+"?"+Fb(c);a.f("Sending REST request for "+f);var h=new XMLHttpRequest;h.onreadystatechange=function(){if(d&&4===h.readyState){a.f("REST Response for "+f+" received. status:",h.status,"response:",h.responseText);var b=null;if(200<=h.status&&300>h.status){try{b=Ob(h.responseText)}catch(c){O("Failed to parse JSON response for "+f+": "+h.responseText)}d(null,
b)}else 401!==h.status&&404!==h.status&&O("Got unsuccessful REST response for "+f+" Status: "+h.status),d(h.status);d=null}};h.open("GET",f,!0);h.send()})};function Cd(a,b,c){this.type=Dd;this.source=a;this.path=b;this.children=c}Cd.prototype.Nc=function(a){if(this.path.e())return a=this.children.subtree(new L(a)),a.e()?null:a.value?new Zb(this.source,C,a.value):new Cd(this.source,C,a);H(J(this.path)===a,"Can't get a merge for a child not on the path of the operation");return new Cd(this.source,D(this.path),this.children)};Cd.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"};function Ed(){this.hb={}}
function Fd(a,b){var c=b.type,d=b.Za;H("child_added"==c||"child_changed"==c||"child_removed"==c,"Only child changes supported for tracking");H(".priority"!==d,"Only non-priority child changes can be tracked.");var e=x(a.hb,d);if(e){var f=e.type;if("child_added"==c&&"child_removed"==f)a.hb[d]=new I("child_changed",b.Ma,d,e.Ma);else if("child_removed"==c&&"child_added"==f)delete a.hb[d];else if("child_removed"==c&&"child_changed"==f)a.hb[d]=new I("child_removed",e.qe,d);else if("child_changed"==c&&
"child_added"==f)a.hb[d]=new I("child_added",b.Ma,d);else if("child_changed"==c&&"child_changed"==f)a.hb[d]=new I("child_changed",b.Ma,d,e.qe);else throw Wc("Illegal combination of changes: "+b+" occurred after "+e);}else a.hb[d]=b};function Gd(a){this.W=a;this.g=a.n.g}function Hd(a,b,c,d){var e=[],f=[];Ja(b,function(b){"child_changed"===b.type&&a.g.nd(b.qe,b.Ma)&&f.push(new I("child_moved",b.Ma,b.Za))});Id(a,e,"child_removed",b,d,c);Id(a,e,"child_added",b,d,c);Id(a,e,"child_moved",f,d,c);Id(a,e,"child_changed",b,d,c);Id(a,e,Gc,b,d,c);return e}function Id(a,b,c,d,e,f){d=Ka(d,function(a){return a.type===c});Sa(d,r(a.Nf,a));Ja(d,function(c){var d=Jd(a,c,f);Ja(e,function(e){e.sf(c.type)&&b.push(e.createEvent(d,a.W))})})}
function Jd(a,b,c){"value"!==b.type&&"child_removed"!==b.type&&(b.Dd=c.Ye(b.Za,b.Ma,a.g));return b}Gd.prototype.Nf=function(a,b){if(null==a.Za||null==b.Za)throw Wc("Should only compare child_ events.");return this.g.compare(new K(a.Za,a.Ma),new K(b.Za,b.Ma))};function Kd(a,b){this.Sd=a;this.Lf=b}function Ld(a){this.V=a}
Ld.prototype.gb=function(a,b,c,d){var e=new Ed,f;if(b.type===$b)b.source.ee?c=Md(this,a,b.path,b.Ja,c,d,e):(H(b.source.Ve,"Unknown source."),f=b.source.Ee||Ic(a.u())&&!b.path.e(),c=Nd(this,a,b.path,b.Ja,c,d,f,e));else if(b.type===Dd)b.source.ee?c=Od(this,a,b.path,b.children,c,d,e):(H(b.source.Ve,"Unknown source."),f=b.source.Ee||Ic(a.u()),c=Pd(this,a,b.path,b.children,c,d,f,e));else if(b.type===Qd)if(b.Id)if(b=b.path,null!=c.mc(b))c=a;else{f=new Bc(c,a,d);d=a.O.j();if(b.e()||".priority"===J(b))Hc(a.u())?
b=c.Ba(Ec(a)):(b=a.u().j(),H(b instanceof P,"serverChildren would be complete if leaf node"),b=c.sc(b)),b=this.V.za(d,b,e);else{var h=J(b),k=c.rc(h,a.u());null==k&&Cc(a.u(),h)&&(k=d.R(h));b=null!=k?this.V.F(d,h,k,D(b),f,e):a.O.j().Fa(h)?this.V.F(d,h,F,D(b),f,e):d;b.e()&&Hc(a.u())&&(d=c.Ba(Ec(a)),d.J()&&(b=this.V.za(b,d,e)))}d=Hc(a.u())||null!=c.mc(C);c=Rd(a,b,d,this.V.Qa())}else c=Sd(this,a,b.path,b.Pb,c,d,e);else if(b.type===bc)d=b.path,b=a.u(),f=b.j(),h=b.ea||d.e(),c=Td(this,new Ud(a.O,new Dc(f,
h,b.Tb)),d,c,Ac,e);else throw Wc("Unknown operation type: "+b.type);e=sa(e.hb);d=c;b=d.O;b.ea&&(f=b.j().J()||b.j().e(),h=Vd(a),(0<e.length||!a.O.ea||f&&!b.j().ca(h)||!b.j().C().ca(h.C()))&&e.push(Fc(Vd(d))));return new Kd(c,e)};
function Td(a,b,c,d,e,f){var h=b.O;if(null!=d.mc(c))return b;var k;if(c.e())H(Hc(b.u()),"If change path is empty, we must have complete server data"),Ic(b.u())?(e=Ec(b),d=d.sc(e instanceof P?e:F)):d=d.Ba(Ec(b)),f=a.V.za(b.O.j(),d,f);else{var m=J(c);if(".priority"==m)H(1==Wd(c),"Can't have a priority with additional path components"),f=h.j(),k=b.u().j(),d=d.$c(c,f,k),f=null!=d?a.V.ga(f,d):h.j();else{var l=D(c);Cc(h,m)?(k=b.u().j(),d=d.$c(c,h.j(),k),d=null!=d?h.j().R(m).F(l,d):h.j().R(m)):d=d.rc(m,
b.u());f=null!=d?a.V.F(h.j(),m,d,l,e,f):h.j()}}return Rd(b,f,h.ea||c.e(),a.V.Qa())}function Nd(a,b,c,d,e,f,h,k){var m=b.u();h=h?a.V:a.V.Vb();if(c.e())d=h.za(m.j(),d,null);else if(h.Qa()&&!m.Tb)d=m.j().F(c,d),d=h.za(m.j(),d,null);else{var l=J(c);if(!Jc(m,c)&&1<Wd(c))return b;var u=D(c);d=m.j().R(l).F(u,d);d=".priority"==l?h.ga(m.j(),d):h.F(m.j(),l,d,u,Ac,null)}m=m.ea||c.e();b=new Ud(b.O,new Dc(d,m,h.Qa()));return Td(a,b,c,e,new Bc(e,b,f),k)}
function Md(a,b,c,d,e,f,h){var k=b.O;e=new Bc(e,b,f);if(c.e())h=a.V.za(b.O.j(),d,h),a=Rd(b,h,!0,a.V.Qa());else if(f=J(c),".priority"===f)h=a.V.ga(b.O.j(),d),a=Rd(b,h,k.ea,k.Tb);else{c=D(c);var m=k.j().R(f);if(!c.e()){var l=e.We(f);d=null!=l?".priority"===Xd(c)&&l.Q(c.parent()).e()?l:l.F(c,d):F}m.ca(d)?a=b:(h=a.V.F(k.j(),f,d,c,e,h),a=Rd(b,h,k.ea,a.V.Qa()))}return a}
function Od(a,b,c,d,e,f,h){var k=b;Yd(d,function(d,l){var u=c.m(d);Cc(b.O,J(u))&&(k=Md(a,k,u,l,e,f,h))});Yd(d,function(d,l){var u=c.m(d);Cc(b.O,J(u))||(k=Md(a,k,u,l,e,f,h))});return k}function Zd(a,b){Yd(b,function(b,d){a=a.F(b,d)});return a}
function Pd(a,b,c,d,e,f,h,k){if(b.u().j().e()&&!Hc(b.u()))return b;var m=b;c=c.e()?d:$d(Q,c,d);var l=b.u().j();c.children.ia(function(c,d){if(l.Fa(c)){var G=b.u().j().R(c),G=Zd(G,d);m=Nd(a,m,new L(c),G,e,f,h,k)}});c.children.ia(function(c,d){var G=!Cc(b.u(),c)&&null==d.value;l.Fa(c)||G||(G=b.u().j().R(c),G=Zd(G,d),m=Nd(a,m,new L(c),G,e,f,h,k))});return m}
function Sd(a,b,c,d,e,f,h){if(null!=e.mc(c))return b;var k=Ic(b.u()),m=b.u();if(null!=d.value){if(c.e()&&m.ea||Jc(m,c))return Nd(a,b,c,m.j().Q(c),e,f,k,h);if(c.e()){var l=Q;m.j().P(ae,function(a,b){l=l.set(new L(a),b)});return Pd(a,b,c,l,e,f,k,h)}return b}l=Q;Yd(d,function(a){var b=c.m(a);Jc(m,b)&&(l=l.set(a,m.j().Q(b)))});return Pd(a,b,c,l,e,f,k,h)};function be(a){this.g=a}g=be.prototype;g.F=function(a,b,c,d,e,f){H(a.zc(this.g),"A node must be indexed if only a child is updated");e=a.R(b);if(e.Q(d).ca(c.Q(d))&&e.e()==c.e())return a;null!=f&&(c.e()?a.Fa(b)?Fd(f,new I("child_removed",e,b)):H(a.J(),"A child remove without an old child only makes sense on a leaf node"):e.e()?Fd(f,new I("child_added",c,b)):Fd(f,new I("child_changed",c,b,e)));return a.J()&&c.e()?a:a.U(b,c).ob(this.g)};
g.za=function(a,b,c){null!=c&&(a.J()||a.P(N,function(a,e){b.Fa(a)||Fd(c,new I("child_removed",e,a))}),b.J()||b.P(N,function(b,e){if(a.Fa(b)){var f=a.R(b);f.ca(e)||Fd(c,new I("child_changed",e,b,f))}else Fd(c,new I("child_added",e,b))}));return b.ob(this.g)};g.ga=function(a,b){return a.e()?F:a.ga(b)};g.Qa=function(){return!1};g.Vb=function(){return this};function ce(a){this.he=new be(a.g);this.g=a.g;var b;a.ka?(b=de(a),b=a.g.Fc(ee(a),b)):b=a.g.Ic();this.Uc=b;a.na?(b=fe(a),a=a.g.Fc(ge(a),b)):a=a.g.Gc();this.wc=a}g=ce.prototype;g.matches=function(a){return 0>=this.g.compare(this.Uc,a)&&0>=this.g.compare(a,this.wc)};g.F=function(a,b,c,d,e,f){this.matches(new K(b,c))||(c=F);return this.he.F(a,b,c,d,e,f)};
g.za=function(a,b,c){b.J()&&(b=F);var d=b.ob(this.g),d=d.ga(F),e=this;b.P(N,function(a,b){e.matches(new K(a,b))||(d=d.U(a,F))});return this.he.za(a,d,c)};g.ga=function(a){return a};g.Qa=function(){return!0};g.Vb=function(){return this.he};function he(a){this.sa=new ce(a);this.g=a.g;H(a.xa,"Only valid if limit has been set");this.oa=a.oa;this.Jb=!ie(a)}g=he.prototype;g.F=function(a,b,c,d,e,f){this.sa.matches(new K(b,c))||(c=F);return a.R(b).ca(c)?a:a.Fb()<this.oa?this.sa.Vb().F(a,b,c,d,e,f):je(this,a,b,c,e,f)};
g.za=function(a,b,c){var d;if(b.J()||b.e())d=F.ob(this.g);else if(2*this.oa<b.Fb()&&b.zc(this.g)){d=F.ob(this.g);b=this.Jb?b.$b(this.sa.wc,this.g):b.Yb(this.sa.Uc,this.g);for(var e=0;0<b.Sa.length&&e<this.oa;){var f=R(b),h;if(h=this.Jb?0>=this.g.compare(this.sa.Uc,f):0>=this.g.compare(f,this.sa.wc))d=d.U(f.name,f.S),e++;else break}}else{d=b.ob(this.g);d=d.ga(F);var k,m,l;if(this.Jb){b=d.Ze(this.g);k=this.sa.wc;m=this.sa.Uc;var u=ke(this.g);l=function(a,b){return u(b,a)}}else b=d.Xb(this.g),k=this.sa.Uc,
m=this.sa.wc,l=ke(this.g);for(var e=0,z=!1;0<b.Sa.length;)f=R(b),!z&&0>=l(k,f)&&(z=!0),(h=z&&e<this.oa&&0>=l(f,m))?e++:d=d.U(f.name,F)}return this.sa.Vb().za(a,d,c)};g.ga=function(a){return a};g.Qa=function(){return!0};g.Vb=function(){return this.sa.Vb()};
function je(a,b,c,d,e,f){var h;if(a.Jb){var k=ke(a.g);h=function(a,b){return k(b,a)}}else h=ke(a.g);H(b.Fb()==a.oa,"");var m=new K(c,d),l=a.Jb?le(b,a.g):me(b,a.g),u=a.sa.matches(m);if(b.Fa(c)){for(var z=b.R(c),l=e.fe(a.g,l,a.Jb);null!=l&&(l.name==c||b.Fa(l.name));)l=e.fe(a.g,l,a.Jb);e=null==l?1:h(l,m);if(u&&!d.e()&&0<=e)return null!=f&&Fd(f,new I("child_changed",d,c,z)),b.U(c,d);null!=f&&Fd(f,new I("child_removed",z,c));b=b.U(c,F);return null!=l&&a.sa.matches(l)?(null!=f&&Fd(f,new I("child_added",
l.S,l.name)),b.U(l.name,l.S)):b}return d.e()?b:u&&0<=h(l,m)?(null!=f&&(Fd(f,new I("child_removed",l.S,l.name)),Fd(f,new I("child_added",d,c))),b.U(c,d).U(l.name,F)):b};function Uc(a,b){this.B=a;H(p(this.B)&&null!==this.B,"LeafNode shouldn't be created with null/undefined value.");this.aa=b||F;ne(this.aa);this.Eb=null}var oe=["object","boolean","number","string"];g=Uc.prototype;g.J=function(){return!0};g.C=function(){return this.aa};g.ga=function(a){return new Uc(this.B,a)};g.R=function(a){return".priority"===a?this.aa:F};g.Q=function(a){return a.e()?this:".priority"===J(a)?this.aa:F};g.Fa=function(){return!1};g.Ye=function(){return null};
g.U=function(a,b){return".priority"===a?this.ga(b):b.e()&&".priority"!==a?this:F.U(a,b).ga(this.aa)};g.F=function(a,b){var c=J(a);if(null===c)return b;if(b.e()&&".priority"!==c)return this;H(".priority"!==c||1===Wd(a),".priority must be the last token in a path");return this.U(c,F.F(D(a),b))};g.e=function(){return!1};g.Fb=function(){return 0};g.P=function(){return!1};g.H=function(a){return a&&!this.C().e()?{".value":this.Ea(),".priority":this.C().H()}:this.Ea()};
g.hash=function(){if(null===this.Eb){var a="";this.aa.e()||(a+="priority:"+pe(this.aa.H())+":");var b=typeof this.B,a=a+(b+":"),a="number"===b?a+md(this.B):a+this.B;this.Eb=Yc(a)}return this.Eb};g.Ea=function(){return this.B};g.tc=function(a){if(a===F)return 1;if(a instanceof P)return-1;H(a.J(),"Unknown node type");var b=typeof a.B,c=typeof this.B,d=Ia(oe,b),e=Ia(oe,c);H(0<=d,"Unknown leaf type: "+b);H(0<=e,"Unknown leaf type: "+c);return d===e?"object"===c?0:this.B<a.B?-1:this.B===a.B?0:1:e-d};
g.ob=function(){return this};g.zc=function(){return!0};g.ca=function(a){return a===this?!0:a.J()?this.B===a.B&&this.aa.ca(a.aa):!1};g.toString=function(){return B(this.H(!0))};function qe(){}var re={};function ke(a){return r(a.compare,a)}qe.prototype.nd=function(a,b){return 0!==this.compare(new K("[MIN_NAME]",a),new K("[MIN_NAME]",b))};qe.prototype.Ic=function(){return se};function te(a){H(!a.e()&&".priority"!==J(a),"Can't create PathIndex with empty path or .priority key");this.cc=a}ka(te,qe);g=te.prototype;g.yc=function(a){return!a.Q(this.cc).e()};g.compare=function(a,b){var c=a.S.Q(this.cc),d=b.S.Q(this.cc),c=c.tc(d);return 0===c?Lc(a.name,b.name):c};
g.Fc=function(a,b){var c=M(a),c=F.F(this.cc,c);return new K(b,c)};g.Gc=function(){var a=F.F(this.cc,ue);return new K("[MAX_NAME]",a)};g.toString=function(){return this.cc.slice().join("/")};function ve(){}ka(ve,qe);g=ve.prototype;g.compare=function(a,b){var c=a.S.C(),d=b.S.C(),c=c.tc(d);return 0===c?Lc(a.name,b.name):c};g.yc=function(a){return!a.C().e()};g.nd=function(a,b){return!a.C().ca(b.C())};g.Ic=function(){return se};g.Gc=function(){return new K("[MAX_NAME]",new Uc("[PRIORITY-POST]",ue))};
g.Fc=function(a,b){var c=M(a);return new K(b,new Uc("[PRIORITY-POST]",c))};g.toString=function(){return".priority"};var N=new ve;function we(){}ka(we,qe);g=we.prototype;g.compare=function(a,b){return Lc(a.name,b.name)};g.yc=function(){throw Wc("KeyIndex.isDefinedOn not expected to be called.");};g.nd=function(){return!1};g.Ic=function(){return se};g.Gc=function(){return new K("[MAX_NAME]",F)};g.Fc=function(a){H(q(a),"KeyIndex indexValue must always be a string.");return new K(a,F)};g.toString=function(){return".key"};
var ae=new we;function xe(){}ka(xe,qe);g=xe.prototype;g.compare=function(a,b){var c=a.S.tc(b.S);return 0===c?Lc(a.name,b.name):c};g.yc=function(){return!0};g.nd=function(a,b){return!a.ca(b)};g.Ic=function(){return se};g.Gc=function(){return ye};g.Fc=function(a,b){var c=M(a);return new K(b,c)};g.toString=function(){return".value"};var ze=new xe;function Ae(){this.Sb=this.na=this.Lb=this.ka=this.xa=!1;this.oa=0;this.oc="";this.ec=null;this.Ab="";this.bc=null;this.yb="";this.g=N}var Be=new Ae;function ie(a){return""===a.oc?a.ka:"l"===a.oc}function ee(a){H(a.ka,"Only valid if start has been set");return a.ec}function de(a){H(a.ka,"Only valid if start has been set");return a.Lb?a.Ab:"[MIN_NAME]"}function ge(a){H(a.na,"Only valid if end has been set");return a.bc}
function fe(a){H(a.na,"Only valid if end has been set");return a.Sb?a.yb:"[MAX_NAME]"}function Ce(a){var b=new Ae;b.xa=a.xa;b.oa=a.oa;b.ka=a.ka;b.ec=a.ec;b.Lb=a.Lb;b.Ab=a.Ab;b.na=a.na;b.bc=a.bc;b.Sb=a.Sb;b.yb=a.yb;b.g=a.g;return b}g=Ae.prototype;g.ne=function(a){var b=Ce(this);b.xa=!0;b.oa=a;b.oc="l";return b};g.oe=function(a){var b=Ce(this);b.xa=!0;b.oa=a;b.oc="r";return b};g.Nd=function(a,b){var c=Ce(this);c.ka=!0;p(a)||(a=null);c.ec=a;null!=b?(c.Lb=!0,c.Ab=b):(c.Lb=!1,c.Ab="");return c};
g.fd=function(a,b){var c=Ce(this);c.na=!0;p(a)||(a=null);c.bc=a;p(b)?(c.Sb=!0,c.yb=b):(c.Eg=!1,c.yb="");return c};function De(a,b){var c=Ce(a);c.g=b;return c}function Ee(a){var b={};a.ka&&(b.sp=a.ec,a.Lb&&(b.sn=a.Ab));a.na&&(b.ep=a.bc,a.Sb&&(b.en=a.yb));if(a.xa){b.l=a.oa;var c=a.oc;""===c&&(c=ie(a)?"l":"r");b.vf=c}a.g!==N&&(b.i=a.g.toString());return b}function S(a){return!(a.ka||a.na||a.xa)}function zd(a){return S(a)&&a.g==N}
function Ad(a){var b={};if(zd(a))return b;var c;a.g===N?c="$priority":a.g===ze?c="$value":a.g===ae?c="$key":(H(a.g instanceof te,"Unrecognized index type!"),c=a.g.toString());b.orderBy=B(c);a.ka&&(b.startAt=B(a.ec),a.Lb&&(b.startAt+=","+B(a.Ab)));a.na&&(b.endAt=B(a.bc),a.Sb&&(b.endAt+=","+B(a.yb)));a.xa&&(ie(a)?b.limitToFirst=a.oa:b.limitToLast=a.oa);return b}g.toString=function(){return B(Ee(this))};function Fe(a,b){this.od=a;this.dc=b}Fe.prototype.get=function(a){var b=x(this.od,a);if(!b)throw Error("No index defined for "+a);return b===re?null:b};function Ge(a,b,c){var d=oa(a.od,function(d,f){var h=x(a.dc,f);H(h,"Missing index implementation for "+f);if(d===re){if(h.yc(b.S)){for(var k=[],m=c.Xb(Nc),l=R(m);l;)l.name!=b.name&&k.push(l),l=R(m);k.push(b);return He(k,ke(h))}return re}h=c.get(b.name);k=d;h&&(k=k.remove(new K(b.name,h)));return k.Ra(b,b.S)});return new Fe(d,a.dc)}
function Ie(a,b,c){var d=oa(a.od,function(a){if(a===re)return a;var d=c.get(b.name);return d?a.remove(new K(b.name,d)):a});return new Fe(d,a.dc)}var Je=new Fe({".priority":re},{".priority":N});function Ke(){this.set={}}g=Ke.prototype;g.add=function(a,b){this.set[a]=null!==b?b:!0};g.contains=function(a){return Bb(this.set,a)};g.get=function(a){return this.contains(a)?this.set[a]:void 0};g.remove=function(a){delete this.set[a]};g.clear=function(){this.set={}};g.e=function(){return xa(this.set)};g.count=function(){return qa(this.set)};function Le(a,b){t(a.set,function(a,d){b(d,a)})}g.keys=function(){var a=[];t(this.set,function(b,c){a.push(c)});return a};function Me(a,b,c,d){this.Zd=a;this.f=bd(a);this.kc=b;this.qb=this.rb=0;this.Xa=oc(b);this.Af=c;this.xc=!1;this.Db=d;this.Yc=function(a){return hc(b,"long_polling",a)}}var Ne,Oe;
Me.prototype.open=function(a,b){this.Pe=0;this.ja=b;this.ef=new Qb(a);this.Bb=!1;var c=this;this.tb=setTimeout(function(){c.f("Timed out trying to connect.");c.fb();c.tb=null},Math.floor(3E4));gd(function(){if(!c.Bb){c.Wa=new Pe(function(a,b,d,k,m){Qe(c,arguments);if(c.Wa)if(c.tb&&(clearTimeout(c.tb),c.tb=null),c.xc=!0,"start"==a)c.id=b,c.lf=d;else if("close"===a)b?(c.Wa.Kd=!1,Rb(c.ef,b,function(){c.fb()})):c.fb();else throw Error("Unrecognized command received: "+a);},function(a,b){Qe(c,arguments);
Sb(c.ef,a,b)},function(){c.fb()},c.Yc);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());c.Wa.Qd&&(a.cb=c.Wa.Qd);a.v="5";c.Af&&(a.s=c.Af);c.Db&&(a.ls=c.Db);"undefined"!==typeof location&&location.href&&-1!==location.href.indexOf("firebaseio.com")&&(a.r="f");a=c.Yc(a);c.f("Connecting via long-poll to "+a);Re(c.Wa,a,function(){})}})};
Me.prototype.start=function(){var a=this.Wa,b=this.lf;a.eg=this.id;a.fg=b;for(a.Ud=!0;Se(a););a=this.id;b=this.lf;this.gc=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;this.gc.src=this.Yc(c);this.gc.style.display="none";document.body.appendChild(this.gc)};
Me.isAvailable=function(){return Ne||!Oe&&"undefined"!==typeof document&&null!=document.createElement&&!("object"===typeof window&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))&&!("object"===typeof Windows&&"object"===typeof Windows.Bg)&&!0};g=Me.prototype;g.sd=function(){};g.Tc=function(){this.Bb=!0;this.Wa&&(this.Wa.close(),this.Wa=null);this.gc&&(document.body.removeChild(this.gc),this.gc=null);this.tb&&(clearTimeout(this.tb),this.tb=null)};
g.fb=function(){this.Bb||(this.f("Longpoll is closing itself"),this.Tc(),this.ja&&(this.ja(this.xc),this.ja=null))};g.close=function(){this.Bb||(this.f("Longpoll is being closed."),this.Tc())};g.send=function(a){a=B(a);this.rb+=a.length;lc(this.Xa,"bytes_sent",a.length);a=Mb(a);a=ab(a,!0);a=kd(a,1840);for(var b=0;b<a.length;b++){var c=this.Wa;c.Qc.push({tg:this.Pe,zg:a.length,Re:a[b]});c.Ud&&Se(c);this.Pe++}};function Qe(a,b){var c=B(b).length;a.qb+=c;lc(a.Xa,"bytes_received",c)}
function Pe(a,b,c,d){this.Yc=d;this.kb=c;this.ve=new Ke;this.Qc=[];this.$d=Math.floor(1E8*Math.random());this.Kd=!0;this.Qd=Vc();window["pLPCommand"+this.Qd]=a;window["pRTLPCB"+this.Qd]=b;a=document.createElement("iframe");a.style.display="none";if(document.body){document.body.appendChild(a);try{a.contentWindow.document||E("No IE domain setting required")}catch(e){a.src="javascript:void((function(){document.open();document.domain='"+document.domain+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
a.contentDocument?a.ib=a.contentDocument:a.contentWindow?a.ib=a.contentWindow.document:a.document&&(a.ib=a.document);this.Ga=a;a="";this.Ga.src&&"javascript:"===this.Ga.src.substr(0,11)&&(a='<script>document.domain="'+document.domain+'";\x3c/script>');a="<html><body>"+a+"</body></html>";try{this.Ga.ib.open(),this.Ga.ib.write(a),this.Ga.ib.close()}catch(f){E("frame writing exception"),f.stack&&E(f.stack),E(f)}}
Pe.prototype.close=function(){this.Ud=!1;if(this.Ga){this.Ga.ib.body.innerHTML="";var a=this;setTimeout(function(){null!==a.Ga&&(document.body.removeChild(a.Ga),a.Ga=null)},Math.floor(0))}var b=this.kb;b&&(this.kb=null,b())};
function Se(a){if(a.Ud&&a.Kd&&a.ve.count()<(0<a.Qc.length?2:1)){a.$d++;var b={};b.id=a.eg;b.pw=a.fg;b.ser=a.$d;for(var b=a.Yc(b),c="",d=0;0<a.Qc.length;)if(1870>=a.Qc[0].Re.length+30+c.length){var e=a.Qc.shift(),c=c+"&seg"+d+"="+e.tg+"&ts"+d+"="+e.zg+"&d"+d+"="+e.Re;d++}else break;Te(a,b+c,a.$d);return!0}return!1}function Te(a,b,c){function d(){a.ve.remove(c);Se(a)}a.ve.add(c,1);var e=setTimeout(d,Math.floor(25E3));Re(a,b,function(){clearTimeout(e);d()})}
function Re(a,b,c){setTimeout(function(){try{if(a.Kd){var d=a.Ga.ib.createElement("script");d.type="text/javascript";d.async=!0;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;a&&"loaded"!==a&&"complete"!==a||(d.onload=d.onreadystatechange=null,d.parentNode&&d.parentNode.removeChild(d),c())};d.onerror=function(){E("Long-poll script failed to load: "+b);a.Kd=!1;a.close()};a.Ga.ib.body.appendChild(d)}}catch(e){}},Math.floor(1))};function Ue(a){Ve(this,a)}var We=[Me,rd];function Ve(a,b){var c=rd&&rd.isAvailable(),d=c&&!(Xb.bf||!0===Xb.get("previous_websocket_failure"));b.Ag&&(c||O("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),d=!0);if(d)a.Wc=[rd];else{var e=a.Wc=[];ld(We,function(a,b){b&&b.isAvailable()&&e.push(b)})}}function Xe(a){if(0<a.Wc.length)return a.Wc[0];throw Error("No transports available");};function Ye(a,b,c,d,e,f,h){this.id=a;this.f=bd("c:"+this.id+":");this.te=c;this.Mc=d;this.ja=e;this.se=f;this.M=b;this.Ad=[];this.Ne=0;this.zf=new Ue(b);this.L=0;this.Db=h;this.f("Connection created");Ze(this)}
function Ze(a){var b=Xe(a.zf);a.I=new b("c:"+a.id+":"+a.Ne++,a.M,void 0,a.Db);a.xe=b.responsesRequiredToBeHealthy||0;var c=$e(a,a.I),d=af(a,a.I);a.Xc=a.I;a.Rc=a.I;a.D=null;a.Cb=!1;setTimeout(function(){a.I&&a.I.open(c,d)},Math.floor(0));b=b.healthyTimeout||0;0<b&&(a.md=setTimeout(function(){a.md=null;a.Cb||(a.I&&102400<a.I.qb?(a.f("Connection exceeded healthy timeout but has received "+a.I.qb+" bytes.  Marking connection healthy."),a.Cb=!0,a.I.sd()):a.I&&10240<a.I.rb?a.f("Connection exceeded healthy timeout but has sent "+
a.I.rb+" bytes.  Leaving connection alive."):(a.f("Closing unhealthy connection after timeout."),a.close()))},Math.floor(b)))}function af(a,b){return function(c){b===a.I?(a.I=null,c||0!==a.L?1===a.L&&a.f("Realtime connection lost."):(a.f("Realtime connection failed."),"s-"===a.M.bb.substr(0,2)&&(Xb.remove("host:"+a.M.host),a.M.bb=a.M.host)),a.close()):b===a.D?(a.f("Secondary connection lost."),c=a.D,a.D=null,a.Xc!==c&&a.Rc!==c||a.close()):a.f("closing an old connection")}}
function $e(a,b){return function(c){if(2!=a.L)if(b===a.Rc){var d=id("t",c);c=id("d",c);if("c"==d){if(d=id("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.xf=c.s;gc(a.M,f);0==a.L&&(a.I.start(),bf(a,a.I,d),"5"!==e&&O("Protocol version mismatch detected"),c=a.zf,(c=1<c.Wc.length?c.Wc[1]:null)&&cf(a,c))}else if("n"===d){a.f("recvd end transmission on primary");a.Rc=a.D;for(c=0;c<a.Ad.length;++c)a.wd(a.Ad[c]);a.Ad=[];df(a)}else"s"===d?(a.f("Connection shutdown command received. Shutting down..."),
a.se&&(a.se(c),a.se=null),a.ja=null,a.close()):"r"===d?(a.f("Reset packet received.  New host: "+c),gc(a.M,c),1===a.L?a.close():(ef(a),Ze(a))):"e"===d?cd("Server Error: "+c):"o"===d?(a.f("got pong on primary."),ff(a),gf(a)):cd("Unknown control packet command: "+d)}else"d"==d&&a.wd(c)}else if(b===a.D)if(d=id("t",c),c=id("d",c),"c"==d)"t"in c&&(c=c.t,"a"===c?hf(a):"r"===c?(a.f("Got a reset on secondary, closing it"),a.D.close(),a.Xc!==a.D&&a.Rc!==a.D||a.close()):"o"===c&&(a.f("got pong on secondary."),
a.wf--,hf(a)));else if("d"==d)a.Ad.push(c);else throw Error("Unknown protocol layer: "+d);else a.f("message on old connection")}}Ye.prototype.ua=function(a){jf(this,{t:"d",d:a})};function df(a){a.Xc===a.D&&a.Rc===a.D&&(a.f("cleaning up and promoting a connection: "+a.D.Zd),a.I=a.D,a.D=null)}
function hf(a){0>=a.wf?(a.f("Secondary connection is healthy."),a.Cb=!0,a.D.sd(),a.D.start(),a.f("sending client ack on secondary"),a.D.send({t:"c",d:{t:"a",d:{}}}),a.f("Ending transmission on primary"),a.I.send({t:"c",d:{t:"n",d:{}}}),a.Xc=a.D,df(a)):(a.f("sending ping on secondary."),a.D.send({t:"c",d:{t:"p",d:{}}}))}Ye.prototype.wd=function(a){ff(this);this.te(a)};function ff(a){a.Cb||(a.xe--,0>=a.xe&&(a.f("Primary connection is healthy."),a.Cb=!0,a.I.sd()))}
function cf(a,b){a.D=new b("c:"+a.id+":"+a.Ne++,a.M,a.xf);a.wf=b.responsesRequiredToBeHealthy||0;a.D.open($e(a,a.D),af(a,a.D));setTimeout(function(){a.D&&(a.f("Timed out trying to upgrade."),a.D.close())},Math.floor(6E4))}function bf(a,b,c){a.f("Realtime connection established.");a.I=b;a.L=1;a.Mc&&(a.Mc(c,a.xf),a.Mc=null);0===a.xe?(a.f("Primary connection is healthy."),a.Cb=!0):setTimeout(function(){gf(a)},Math.floor(5E3))}
function gf(a){a.Cb||1!==a.L||(a.f("sending ping on primary."),jf(a,{t:"c",d:{t:"p",d:{}}}))}function jf(a,b){if(1!==a.L)throw"Connection is not connected";a.Xc.send(b)}Ye.prototype.close=function(){2!==this.L&&(this.f("Closing realtime connection."),this.L=2,ef(this),this.ja&&(this.ja(),this.ja=null))};function ef(a){a.f("Shutting down all connections");a.I&&(a.I.close(),a.I=null);a.D&&(a.D.close(),a.D=null);a.md&&(clearTimeout(a.md),a.md=null)};function L(a,b){if(1==arguments.length){this.o=a.split("/");for(var c=0,d=0;d<this.o.length;d++)0<this.o[d].length&&(this.o[c]=this.o[d],c++);this.o.length=c;this.Z=0}else this.o=a,this.Z=b}function T(a,b){var c=J(a);if(null===c)return b;if(c===J(b))return T(D(a),D(b));throw Error("INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")");}
function kf(a,b){for(var c=a.slice(),d=b.slice(),e=0;e<c.length&&e<d.length;e++){var f=Lc(c[e],d[e]);if(0!==f)return f}return c.length===d.length?0:c.length<d.length?-1:1}function J(a){return a.Z>=a.o.length?null:a.o[a.Z]}function Wd(a){return a.o.length-a.Z}function D(a){var b=a.Z;b<a.o.length&&b++;return new L(a.o,b)}function Xd(a){return a.Z<a.o.length?a.o[a.o.length-1]:null}g=L.prototype;
g.toString=function(){for(var a="",b=this.Z;b<this.o.length;b++)""!==this.o[b]&&(a+="/"+this.o[b]);return a||"/"};g.slice=function(a){return this.o.slice(this.Z+(a||0))};g.parent=function(){if(this.Z>=this.o.length)return null;for(var a=[],b=this.Z;b<this.o.length-1;b++)a.push(this.o[b]);return new L(a,0)};
g.m=function(a){for(var b=[],c=this.Z;c<this.o.length;c++)b.push(this.o[c]);if(a instanceof L)for(c=a.Z;c<a.o.length;c++)b.push(a.o[c]);else for(a=a.split("/"),c=0;c<a.length;c++)0<a[c].length&&b.push(a[c]);return new L(b,0)};g.e=function(){return this.Z>=this.o.length};g.ca=function(a){if(Wd(this)!==Wd(a))return!1;for(var b=this.Z,c=a.Z;b<=this.o.length;b++,c++)if(this.o[b]!==a.o[c])return!1;return!0};
g.contains=function(a){var b=this.Z,c=a.Z;if(Wd(this)>Wd(a))return!1;for(;b<this.o.length;){if(this.o[b]!==a.o[c])return!1;++b;++c}return!0};var C=new L("");function lf(a,b){this.Ta=a.slice();this.Ka=Math.max(1,this.Ta.length);this.Se=b;for(var c=0;c<this.Ta.length;c++)this.Ka+=Nb(this.Ta[c]);mf(this)}lf.prototype.push=function(a){0<this.Ta.length&&(this.Ka+=1);this.Ta.push(a);this.Ka+=Nb(a);mf(this)};lf.prototype.pop=function(){var a=this.Ta.pop();this.Ka-=Nb(a);0<this.Ta.length&&--this.Ka};
function mf(a){if(768<a.Ka)throw Error(a.Se+"has a key path longer than 768 bytes ("+a.Ka+").");if(32<a.Ta.length)throw Error(a.Se+"path specified exceeds the maximum depth that can be written (32) or object contains a cycle "+nf(a));}function nf(a){return 0==a.Ta.length?"":"in property '"+a.Ta.join(".")+"'"};function of(a){a instanceof pf||dd("Don't call new Database() directly - please use firebase.database().");this.ta=a;this.ba=new U(a,C);this.INTERNAL=new qf(this)}var rf={TIMESTAMP:{".sv":"timestamp"}};g=of.prototype;g.app=null;g.of=function(a){sf(this,"ref");y("database.ref",0,1,arguments.length);return p(a)?this.ba.m(a):this.ba};
g.qg=function(a){sf(this,"database.refFromURL");y("database.refFromURL",1,1,arguments.length);var b=ed(a);tf("database.refFromURL",b);var c=b.kc;c.host!==this.ta.M.host&&dd("database.refFromURL: Host name does not match the current database: (found "+c.host+" but expected "+this.ta.M.host+")");return this.of(b.path.toString())};function sf(a,b){null===a.ta&&dd("Cannot call "+b+" on a deleted database.")}g.Zf=function(){y("database.goOffline",0,0,arguments.length);sf(this,"goOffline");this.ta.eb()};
g.$f=function(){y("database.goOnline",0,0,arguments.length);sf(this,"goOnline");this.ta.lc()};Object.defineProperty(of.prototype,"app",{get:function(){return this.ta.app}});function qf(a){this.$a=a}qf.prototype.delete=function(){sf(this.$a,"delete");var a=uf.Wb(),b=this.$a.ta;x(a.nb,b.app.name)!==b&&dd("Database "+b.app.name+" has already been deleted.");b.eb();delete a.nb[b.app.name];this.$a.ta=null;this.$a.ba=null;this.$a=this.$a.INTERNAL=null;return Promise.resolve()};of.prototype.ref=of.prototype.of;
of.prototype.refFromURL=of.prototype.qg;of.prototype.goOnline=of.prototype.$f;of.prototype.goOffline=of.prototype.Zf;qf.prototype["delete"]=qf.prototype.delete;function Qc(){this.k=this.B=null}Qc.prototype.find=function(a){if(null!=this.B)return this.B.Q(a);if(a.e()||null==this.k)return null;var b=J(a);a=D(a);return this.k.contains(b)?this.k.get(b).find(a):null};function Sc(a,b,c){if(b.e())a.B=c,a.k=null;else if(null!==a.B)a.B=a.B.F(b,c);else{null==a.k&&(a.k=new Ke);var d=J(b);a.k.contains(d)||a.k.add(d,new Qc);a=a.k.get(d);b=D(b);Sc(a,b,c)}}
function vf(a,b){if(b.e())return a.B=null,a.k=null,!0;if(null!==a.B){if(a.B.J())return!1;var c=a.B;a.B=null;c.P(N,function(b,c){Sc(a,new L(b),c)});return vf(a,b)}return null!==a.k?(c=J(b),b=D(b),a.k.contains(c)&&vf(a.k.get(c),b)&&a.k.remove(c),a.k.e()?(a.k=null,!0):!1):!0}function Rc(a,b,c){null!==a.B?c(b,a.B):a.P(function(a,e){var f=new L(b.toString()+"/"+a);Rc(e,f,c)})}Qc.prototype.P=function(a){null!==this.k&&Le(this.k,function(b,c){a(b,c)})};var wf=/[\[\].#$\/\u0000-\u001F\u007F]/,xf=/[\[\].#$\u0000-\u001F\u007F]/;function yf(a){return q(a)&&0!==a.length&&!wf.test(a)}function zf(a){return null===a||q(a)||fa(a)&&!fd(a)||ha(a)&&Bb(a,".sv")}function Af(a,b,c,d){d&&!p(b)||Bf(Db(a,1,d),b,c)}
function Bf(a,b,c){c instanceof L&&(c=new lf(c,a));if(!p(b))throw Error(a+"contains undefined "+nf(c));if(ga(b))throw Error(a+"contains a function "+nf(c)+" with contents: "+b.toString());if(fd(b))throw Error(a+"contains "+b.toString()+" "+nf(c));if(q(b)&&b.length>10485760/3&&10485760<Nb(b))throw Error(a+"contains a string greater than 10485760 utf8 bytes "+nf(c)+" ('"+b.substring(0,50)+"...')");if(ha(b)){var d=!1,e=!1;Cb(b,function(b,h){if(".value"===b)d=!0;else if(".priority"!==b&&".sv"!==b&&(e=
!0,!yf(b)))throw Error(a+" contains an invalid key ("+b+") "+nf(c)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');c.push(b);Bf(a,h,c);c.pop()});if(d&&e)throw Error(a+' contains ".value" child '+nf(c)+" in addition to actual children.");}}
function Cf(a,b){var c,d;for(c=0;c<b.length;c++){d=b[c];for(var e=d.slice(),f=0;f<e.length;f++)if((".priority"!==e[f]||f!==e.length-1)&&!yf(e[f]))throw Error(a+"contains an invalid key ("+e[f]+") in path "+d.toString()+'. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');}b.sort(kf);e=null;for(c=0;c<b.length;c++){d=b[c];if(null!==e&&e.contains(d))throw Error(a+"contains a path "+e.toString()+" that is ancestor of another path "+d.toString());e=d}}
function Df(a,b,c){var d=Db(a,1,!1);if(!ha(b)||da(b))throw Error(d+" must be an object containing the children to replace.");var e=[];Cb(b,function(a,b){var k=new L(a);Bf(d,b,c.m(k));if(".priority"===Xd(k)&&!zf(b))throw Error(d+"contains an invalid value for '"+k.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");e.push(k)});Cf(d,e)}
function Ef(a,b,c){if(fd(c))throw Error(Db(a,b,!1)+"is "+c.toString()+", but must be a valid Firebase priority (a string, finite number, server value, or null).");if(!zf(c))throw Error(Db(a,b,!1)+"must be a valid Firebase priority (a string, finite number, server value, or null).");}
function Ff(a,b,c){if(!c||p(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:throw Error(Db(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".');}}function Gf(a,b){if(p(b)&&!yf(b))throw Error(Db(a,2,!0)+'was an invalid key: "'+b+'".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").');}
function Hf(a,b){if(!q(b)||0===b.length||xf.test(b))throw Error(Db(a,1,!1)+'was an invalid path: "'+b+'". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"');}function If(a,b){if(".info"===J(b))throw Error(a+" failed: Can't modify data under /.info/");}
function tf(a,b){var c=b.path.toString(),d;!(d=!q(b.kc.host)||0===b.kc.host.length||!yf(b.kc.pe))&&(d=0!==c.length)&&(c&&(c=c.replace(/^\/*\.info(\/|$)/,"/")),d=!(q(c)&&0!==c.length&&!xf.test(c)));if(d)throw Error(Db(a,1,!1)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".');};function V(a,b){this.ta=a;this.qa=b}V.prototype.cancel=function(a){y("Firebase.onDisconnect().cancel",0,1,arguments.length);A("Firebase.onDisconnect().cancel",1,a,!0);var b=new Hb;this.ta.xd(this.qa,Ib(b,a));return b.ra};V.prototype.cancel=V.prototype.cancel;V.prototype.remove=function(a){y("Firebase.onDisconnect().remove",0,1,arguments.length);If("Firebase.onDisconnect().remove",this.qa);A("Firebase.onDisconnect().remove",1,a,!0);var b=new Hb;Jf(this.ta,this.qa,null,Ib(b,a));return b.ra};
V.prototype.remove=V.prototype.remove;V.prototype.set=function(a,b){y("Firebase.onDisconnect().set",1,2,arguments.length);If("Firebase.onDisconnect().set",this.qa);Af("Firebase.onDisconnect().set",a,this.qa,!1);A("Firebase.onDisconnect().set",2,b,!0);var c=new Hb;Jf(this.ta,this.qa,a,Ib(c,b));return c.ra};V.prototype.set=V.prototype.set;
V.prototype.Kb=function(a,b,c){y("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);If("Firebase.onDisconnect().setWithPriority",this.qa);Af("Firebase.onDisconnect().setWithPriority",a,this.qa,!1);Ef("Firebase.onDisconnect().setWithPriority",2,b);A("Firebase.onDisconnect().setWithPriority",3,c,!0);var d=new Hb;Kf(this.ta,this.qa,a,b,Ib(d,c));return d.ra};V.prototype.setWithPriority=V.prototype.Kb;
V.prototype.update=function(a,b){y("Firebase.onDisconnect().update",1,2,arguments.length);If("Firebase.onDisconnect().update",this.qa);if(da(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Df("Firebase.onDisconnect().update",a,this.qa);A("Firebase.onDisconnect().update",2,b,!0);
c=new Hb;Lf(this.ta,this.qa,a,Ib(c,b));return c.ra};V.prototype.update=V.prototype.update;function Mf(a){H(da(a)&&0<a.length,"Requires a non-empty array");this.Jf=a;this.Ec={}}Mf.prototype.Ge=function(a,b){var c;c=this.Ec[a]||[];var d=c.length;if(0<d){for(var e=Array(d),f=0;f<d;f++)e[f]=c[f];c=e}else c=[];for(d=0;d<c.length;d++)c[d].Ke.apply(c[d].Pa,Array.prototype.slice.call(arguments,1))};Mf.prototype.hc=function(a,b,c){Nf(this,a);this.Ec[a]=this.Ec[a]||[];this.Ec[a].push({Ke:b,Pa:c});(a=this.Xe(a))&&b.apply(c,a)};
Mf.prototype.Jc=function(a,b,c){Nf(this,a);a=this.Ec[a]||[];for(var d=0;d<a.length;d++)if(a[d].Ke===b&&(!c||c===a[d].Pa)){a.splice(d,1);break}};function Nf(a,b){H(Oa(a.Jf,function(a){return a===b}),"Unknown event: "+b)};function Of(){Mf.call(this,["online"]);this.ic=!0;if("undefined"!==typeof window&&"undefined"!==typeof window.addEventListener){var a=this;window.addEventListener("online",function(){a.ic||(a.ic=!0,a.Ge("online",!0))},!1);window.addEventListener("offline",function(){a.ic&&(a.ic=!1,a.Ge("online",!1))},!1)}}ka(Of,Mf);Of.prototype.Xe=function(a){H("online"===a,"Unknown event type: "+a);return[this.ic]};ba(Of);function Pf(){Mf.call(this,["visible"]);var a,b;"undefined"!==typeof document&&"undefined"!==typeof document.addEventListener&&("undefined"!==typeof document.hidden?(b="visibilitychange",a="hidden"):"undefined"!==typeof document.mozHidden?(b="mozvisibilitychange",a="mozHidden"):"undefined"!==typeof document.msHidden?(b="msvisibilitychange",a="msHidden"):"undefined"!==typeof document.webkitHidden&&(b="webkitvisibilitychange",a="webkitHidden"));this.Nb=!0;if(b){var c=this;document.addEventListener(b,
function(){var b=!document[a];b!==c.Nb&&(c.Nb=b,c.Ge("visible",b))},!1)}}ka(Pf,Mf);Pf.prototype.Xe=function(a){H("visible"===a,"Unknown event type: "+a);return[this.Nb]};ba(Pf);var Qf=function(){var a=0,b=[];return function(c){var d=c===a;a=c;for(var e=Array(8),f=7;0<=f;f--)e[f]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c%64),c=Math.floor(c/64);H(0===c,"Cannot push at time == 0");c=e.join("");if(d){for(f=11;0<=f&&63===b[f];f--)b[f]=0;b[f]++}else for(f=0;12>f;f++)b[f]=Math.floor(64*Math.random());for(f=0;12>f;f++)c+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);H(20===c.length,"nextPushId: Length should be 20.");
return c}}();function Rf(a,b){this.Oa=a;this.ba=b?b:Sf}g=Rf.prototype;g.Ra=function(a,b){return new Rf(this.Oa,this.ba.Ra(a,b,this.Oa).Y(null,null,!1,null,null))};g.remove=function(a){return new Rf(this.Oa,this.ba.remove(a,this.Oa).Y(null,null,!1,null,null))};g.get=function(a){for(var b,c=this.ba;!c.e();){b=this.Oa(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return null};
function Tf(a,b){for(var c,d=a.ba,e=null;!d.e();){c=a.Oa(b,d.key);if(0===c){if(d.left.e())return e?e.key:null;for(d=d.left;!d.right.e();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}throw Error("Attempted to find predecessor key for a nonexistent key.  What gives?");}g.e=function(){return this.ba.e()};g.count=function(){return this.ba.count()};g.Hc=function(){return this.ba.Hc()};g.fc=function(){return this.ba.fc()};g.ia=function(a){return this.ba.ia(a)};
g.Xb=function(a){return new Uf(this.ba,null,this.Oa,!1,a)};g.Yb=function(a,b){return new Uf(this.ba,a,this.Oa,!1,b)};g.$b=function(a,b){return new Uf(this.ba,a,this.Oa,!0,b)};g.Ze=function(a){return new Uf(this.ba,null,this.Oa,!0,a)};function Uf(a,b,c,d,e){this.Hd=e||null;this.le=d;this.Sa=[];for(e=1;!a.e();)if(e=b?c(a.key,b):1,d&&(e*=-1),0>e)a=this.le?a.left:a.right;else if(0===e){this.Sa.push(a);break}else this.Sa.push(a),a=this.le?a.right:a.left}
function R(a){if(0===a.Sa.length)return null;var b=a.Sa.pop(),c;c=a.Hd?a.Hd(b.key,b.value):{key:b.key,value:b.value};if(a.le)for(b=b.left;!b.e();)a.Sa.push(b),b=b.right;else for(b=b.right;!b.e();)a.Sa.push(b),b=b.left;return c}function Vf(a){if(0===a.Sa.length)return null;var b;b=a.Sa;b=b[b.length-1];return a.Hd?a.Hd(b.key,b.value):{key:b.key,value:b.value}}function Wf(a,b,c,d,e){this.key=a;this.value=b;this.color=null!=c?c:!0;this.left=null!=d?d:Sf;this.right=null!=e?e:Sf}g=Wf.prototype;
g.Y=function(a,b,c,d,e){return new Wf(null!=a?a:this.key,null!=b?b:this.value,null!=c?c:this.color,null!=d?d:this.left,null!=e?e:this.right)};g.count=function(){return this.left.count()+1+this.right.count()};g.e=function(){return!1};g.ia=function(a){return this.left.ia(a)||a(this.key,this.value)||this.right.ia(a)};function Xf(a){return a.left.e()?a:Xf(a.left)}g.Hc=function(){return Xf(this).key};g.fc=function(){return this.right.e()?this.key:this.right.fc()};
g.Ra=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.Y(null,null,null,e.left.Ra(a,b,c),null):0===d?e.Y(null,b,null,null,null):e.Y(null,null,null,null,e.right.Ra(a,b,c));return Yf(e)};function Zf(a){if(a.left.e())return Sf;a.left.fa()||a.left.left.fa()||(a=$f(a));a=a.Y(null,null,null,Zf(a.left),null);return Yf(a)}
g.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))c.left.e()||c.left.fa()||c.left.left.fa()||(c=$f(c)),c=c.Y(null,null,null,c.left.remove(a,b),null);else{c.left.fa()&&(c=ag(c));c.right.e()||c.right.fa()||c.right.left.fa()||(c=bg(c),c.left.left.fa()&&(c=ag(c),c=bg(c)));if(0===b(a,c.key)){if(c.right.e())return Sf;d=Xf(c.right);c=c.Y(d.key,d.value,null,null,Zf(c.right))}c=c.Y(null,null,null,null,c.right.remove(a,b))}return Yf(c)};g.fa=function(){return this.color};
function Yf(a){a.right.fa()&&!a.left.fa()&&(a=cg(a));a.left.fa()&&a.left.left.fa()&&(a=ag(a));a.left.fa()&&a.right.fa()&&(a=bg(a));return a}function $f(a){a=bg(a);a.right.left.fa()&&(a=a.Y(null,null,null,null,ag(a.right)),a=cg(a),a=bg(a));return a}function cg(a){return a.right.Y(null,null,a.color,a.Y(null,null,!0,null,a.right.left),null)}function ag(a){return a.left.Y(null,null,a.color,null,a.Y(null,null,!0,a.left.right,null))}
function bg(a){return a.Y(null,null,!a.color,a.left.Y(null,null,!a.left.color,null,null),a.right.Y(null,null,!a.right.color,null,null))}function dg(){}g=dg.prototype;g.Y=function(){return this};g.Ra=function(a,b){return new Wf(a,b,null)};g.remove=function(){return this};g.count=function(){return 0};g.e=function(){return!0};g.ia=function(){return!1};g.Hc=function(){return null};g.fc=function(){return null};g.fa=function(){return!1};var Sf=new dg;function P(a,b,c){this.k=a;(this.aa=b)&&ne(this.aa);a.e()&&H(!this.aa||this.aa.e(),"An empty node cannot have a priority");this.zb=c;this.Eb=null}g=P.prototype;g.J=function(){return!1};g.C=function(){return this.aa||F};g.ga=function(a){return this.k.e()?this:new P(this.k,a,this.zb)};g.R=function(a){if(".priority"===a)return this.C();a=this.k.get(a);return null===a?F:a};g.Q=function(a){var b=J(a);return null===b?this:this.R(b).Q(D(a))};g.Fa=function(a){return null!==this.k.get(a)};
g.U=function(a,b){H(b,"We should always be passing snapshot nodes");if(".priority"===a)return this.ga(b);var c=new K(a,b),d,e;b.e()?(d=this.k.remove(a),c=Ie(this.zb,c,this.k)):(d=this.k.Ra(a,b),c=Ge(this.zb,c,this.k));e=d.e()?F:this.aa;return new P(d,e,c)};g.F=function(a,b){var c=J(a);if(null===c)return b;H(".priority"!==J(a)||1===Wd(a),".priority must be the last token in a path");var d=this.R(c).F(D(a),b);return this.U(c,d)};g.e=function(){return this.k.e()};g.Fb=function(){return this.k.count()};
var eg=/^(0|[1-9]\d*)$/;g=P.prototype;g.H=function(a){if(this.e())return null;var b={},c=0,d=0,e=!0;this.P(N,function(f,h){b[f]=h.H(a);c++;e&&eg.test(f)?d=Math.max(d,Number(f)):e=!1});if(!a&&e&&d<2*c){var f=[],h;for(h in b)f[h]=b[h];return f}a&&!this.C().e()&&(b[".priority"]=this.C().H());return b};g.hash=function(){if(null===this.Eb){var a="";this.C().e()||(a+="priority:"+pe(this.C().H())+":");this.P(N,function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});this.Eb=""===a?"":Yc(a)}return this.Eb};
g.Ye=function(a,b,c){return(c=fg(this,c))?(a=Tf(c,new K(a,b)))?a.name:null:Tf(this.k,a)};function le(a,b){var c;c=(c=fg(a,b))?(c=c.Hc())&&c.name:a.k.Hc();return c?new K(c,a.k.get(c)):null}function me(a,b){var c;c=(c=fg(a,b))?(c=c.fc())&&c.name:a.k.fc();return c?new K(c,a.k.get(c)):null}g.P=function(a,b){var c=fg(this,a);return c?c.ia(function(a){return b(a.name,a.S)}):this.k.ia(b)};g.Xb=function(a){return this.Yb(a.Ic(),a)};
g.Yb=function(a,b){var c=fg(this,b);if(c)return c.Yb(a,function(a){return a});for(var c=this.k.Yb(a.name,Nc),d=Vf(c);null!=d&&0>b.compare(d,a);)R(c),d=Vf(c);return c};g.Ze=function(a){return this.$b(a.Gc(),a)};g.$b=function(a,b){var c=fg(this,b);if(c)return c.$b(a,function(a){return a});for(var c=this.k.$b(a.name,Nc),d=Vf(c);null!=d&&0<b.compare(d,a);)R(c),d=Vf(c);return c};g.tc=function(a){return this.e()?a.e()?0:-1:a.J()||a.e()?1:a===ue?-1:0};
g.ob=function(a){if(a===ae||ua(this.zb.dc,a.toString()))return this;var b=this.zb,c=this.k;H(a!==ae,"KeyIndex always exists and isn't meant to be added to the IndexMap.");for(var d=[],e=!1,c=c.Xb(Nc),f=R(c);f;)e=e||a.yc(f.S),d.push(f),f=R(c);d=e?He(d,ke(a)):re;e=a.toString();c=ya(b.dc);c[e]=a;a=ya(b.od);a[e]=d;return new P(this.k,this.aa,new Fe(a,c))};g.zc=function(a){return a===ae||ua(this.zb.dc,a.toString())};
g.ca=function(a){if(a===this)return!0;if(a.J())return!1;if(this.C().ca(a.C())&&this.k.count()===a.k.count()){var b=this.Xb(N);a=a.Xb(N);for(var c=R(b),d=R(a);c&&d;){if(c.name!==d.name||!c.S.ca(d.S))return!1;c=R(b);d=R(a)}return null===c&&null===d}return!1};function fg(a,b){return b===ae?null:a.zb.get(b.toString())}g.toString=function(){return B(this.H(!0))};function M(a,b){if(null===a)return F;var c=null;"object"===typeof a&&".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);H(null===c||"string"===typeof c||"number"===typeof c||"object"===typeof c&&".sv"in c,"Invalid priority type found: "+typeof c);"object"===typeof a&&".value"in a&&null!==a[".value"]&&(a=a[".value"]);if("object"!==typeof a||".sv"in a)return new Uc(a,M(c));if(a instanceof Array){var d=F,e=a;t(e,function(a,b){if(Bb(e,b)&&"."!==b.substring(0,1)){var c=M(a);if(c.J()||!c.e())d=
d.U(b,c)}});return d.ga(M(c))}var f=[],h=!1,k=a;Cb(k,function(a){if("string"!==typeof a||"."!==a.substring(0,1)){var b=M(k[a]);b.e()||(h=h||!b.C().e(),f.push(new K(a,b)))}});if(0==f.length)return F;var m=He(f,Kc,function(a){return a.name},Mc);if(h){var l=He(f,ke(N));return new P(m,M(c),new Fe({".priority":l},{".priority":N}))}return new P(m,M(c),Je)}var gg=Math.log(2);
function hg(a){this.count=parseInt(Math.log(a+1)/gg,10);this.Qe=this.count-1;this.Kf=a+1&parseInt(Array(this.count+1).join("1"),2)}function ig(a){var b=!(a.Kf&1<<a.Qe);a.Qe--;return b}
function He(a,b,c,d){function e(b,d){var f=d-b;if(0==f)return null;if(1==f){var l=a[b],u=c?c(l):l;return new Wf(u,l.S,!1,null,null)}var l=parseInt(f/2,10)+b,f=e(b,l),z=e(l+1,d),l=a[l],u=c?c(l):l;return new Wf(u,l.S,!1,f,z)}a.sort(b);var f=function(b){function d(b,h){var k=u-b,z=u;u-=b;var z=e(k+1,z),k=a[k],G=c?c(k):k,z=new Wf(G,k.S,h,null,z);f?f.left=z:l=z;f=z}for(var f=null,l=null,u=a.length,z=0;z<b.count;++z){var G=ig(b),sd=Math.pow(2,b.count-(z+1));G?d(sd,!1):(d(sd,!1),d(sd,!0))}return l}(new hg(a.length));
return null!==f?new Rf(d||b,f):new Rf(d||b)}function pe(a){return"number"===typeof a?"number:"+md(a):"string:"+a}function ne(a){if(a.J()){var b=a.H();H("string"===typeof b||"number"===typeof b||"object"===typeof b&&Bb(b,".sv"),"Priority must be a string or number.")}else H(a===ue||a.e(),"priority of unexpected type.");H(a===ue||a.C().e(),"Priority nodes can't have a priority of their own.")}var F=new P(new Rf(Mc),null,Je);function jg(){P.call(this,new Rf(Mc),F,Je)}ka(jg,P);g=jg.prototype;
g.tc=function(a){return a===this?0:1};g.ca=function(a){return a===this};g.C=function(){return this};g.R=function(){return F};g.e=function(){return!1};var ue=new jg,se=new K("[MIN_NAME]",F),ye=new K("[MAX_NAME]",ue);function W(a,b,c){this.A=a;this.W=b;this.g=c}W.prototype.H=function(){y("Firebase.DataSnapshot.val",0,0,arguments.length);return this.A.H()};W.prototype.val=W.prototype.H;W.prototype.Te=function(){y("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.A.H(!0)};W.prototype.exportVal=W.prototype.Te;W.prototype.Uf=function(){y("Firebase.DataSnapshot.exists",0,0,arguments.length);return!this.A.e()};W.prototype.exists=W.prototype.Uf;
W.prototype.m=function(a){y("Firebase.DataSnapshot.child",0,1,arguments.length);fa(a)&&(a=String(a));Hf("Firebase.DataSnapshot.child",a);var b=new L(a),c=this.W.m(b);return new W(this.A.Q(b),c,N)};W.prototype.child=W.prototype.m;W.prototype.Fa=function(a){y("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Hf("Firebase.DataSnapshot.hasChild",a);var b=new L(a);return!this.A.Q(b).e()};W.prototype.hasChild=W.prototype.Fa;
W.prototype.C=function(){y("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.A.C().H()};W.prototype.getPriority=W.prototype.C;W.prototype.forEach=function(a){y("Firebase.DataSnapshot.forEach",1,1,arguments.length);A("Firebase.DataSnapshot.forEach",1,a,!1);if(this.A.J())return!1;var b=this;return!!this.A.P(this.g,function(c,d){return a(new W(d,b.W.m(c),N))})};W.prototype.forEach=W.prototype.forEach;
W.prototype.kd=function(){y("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.A.J()?!1:!this.A.e()};W.prototype.hasChildren=W.prototype.kd;W.prototype.getKey=function(){y("Firebase.DataSnapshot.key",0,0,arguments.length);return this.W.getKey()};od(W.prototype,"key",W.prototype.getKey);W.prototype.Fb=function(){y("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.A.Fb()};W.prototype.numChildren=W.prototype.Fb;
W.prototype.xb=function(){y("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.W};od(W.prototype,"ref",W.prototype.xb);function Ud(a,b){this.O=a;this.Ld=b}function Rd(a,b,c,d){return new Ud(new Dc(b,c,d),a.Ld)}function Vd(a){return a.O.ea?a.O.j():null}Ud.prototype.u=function(){return this.Ld};function Ec(a){return a.Ld.ea?a.Ld.j():null};function kg(a,b){this.W=a;var c=a.n,d=new be(c.g),c=S(c)?new be(c.g):c.xa?new he(c):new ce(c);this.nf=new Ld(c);var e=b.u(),f=b.O,h=d.za(F,e.j(),null),k=c.za(F,f.j(),null);this.Na=new Ud(new Dc(k,f.ea,c.Qa()),new Dc(h,e.ea,d.Qa()));this.ab=[];this.Rf=new Gd(a)}function lg(a){return a.W}g=kg.prototype;g.u=function(){return this.Na.u().j()};g.jb=function(a){var b=Ec(this.Na);return b&&(S(this.W.n)||!a.e()&&!b.R(J(a)).e())?b.Q(a):null};g.e=function(){return 0===this.ab.length};g.Ob=function(a){this.ab.push(a)};
g.mb=function(a,b){var c=[];if(b){H(null==a,"A cancel should cancel all event registrations.");var d=this.W.path;Ja(this.ab,function(a){(a=a.Oe(b,d))&&c.push(a)})}if(a){for(var e=[],f=0;f<this.ab.length;++f){var h=this.ab[f];if(!h.matches(a))e.push(h);else if(a.$e()){e=e.concat(this.ab.slice(f+1));break}}this.ab=e}else this.ab=[];return c};
g.gb=function(a,b,c){a.type===Dd&&null!==a.source.Ib&&(H(Ec(this.Na),"We should always have a full cache before handling merges"),H(Vd(this.Na),"Missing event cache, even though we have a server cache"));var d=this.Na;a=this.nf.gb(d,a,b,c);b=this.nf;c=a.Sd;H(c.O.j().zc(b.V.g),"Event snap not indexed");H(c.u().j().zc(b.V.g),"Server snap not indexed");H(Hc(a.Sd.u())||!Hc(d.u()),"Once a server snap is complete, it should never go back");this.Na=a.Sd;return mg(this,a.Lf,a.Sd.O.j(),null)};
function ng(a,b){var c=a.Na.O,d=[];c.j().J()||c.j().P(N,function(a,b){d.push(new I("child_added",b,a))});c.ea&&d.push(Fc(c.j()));return mg(a,d,c.j(),b)}function mg(a,b,c,d){return Hd(a.Rf,b,c,d?[d]:a.ab)};function og(a,b,c){this.Qb=a;this.sb=b;this.ub=c||null}g=og.prototype;g.sf=function(a){return"value"===a};g.createEvent=function(a,b){var c=b.n.g;return new xc("value",this,new W(a.Ma,b.xb(),c))};g.Ub=function(a){var b=this.ub;if("cancel"===a.ge()){H(this.sb,"Raising a cancel event on a listener with no cancel callback");var c=this.sb;return function(){c.call(b,a.error)}}var d=this.Qb;return function(){d.call(b,a.Md)}};g.Oe=function(a,b){return this.sb?new yc(this,a,b):null};
g.matches=function(a){return a instanceof og?a.Qb&&this.Qb?a.Qb===this.Qb&&a.ub===this.ub:!0:!1};g.$e=function(){return null!==this.Qb};function pg(a,b,c){this.ha=a;this.sb=b;this.ub=c}g=pg.prototype;g.sf=function(a){a="children_added"===a?"child_added":a;return("children_removed"===a?"child_removed":a)in this.ha};g.Oe=function(a,b){return this.sb?new yc(this,a,b):null};
g.createEvent=function(a,b){H(null!=a.Za,"Child events should have a childName.");var c=b.xb().m(a.Za);return new xc(a.type,this,new W(a.Ma,c,b.n.g),a.Dd)};g.Ub=function(a){var b=this.ub;if("cancel"===a.ge()){H(this.sb,"Raising a cancel event on a listener with no cancel callback");var c=this.sb;return function(){c.call(b,a.error)}}var d=this.ha[a.gd];return function(){d.call(b,a.Md,a.Dd)}};
g.matches=function(a){if(a instanceof pg){if(!this.ha||!a.ha)return!0;if(this.ub===a.ub){var b=qa(a.ha);if(b===qa(this.ha)){if(1===b){var b=ra(a.ha),c=ra(this.ha);return c===b&&(!a.ha[b]||!this.ha[c]||a.ha[b]===this.ha[c])}return pa(this.ha,function(b,c){return a.ha[c]===b})}}}return!1};g.$e=function(){return null!==this.ha};function X(a,b,c,d){this.w=a;this.path=b;this.n=c;this.Oc=d}
function qg(a){var b=null,c=null;a.ka&&(b=ee(a));a.na&&(c=ge(a));if(a.g===ae){if(a.ka){if("[MIN_NAME]"!=de(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==typeof b)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}if(a.na){if("[MAX_NAME]"!=fe(a))throw Error("Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().");if("string"!==
typeof c)throw Error("Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.");}}else if(a.g===N){if(null!=b&&!zf(b)||null!=c&&!zf(c))throw Error("Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string).");}else if(H(a.g instanceof te||a.g===ze,"unknown index type."),null!=b&&"object"===typeof b||null!=c&&"object"===typeof c)throw Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object.");
}function rg(a){if(a.ka&&a.na&&a.xa&&(!a.xa||""===a.oc))throw Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.");}function sg(a,b){if(!0===a.Oc)throw Error(b+": You can't combine multiple orderBy calls.");}g=X.prototype;g.xb=function(){y("Query.ref",0,0,arguments.length);return new U(this.w,this.path)};
g.hc=function(a,b,c,d){y("Query.on",2,4,arguments.length);Ff("Query.on",a,!1);A("Query.on",2,b,!1);var e=tg("Query.on",c,d);if("value"===a)ug(this.w,this,new og(b,e.cancel||null,e.Pa||null));else{var f={};f[a]=b;ug(this.w,this,new pg(f,e.cancel,e.Pa))}return b};
g.Jc=function(a,b,c){y("Query.off",0,3,arguments.length);Ff("Query.off",a,!0);A("Query.off",2,b,!0);Eb("Query.off",3,c);var d=null,e=null;"value"===a?d=new og(b||null,null,c||null):a&&(b&&(e={},e[a]=b),d=new pg(e,null,c||null));e=this.w;d=".info"===J(this.path)?e.pd.mb(this,d):e.K.mb(this,d);tc(e.da,this.path,d)};
g.jg=function(a,b){function c(k){f&&(f=!1,e.Jc(a,c),b&&b.call(d.Pa,k),h.resolve(k))}y("Query.once",1,4,arguments.length);Ff("Query.once",a,!1);A("Query.once",2,b,!0);var d=tg("Query.once",arguments[2],arguments[3]),e=this,f=!0,h=new Hb;Jb(h.ra);this.hc(a,c,function(b){e.Jc(a,c);d.cancel&&d.cancel.call(d.Pa,b);h.reject(b)});return h.ra};
g.ne=function(a){y("Query.limitToFirst",1,1,arguments.length);if(!fa(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToFirst: First argument must be a positive integer.");if(this.n.xa)throw Error("Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new X(this.w,this.path,this.n.ne(a),this.Oc)};
g.oe=function(a){y("Query.limitToLast",1,1,arguments.length);if(!fa(a)||Math.floor(a)!==a||0>=a)throw Error("Query.limitToLast: First argument must be a positive integer.");if(this.n.xa)throw Error("Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");return new X(this.w,this.path,this.n.oe(a),this.Oc)};
g.kg=function(a){y("Query.orderByChild",1,1,arguments.length);if("$key"===a)throw Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');if("$priority"===a)throw Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');if("$value"===a)throw Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');Hf("Query.orderByChild",a);sg(this,"Query.orderByChild");var b=new L(a);if(b.e())throw Error("Query.orderByChild: cannot pass in empty path.  Use Query.orderByValue() instead.");
b=new te(b);b=De(this.n,b);qg(b);return new X(this.w,this.path,b,!0)};g.lg=function(){y("Query.orderByKey",0,0,arguments.length);sg(this,"Query.orderByKey");var a=De(this.n,ae);qg(a);return new X(this.w,this.path,a,!0)};g.mg=function(){y("Query.orderByPriority",0,0,arguments.length);sg(this,"Query.orderByPriority");var a=De(this.n,N);qg(a);return new X(this.w,this.path,a,!0)};
g.ng=function(){y("Query.orderByValue",0,0,arguments.length);sg(this,"Query.orderByValue");var a=De(this.n,ze);qg(a);return new X(this.w,this.path,a,!0)};g.Nd=function(a,b){y("Query.startAt",0,2,arguments.length);Af("Query.startAt",a,this.path,!0);Gf("Query.startAt",b);var c=this.n.Nd(a,b);rg(c);qg(c);if(this.n.ka)throw Error("Query.startAt: Starting point was already set (by another call to startAt or equalTo).");p(a)||(b=a=null);return new X(this.w,this.path,c,this.Oc)};
g.fd=function(a,b){y("Query.endAt",0,2,arguments.length);Af("Query.endAt",a,this.path,!0);Gf("Query.endAt",b);var c=this.n.fd(a,b);rg(c);qg(c);if(this.n.na)throw Error("Query.endAt: Ending point was already set (by another call to endAt or equalTo).");return new X(this.w,this.path,c,this.Oc)};
g.Qf=function(a,b){y("Query.equalTo",1,2,arguments.length);Af("Query.equalTo",a,this.path,!1);Gf("Query.equalTo",b);if(this.n.ka)throw Error("Query.equalTo: Starting point was already set (by another call to endAt or equalTo).");if(this.n.na)throw Error("Query.equalTo: Ending point was already set (by another call to endAt or equalTo).");return this.Nd(a,b).fd(a,b)};
g.toString=function(){y("Query.toString",0,0,arguments.length);for(var a=this.path,b="",c=a.Z;c<a.o.length;c++)""!==a.o[c]&&(b+="/"+encodeURIComponent(String(a.o[c])));return this.w.toString()+(b||"/")};g.ya=function(){var a=jd(Ee(this.n));return"{}"===a?"default":a};
function tg(a,b,c){var d={cancel:null,Pa:null};if(b&&c)d.cancel=b,A(a,3,d.cancel,!0),d.Pa=c,Eb(a,4,d.Pa);else if(b)if("object"===typeof b&&null!==b)d.Pa=b;else if("function"===typeof b)d.cancel=b;else throw Error(Db(a,3,!0)+" must either be a cancel callback or a context object.");return d}X.prototype.on=X.prototype.hc;X.prototype.off=X.prototype.Jc;X.prototype.once=X.prototype.jg;X.prototype.limitToFirst=X.prototype.ne;X.prototype.limitToLast=X.prototype.oe;X.prototype.orderByChild=X.prototype.kg;
X.prototype.orderByKey=X.prototype.lg;X.prototype.orderByPriority=X.prototype.mg;X.prototype.orderByValue=X.prototype.ng;X.prototype.startAt=X.prototype.Nd;X.prototype.endAt=X.prototype.fd;X.prototype.equalTo=X.prototype.Qf;X.prototype.toString=X.prototype.toString;od(X.prototype,"ref",X.prototype.xb);function vg(a,b){this.value=a;this.children=b||wg}var wg=new Rf(function(a,b){return a===b?0:a<b?-1:1});function xg(a){var b=Q;t(a,function(a,d){b=b.set(new L(d),a)});return b}g=vg.prototype;g.e=function(){return null===this.value&&this.children.e()};function yg(a,b,c){if(null!=a.value&&c(a.value))return{path:C,value:a.value};if(b.e())return null;var d=J(b);a=a.children.get(d);return null!==a?(b=yg(a,D(b),c),null!=b?{path:(new L(d)).m(b.path),value:b.value}:null):null}
function zg(a,b){return yg(a,b,function(){return!0})}g.subtree=function(a){if(a.e())return this;var b=this.children.get(J(a));return null!==b?b.subtree(D(a)):Q};g.set=function(a,b){if(a.e())return new vg(b,this.children);var c=J(a),d=(this.children.get(c)||Q).set(D(a),b),c=this.children.Ra(c,d);return new vg(this.value,c)};
g.remove=function(a){if(a.e())return this.children.e()?Q:new vg(null,this.children);var b=J(a),c=this.children.get(b);return c?(a=c.remove(D(a)),b=a.e()?this.children.remove(b):this.children.Ra(b,a),null===this.value&&b.e()?Q:new vg(this.value,b)):this};g.get=function(a){if(a.e())return this.value;var b=this.children.get(J(a));return b?b.get(D(a)):null};
function $d(a,b,c){if(b.e())return c;var d=J(b);b=$d(a.children.get(d)||Q,D(b),c);d=b.e()?a.children.remove(d):a.children.Ra(d,b);return new vg(a.value,d)}function Ag(a,b){return Bg(a,C,b)}function Bg(a,b,c){var d={};a.children.ia(function(a,f){d[a]=Bg(f,b.m(a),c)});return c(b,a.value,d)}function Cg(a,b,c){return Dg(a,b,C,c)}function Dg(a,b,c,d){var e=a.value?d(c,a.value):!1;if(e)return e;if(b.e())return null;e=J(b);return(a=a.children.get(e))?Dg(a,D(b),c.m(e),d):null}
function Eg(a,b,c){Fg(a,b,C,c)}function Fg(a,b,c,d){if(b.e())return a;a.value&&d(c,a.value);var e=J(b);return(a=a.children.get(e))?Fg(a,D(b),c.m(e),d):Q}function Yd(a,b){Gg(a,C,b)}function Gg(a,b,c){a.children.ia(function(a,e){Gg(e,b.m(a),c)});a.value&&c(b,a.value)}function Hg(a,b){a.children.ia(function(a,d){d.value&&b(a,d.value)})}var Q=new vg(null);vg.prototype.toString=function(){var a={};Yd(this,function(b,c){a[b.toString()]=c.toString()});return B(a)};function Ig(a,b,c){this.type=Qd;this.source=Jg;this.path=a;this.Pb=b;this.Id=c}Ig.prototype.Nc=function(a){if(this.path.e()){if(null!=this.Pb.value)return H(this.Pb.children.e(),"affectedTree should not have overlapping affected paths."),this;a=this.Pb.subtree(new L(a));return new Ig(C,a,this.Id)}H(J(this.path)===a,"operationForChild called for unrelated child.");return new Ig(D(this.path),this.Pb,this.Id)};
Ig.prototype.toString=function(){return"Operation("+this.path+": "+this.source.toString()+" ack write revert="+this.Id+" affectedTree="+this.Pb+")"};var $b=0,Dd=1,Qd=2,bc=3;function Kg(a,b,c,d){this.ee=a;this.Ve=b;this.Ib=c;this.Ee=d;H(!d||b,"Tagged queries must be from server.")}var Jg=new Kg(!0,!1,null,!1),Lg=new Kg(!1,!0,null,!1);Kg.prototype.toString=function(){return this.ee?"user":this.Ee?"server(queryID="+this.Ib+")":"server"};function Mg(a){this.X=a}var Ng=new Mg(new vg(null));function Og(a,b,c){if(b.e())return new Mg(new vg(c));var d=zg(a.X,b);if(null!=d){var e=d.path,d=d.value;b=T(e,b);d=d.F(b,c);return new Mg(a.X.set(e,d))}a=$d(a.X,b,new vg(c));return new Mg(a)}function Pg(a,b,c){var d=a;Cb(c,function(a,c){d=Og(d,b.m(a),c)});return d}Mg.prototype.Ed=function(a){if(a.e())return Ng;a=$d(this.X,a,Q);return new Mg(a)};function Qg(a,b){var c=zg(a.X,b);return null!=c?a.X.get(c.path).Q(T(c.path,b)):null}
function Rg(a){var b=[],c=a.X.value;null!=c?c.J()||c.P(N,function(a,c){b.push(new K(a,c))}):a.X.children.ia(function(a,c){null!=c.value&&b.push(new K(a,c.value))});return b}function Sg(a,b){if(b.e())return a;var c=Qg(a,b);return null!=c?new Mg(new vg(c)):new Mg(a.X.subtree(b))}Mg.prototype.e=function(){return this.X.e()};Mg.prototype.apply=function(a){return Tg(C,this.X,a)};
function Tg(a,b,c){if(null!=b.value)return c.F(a,b.value);var d=null;b.children.ia(function(b,f){".priority"===b?(H(null!==f.value,"Priority writes must always be leaf nodes"),d=f.value):c=Tg(a.m(b),f,c)});c.Q(a).e()||null===d||(c=c.F(a.m(".priority"),d));return c};function Ug(){this.Aa={}}g=Ug.prototype;g.e=function(){return xa(this.Aa)};g.gb=function(a,b,c){var d=a.source.Ib;if(null!==d)return d=x(this.Aa,d),H(null!=d,"SyncTree gave us an op for an invalid query."),d.gb(a,b,c);var e=[];t(this.Aa,function(d){e=e.concat(d.gb(a,b,c))});return e};g.Ob=function(a,b,c,d,e){var f=a.ya(),h=x(this.Aa,f);if(!h){var h=c.Ba(e?d:null),k=!1;h?k=!0:(h=d instanceof P?c.sc(d):F,k=!1);h=new kg(a,new Ud(new Dc(h,k,!1),new Dc(d,e,!1)));this.Aa[f]=h}h.Ob(b);return ng(h,b)};
g.mb=function(a,b,c){var d=a.ya(),e=[],f=[],h=null!=Vg(this);if("default"===d){var k=this;t(this.Aa,function(a,d){f=f.concat(a.mb(b,c));a.e()&&(delete k.Aa[d],S(a.W.n)||e.push(a.W))})}else{var m=x(this.Aa,d);m&&(f=f.concat(m.mb(b,c)),m.e()&&(delete this.Aa[d],S(m.W.n)||e.push(m.W)))}h&&null==Vg(this)&&e.push(new U(a.w,a.path));return{rg:e,Sf:f}};function Wg(a){return Ka(sa(a.Aa),function(a){return!S(a.W.n)})}g.jb=function(a){var b=null;t(this.Aa,function(c){b=b||c.jb(a)});return b};
function Xg(a,b){if(S(b.n))return Vg(a);var c=b.ya();return x(a.Aa,c)}function Vg(a){return wa(a.Aa,function(a){return S(a.W.n)})||null};function Yg(){this.T=Ng;this.la=[];this.Cc=-1}function Zg(a,b){for(var c=0;c<a.la.length;c++){var d=a.la[c];if(d.Zc===b)return d}return null}g=Yg.prototype;
g.Ed=function(a){var b=Pa(this.la,function(b){return b.Zc===a});H(0<=b,"removeWrite called with nonexistent writeId.");var c=this.la[b];this.la.splice(b,1);for(var d=c.visible,e=!1,f=this.la.length-1;d&&0<=f;){var h=this.la[f];h.visible&&(f>=b&&$g(h,c.path)?d=!1:c.path.contains(h.path)&&(e=!0));f--}if(d){if(e)this.T=ah(this.la,bh,C),this.Cc=0<this.la.length?this.la[this.la.length-1].Zc:-1;else if(c.Ja)this.T=this.T.Ed(c.path);else{var k=this;t(c.children,function(a,b){k.T=k.T.Ed(c.path.m(b))})}return!0}return!1};
g.Ba=function(a,b,c,d){if(c||d){var e=Sg(this.T,a);return!d&&e.e()?b:d||null!=b||null!=Qg(e,C)?(e=ah(this.la,function(b){return(b.visible||d)&&(!c||!(0<=Ia(c,b.Zc)))&&(b.path.contains(a)||a.contains(b.path))},a),b=b||F,e.apply(b)):null}e=Qg(this.T,a);if(null!=e)return e;e=Sg(this.T,a);return e.e()?b:null!=b||null!=Qg(e,C)?(b=b||F,e.apply(b)):null};
g.sc=function(a,b){var c=F,d=Qg(this.T,a);if(d)d.J()||d.P(N,function(a,b){c=c.U(a,b)});else if(b){var e=Sg(this.T,a);b.P(N,function(a,b){var d=Sg(e,new L(a)).apply(b);c=c.U(a,d)});Ja(Rg(e),function(a){c=c.U(a.name,a.S)})}else e=Sg(this.T,a),Ja(Rg(e),function(a){c=c.U(a.name,a.S)});return c};g.$c=function(a,b,c,d){H(c||d,"Either existingEventSnap or existingServerSnap must exist");a=a.m(b);if(null!=Qg(this.T,a))return null;a=Sg(this.T,a);return a.e()?d.Q(b):a.apply(d.Q(b))};
g.rc=function(a,b,c){a=a.m(b);var d=Qg(this.T,a);return null!=d?d:Cc(c,b)?Sg(this.T,a).apply(c.j().R(b)):null};g.mc=function(a){return Qg(this.T,a)};g.Xd=function(a,b,c,d,e,f){var h;a=Sg(this.T,a);h=Qg(a,C);if(null==h)if(null!=b)h=a.apply(b);else return[];h=h.ob(f);if(h.e()||h.J())return[];b=[];a=ke(f);e=e?h.$b(c,f):h.Yb(c,f);for(f=R(e);f&&b.length<d;)0!==a(f,c)&&b.push(f),f=R(e);return b};
function $g(a,b){return a.Ja?a.path.contains(b):!!va(a.children,function(c,d){return a.path.m(d).contains(b)})}function bh(a){return a.visible}
function ah(a,b,c){for(var d=Ng,e=0;e<a.length;++e){var f=a[e];if(b(f)){var h=f.path;if(f.Ja)c.contains(h)?(h=T(c,h),d=Og(d,h,f.Ja)):h.contains(c)&&(h=T(h,c),d=Og(d,C,f.Ja.Q(h)));else if(f.children)if(c.contains(h))h=T(c,h),d=Pg(d,h,f.children);else{if(h.contains(c))if(h=T(h,c),h.e())d=Pg(d,C,f.children);else if(f=x(f.children,J(h)))f=f.Q(D(h)),d=Og(d,C,f)}else throw Wc("WriteRecord should have .snap or .children");}}return d}function ch(a,b){this.Mb=a;this.X=b}g=ch.prototype;
g.Ba=function(a,b,c){return this.X.Ba(this.Mb,a,b,c)};g.sc=function(a){return this.X.sc(this.Mb,a)};g.$c=function(a,b,c){return this.X.$c(this.Mb,a,b,c)};g.mc=function(a){return this.X.mc(this.Mb.m(a))};g.Xd=function(a,b,c,d,e){return this.X.Xd(this.Mb,a,b,c,d,e)};g.rc=function(a,b){return this.X.rc(this.Mb,a,b)};g.m=function(a){return new ch(this.Mb.m(a),this.X)};function dh(){this.children={};this.ad=0;this.value=null}function eh(a,b,c){this.ud=a?a:"";this.Ha=b?b:null;this.A=c?c:new dh}function fh(a,b){for(var c=b instanceof L?b:new L(b),d=a,e;null!==(e=J(c));)d=new eh(e,d,x(d.A.children,e)||new dh),c=D(c);return d}g=eh.prototype;g.Ea=function(){return this.A.value};function gh(a,b){H("undefined"!==typeof b,"Cannot set value to undefined");a.A.value=b;hh(a)}g.clear=function(){this.A.value=null;this.A.children={};this.A.ad=0;hh(this)};
g.kd=function(){return 0<this.A.ad};g.e=function(){return null===this.Ea()&&!this.kd()};g.P=function(a){var b=this;t(this.A.children,function(c,d){a(new eh(d,b,c))})};function ih(a,b,c,d){c&&!d&&b(a);a.P(function(a){ih(a,b,!0,d)});c&&d&&b(a)}function jh(a,b){for(var c=a.parent();null!==c&&!b(c);)c=c.parent()}g.path=function(){return new L(null===this.Ha?this.ud:this.Ha.path()+"/"+this.ud)};g.name=function(){return this.ud};g.parent=function(){return this.Ha};
function hh(a){if(null!==a.Ha){var b=a.Ha,c=a.ud,d=a.e(),e=Bb(b.A.children,c);d&&e?(delete b.A.children[c],b.A.ad--,hh(b)):d||e||(b.A.children[c]=a.A,b.A.ad++,hh(b))}};function kh(a,b,c,d,e,f){this.id=lh++;this.f=bd("p:"+this.id+":");this.qd={};this.$={};this.pa=[];this.Pc=0;this.Lc=[];this.ma=!1;this.Va=1E3;this.td=3E5;this.Hb=b;this.Kc=c;this.ue=d;this.M=a;this.pb=this.Ia=this.Db=this.ze=null;this.Vd=e;this.de=!1;this.ke=0;if(f)throw Error("Auth override specified in options, but not supported on non Node.js platforms");this.Je=f||null;this.vb=null;this.Nb=!1;this.Gd={};this.sg=0;this.Ue=!0;this.Bc=this.me=null;mh(this,0);Pf.Wb().hc("visible",this.ig,this);-1===
a.host.indexOf("fblocal")&&Of.Wb().hc("online",this.hg,this)}var lh=0,nh=0;g=kh.prototype;g.ua=function(a,b,c){var d=++this.sg;a={r:d,a:a,b:b};this.f(B(a));H(this.ma,"sendRequest call when we're not connected not allowed.");this.Ia.ua(a);c&&(this.Gd[d]=c)};
g.cf=function(a,b,c,d){var e=a.ya(),f=a.path.toString();this.f("Listen called for "+f+" "+e);this.$[f]=this.$[f]||{};H(zd(a.n)||!S(a.n),"listen() called for non-default but complete query");H(!this.$[f][e],"listen() called twice for same path/queryId.");a={G:d,ld:b,og:a,tag:c};this.$[f][e]=a;this.ma&&oh(this,a)};
function oh(a,b){var c=b.og,d=c.path.toString(),e=c.ya();a.f("Listen on "+d+" for "+e);var f={p:d};b.tag&&(f.q=Ee(c.n),f.t=b.tag);f.h=b.ld();a.ua("q",f,function(f){var k=f.d,m=f.s;if(k&&"object"===typeof k&&Bb(k,"w")){var l=x(k,"w");da(l)&&0<=Ia(l,"no_index")&&O("Using an unspecified index. Consider adding "+('".indexOn": "'+c.n.g.toString()+'"')+" at "+c.path.toString()+" to your security rules for better performance")}(a.$[d]&&a.$[d][e])===b&&(a.f("listen response",f),"ok"!==m&&ph(a,d,e),b.G&&b.G(m,
k))})}g.pf=function(a){this.pb=a;this.f("Auth token refreshed");this.pb?qh(this):this.ma&&this.ua("unauth",{},function(){});if(a&&40===a.length||pd(a))this.f("Admin auth credential detected.  Reducing max reconnect time."),this.td=3E4};function qh(a){if(a.ma&&a.pb){var b=a.pb,c={cred:b};a.Je&&(c.authvar=a.Je);a.ua("auth",c,function(c){var e=c.s;c=c.d||"error";a.pb===b&&("ok"===e?this.ke=0:rh(a,e,c))})}}
g.Df=function(a,b){var c=a.path.toString(),d=a.ya();this.f("Unlisten called for "+c+" "+d);H(zd(a.n)||!S(a.n),"unlisten() called for non-default but complete query");if(ph(this,c,d)&&this.ma){var e=Ee(a.n);this.f("Unlisten on "+c+" for "+d);c={p:c};b&&(c.q=e,c.t=b);this.ua("n",c)}};g.re=function(a,b,c){this.ma?sh(this,"o",a,b,c):this.Lc.push({we:a,action:"o",data:b,G:c})};g.ff=function(a,b,c){this.ma?sh(this,"om",a,b,c):this.Lc.push({we:a,action:"om",data:b,G:c})};
g.xd=function(a,b){this.ma?sh(this,"oc",a,null,b):this.Lc.push({we:a,action:"oc",data:null,G:b})};function sh(a,b,c,d,e){c={p:c,d:d};a.f("onDisconnect "+b,c);a.ua(b,c,function(a){e&&setTimeout(function(){e(a.s,a.d)},Math.floor(0))})}g.put=function(a,b,c,d){th(this,"p",a,b,c,d)};g.df=function(a,b,c,d){th(this,"m",a,b,c,d)};function th(a,b,c,d,e,f){d={p:c,d:d};p(f)&&(d.h=f);a.pa.push({action:b,rf:d,G:e});a.Pc++;b=a.pa.length-1;a.ma?uh(a,b):a.f("Buffering put: "+c)}
function uh(a,b){var c=a.pa[b].action,d=a.pa[b].rf,e=a.pa[b].G;a.pa[b].pg=a.ma;a.ua(c,d,function(d){a.f(c+" response",d);delete a.pa[b];a.Pc--;0===a.Pc&&(a.pa=[]);e&&e(d.s,d.d)})}g.ye=function(a){this.ma&&(a={c:a},this.f("reportStats",a),this.ua("s",a,function(a){"ok"!==a.s&&this.f("reportStats","Error sending stats: "+a.d)}))};
g.wd=function(a){if("r"in a){this.f("from server: "+B(a));var b=a.r,c=this.Gd[b];c&&(delete this.Gd[b],c(a.b))}else{if("error"in a)throw"A server-side error has occurred: "+a.error;"a"in a&&(b=a.a,a=a.b,this.f("handleServerMessage",b,a),"d"===b?this.Hb(a.p,a.d,!1,a.t):"m"===b?this.Hb(a.p,a.d,!0,a.t):"c"===b?vh(this,a.p,a.q):"ac"===b?rh(this,a.s,a.d):"sd"===b?this.ze?this.ze(a):"msg"in a&&"undefined"!==typeof console&&console.log("FIREBASE: "+a.msg.replace("\n","\nFIREBASE: ")):cd("Unrecognized action received from server: "+
B(b)+"\nAre you using the latest client?"))}};
g.Mc=function(a,b){this.f("connection ready");this.ma=!0;this.Bc=(new Date).getTime();this.ue({serverTimeOffset:a-(new Date).getTime()});this.Db=b;if(this.Ue){var c={};c["sdk.js."+firebase.SDK_VERSION.replace(/\./g,"-")]=1;"undefined"!==typeof window&&(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test("undefined"!==typeof navigator&&"string"===typeof navigator.userAgent?navigator.userAgent:"")?c["framework.cordova"]=1:"object"===typeof navigator&&
"ReactNative"===navigator.product&&(c["framework.reactnative"]=1);this.ye(c)}wh(this);this.Ue=!1;this.Kc(!0)};function mh(a,b){H(!a.Ia,"Scheduling a connect when we're already connected/ing?");a.vb&&clearTimeout(a.vb);a.vb=setTimeout(function(){a.vb=null;xh(a)},Math.floor(b))}g.ig=function(a){a&&!this.Nb&&this.Va===this.td&&(this.f("Window became visible.  Reducing delay."),this.Va=1E3,this.Ia||mh(this,0));this.Nb=a};
g.hg=function(a){a?(this.f("Browser went online."),this.Va=1E3,this.Ia||mh(this,0)):(this.f("Browser went offline.  Killing connection."),this.Ia&&this.Ia.close())};
g.hf=function(){this.f("data client disconnected");this.ma=!1;this.Ia=null;for(var a=0;a<this.pa.length;a++){var b=this.pa[a];b&&"h"in b.rf&&b.pg&&(b.G&&b.G("disconnect"),delete this.pa[a],this.Pc--)}0===this.Pc&&(this.pa=[]);this.Gd={};yh(this)&&(this.Nb?this.Bc&&(3E4<(new Date).getTime()-this.Bc&&(this.Va=1E3),this.Bc=null):(this.f("Window isn't visible.  Delaying reconnect."),this.Va=this.td,this.me=(new Date).getTime()),a=Math.max(0,this.Va-((new Date).getTime()-this.me)),a*=Math.random(),this.f("Trying to reconnect in "+
a+"ms"),mh(this,a),this.Va=Math.min(this.td,1.3*this.Va));this.Kc(!1)};
function xh(a){if(yh(a)){a.f("Making a connection attempt");a.me=(new Date).getTime();a.Bc=null;var b=r(a.wd,a),c=r(a.Mc,a),d=r(a.hf,a),e=a.id+":"+nh++,f=a.Db,h=!1,k=null,m=function(){k?k.close():(h=!0,d())};a.Ia={close:m,ua:function(a){H(k,"sendRequest call when we're not connected not allowed.");k.ua(a)}};var l=a.de;a.de=!1;a.Vd.getToken(l).then(function(l){h?E("getToken() completed but was canceled"):(E("getToken() completed. Creating connection."),a.pb=l&&l.accessToken,k=new Ye(e,a.M,b,c,d,function(b){O(b+
" ("+a.M.toString()+")");a.eb("server_kill")},f))}).then(null,function(b){a.f("Failed to get token: "+b);h||m()})}}g.eb=function(a){E("Interrupting connection for reason: "+a);this.qd[a]=!0;this.Ia?this.Ia.close():(this.vb&&(clearTimeout(this.vb),this.vb=null),this.ma&&this.hf())};g.lc=function(a){E("Resuming connection for reason: "+a);delete this.qd[a];xa(this.qd)&&(this.Va=1E3,this.Ia||mh(this,0))};
function vh(a,b,c){c=c?La(c,function(a){return jd(a)}).join("$"):"default";(a=ph(a,b,c))&&a.G&&a.G("permission_denied")}function ph(a,b,c){b=(new L(b)).toString();var d;p(a.$[b])?(d=a.$[b][c],delete a.$[b][c],0===qa(a.$[b])&&delete a.$[b]):d=void 0;return d}
function rh(a,b,c){E("Auth token revoked: "+b+"/"+c);a.pb=null;a.de=!0;a.Ia.close();"invalid_token"===b&&(a.ke++,3<=a.ke&&(a.Va=3E4,O("Provided authentication credentials are invalid. This usually indicates your FirebaseApp instance was not initialized correctly. Make sure your apiKey and databaseURL match the values provided for your app at https://console.firebase.google.com/, or if you're using a service account, make sure it's authorized to access the specified databaseURL and is from the correct project.")))}
function wh(a){qh(a);t(a.$,function(b){t(b,function(b){oh(a,b)})});for(var b=0;b<a.pa.length;b++)a.pa[b]&&uh(a,b);for(;a.Lc.length;)b=a.Lc.shift(),sh(a,b.action,b.we,b.data,b.G)}function yh(a){var b;b=Of.Wb().ic;return xa(a.qd)&&b};var Y={Wf:function(){Ne=td=!0}};Y.forceLongPolling=Y.Wf;Y.Xf=function(){Oe=!0};Y.forceWebSockets=Y.Xf;Y.cg=function(){return rd.isAvailable()};Y.isWebSocketsAvailable=Y.cg;Y.vg=function(a,b){a.w.Ua.ze=b};Y.setSecurityDebugCallback=Y.vg;Y.Be=function(a,b){a.w.Be(b)};Y.stats=Y.Be;Y.Ce=function(a,b){a.w.Ce(b)};Y.statsIncrementCounter=Y.Ce;Y.ed=function(a){return a.w.ed};Y.dataUpdateCount=Y.ed;Y.bg=function(a,b){a.w.je=b};Y.interceptServerData=Y.bg;function zh(a){this.wa=Q;this.lb=new Yg;this.De={};this.jc={};this.Dc=a}function Ah(a,b,c,d,e){var f=a.lb,h=e;H(d>f.Cc,"Stacking an older write on top of newer ones");p(h)||(h=!0);f.la.push({path:b,Ja:c,Zc:d,visible:h});h&&(f.T=Og(f.T,b,c));f.Cc=d;return e?Bh(a,new Zb(Jg,b,c)):[]}function Ch(a,b,c,d){var e=a.lb;H(d>e.Cc,"Stacking an older merge on top of newer ones");e.la.push({path:b,children:c,Zc:d,visible:!0});e.T=Pg(e.T,b,c);e.Cc=d;c=xg(c);return Bh(a,new Cd(Jg,b,c))}
function Dh(a,b,c){c=c||!1;var d=Zg(a.lb,b);if(a.lb.Ed(b)){var e=Q;null!=d.Ja?e=e.set(C,!0):Cb(d.children,function(a,b){e=e.set(new L(a),b)});return Bh(a,new Ig(d.path,e,c))}return[]}function Eh(a,b,c){c=xg(c);return Bh(a,new Cd(Lg,b,c))}function Fh(a,b,c,d){d=Gh(a,d);if(null!=d){var e=Hh(d);d=e.path;e=e.Ib;b=T(d,b);c=new Zb(new Kg(!1,!0,e,!0),b,c);return Ih(a,d,c)}return[]}
function Jh(a,b,c,d){if(d=Gh(a,d)){var e=Hh(d);d=e.path;e=e.Ib;b=T(d,b);c=xg(c);c=new Cd(new Kg(!1,!0,e,!0),b,c);return Ih(a,d,c)}return[]}
zh.prototype.Ob=function(a,b){var c=a.path,d=null,e=!1;Eg(this.wa,c,function(a,b){var f=T(a,c);d=d||b.jb(f);e=e||null!=Vg(b)});var f=this.wa.get(c);f?(e=e||null!=Vg(f),d=d||f.jb(C)):(f=new Ug,this.wa=this.wa.set(c,f));var h;null!=d?h=!0:(h=!1,d=F,Hg(this.wa.subtree(c),function(a,b){var c=b.jb(C);c&&(d=d.U(a,c))}));var k=null!=Xg(f,a);if(!k&&!S(a.n)){var m=Kh(a);H(!(m in this.jc),"View does not exist, but we have a tag");var l=Lh++;this.jc[m]=l;this.De["_"+l]=m}h=f.Ob(a,b,new ch(c,this.lb),d,h);k||
e||(f=Xg(f,a),h=h.concat(Mh(this,a,f)));return h};
zh.prototype.mb=function(a,b,c){var d=a.path,e=this.wa.get(d),f=[];if(e&&("default"===a.ya()||null!=Xg(e,a))){f=e.mb(a,b,c);e.e()&&(this.wa=this.wa.remove(d));e=f.rg;f=f.Sf;b=-1!==Pa(e,function(a){return S(a.n)});var h=Cg(this.wa,d,function(a,b){return null!=Vg(b)});if(b&&!h&&(d=this.wa.subtree(d),!d.e()))for(var d=Nh(d),k=0;k<d.length;++k){var m=d[k],l=m.W,m=Oh(this,m);this.Dc.Ae(Ph(l),Qh(this,l),m.ld,m.G)}if(!h&&0<e.length&&!c)if(b)this.Dc.Od(Ph(a),null);else{var u=this;Ja(e,function(a){a.ya();
var b=u.jc[Kh(a)];u.Dc.Od(Ph(a),b)})}Rh(this,e)}return f};zh.prototype.Ba=function(a,b){var c=this.lb,d=Cg(this.wa,a,function(b,c){var d=T(b,a);if(d=c.jb(d))return d});return c.Ba(a,d,b,!0)};function Nh(a){return Ag(a,function(a,c,d){if(c&&null!=Vg(c))return[Vg(c)];var e=[];c&&(e=Wg(c));t(d,function(a){e=e.concat(a)});return e})}function Rh(a,b){for(var c=0;c<b.length;++c){var d=b[c];if(!S(d.n)){var d=Kh(d),e=a.jc[d];delete a.jc[d];delete a.De["_"+e]}}}
function Ph(a){return S(a.n)&&!zd(a.n)?a.xb():a}function Mh(a,b,c){var d=b.path,e=Qh(a,b);c=Oh(a,c);b=a.Dc.Ae(Ph(b),e,c.ld,c.G);d=a.wa.subtree(d);if(e)H(null==Vg(d.value),"If we're adding a query, it shouldn't be shadowed");else for(e=Ag(d,function(a,b,c){if(!a.e()&&b&&null!=Vg(b))return[lg(Vg(b))];var d=[];b&&(d=d.concat(La(Wg(b),function(a){return a.W})));t(c,function(a){d=d.concat(a)});return d}),d=0;d<e.length;++d)c=e[d],a.Dc.Od(Ph(c),Qh(a,c));return b}
function Oh(a,b){var c=b.W,d=Qh(a,c);return{ld:function(){return(b.u()||F).hash()},G:function(b){if("ok"===b){if(d){var f=c.path;if(b=Gh(a,d)){var h=Hh(b);b=h.path;h=h.Ib;f=T(b,f);f=new ac(new Kg(!1,!0,h,!0),f);b=Ih(a,b,f)}else b=[]}else b=Bh(a,new ac(Lg,c.path));return b}f="Unknown Error";"too_big"===b?f="The data requested exceeds the maximum size that can be accessed with a single request.":"permission_denied"==b?f="Client doesn't have permission to access the desired data.":"unavailable"==b&&
(f="The service is unavailable");f=Error(b+" at "+c.path.toString()+": "+f);f.code=b.toUpperCase();return a.mb(c,null,f)}}}function Kh(a){return a.path.toString()+"$"+a.ya()}function Hh(a){var b=a.indexOf("$");H(-1!==b&&b<a.length-1,"Bad queryKey.");return{Ib:a.substr(b+1),path:new L(a.substr(0,b))}}function Gh(a,b){var c=a.De,d="_"+b;return d in c?c[d]:void 0}function Qh(a,b){var c=Kh(b);return x(a.jc,c)}var Lh=1;
function Ih(a,b,c){var d=a.wa.get(b);H(d,"Missing sync point for query tag that we're tracking");return d.gb(c,new ch(b,a.lb),null)}function Bh(a,b){return Sh(a,b,a.wa,null,new ch(C,a.lb))}function Sh(a,b,c,d,e){if(b.path.e())return Th(a,b,c,d,e);var f=c.get(C);null==d&&null!=f&&(d=f.jb(C));var h=[],k=J(b.path),m=b.Nc(k);if((c=c.children.get(k))&&m)var l=d?d.R(k):null,k=e.m(k),h=h.concat(Sh(a,m,c,l,k));f&&(h=h.concat(f.gb(b,e,d)));return h}
function Th(a,b,c,d,e){var f=c.get(C);null==d&&null!=f&&(d=f.jb(C));var h=[];c.children.ia(function(c,f){var l=d?d.R(c):null,u=e.m(c),z=b.Nc(c);z&&(h=h.concat(Th(a,z,f,l,u)))});f&&(h=h.concat(f.gb(b,e,d)));return h};function pf(a,b,c){this.app=c;var d=new cc(c);this.M=a;this.Xa=oc(a);this.Vc=null;this.da=new qc;this.vd=1;this.Ua=null;if(b||0<=("object"===typeof window&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i))this.va=new xd(this.M,r(this.Hb,this),d),setTimeout(r(this.Kc,this,!0),0);else{b=c.options.databaseAuthVariableOverride||null;if(null!==b){if("object"!==ca(b))throw Error("Only objects are supported for option databaseAuthVariableOverride");
try{B(b)}catch(e){throw Error("Invalid authOverride provided: "+e);}}this.va=this.Ua=new kh(this.M,r(this.Hb,this),r(this.Kc,this),r(this.ue,this),d,b)}var f=this;dc(d,function(a){f.va.pf(a)});this.xg=pc(a,r(function(){return new ic(this.Xa,this.va)},this));this.nc=new eh;this.ie=new ec;this.pd=new zh({Ae:function(a,b,c,d){b=[];c=f.ie.j(a.path);c.e()||(b=Bh(f.pd,new Zb(Lg,a.path,c)),setTimeout(function(){d("ok")},0));return b},Od:aa});Uh(this,"connected",!1);this.ja=new Qc;this.$a=new of(this);this.ed=
0;this.je=null;this.K=new zh({Ae:function(a,b,c,d){f.va.cf(a,c,b,function(b,c){var e=d(b,c);vc(f.da,a.path,e)});return[]},Od:function(a,b){f.va.Df(a,b)}})}g=pf.prototype;g.toString=function(){return(this.M.Sc?"https://":"http://")+this.M.host};g.name=function(){return this.M.pe};function Vh(a){a=a.ie.j(new L(".info/serverTimeOffset")).H()||0;return(new Date).getTime()+a}function Wh(a){a=a={timestamp:Vh(a)};a.timestamp=a.timestamp||(new Date).getTime();return a}
g.Hb=function(a,b,c,d){this.ed++;var e=new L(a);b=this.je?this.je(a,b):b;a=[];d?c?(b=oa(b,function(a){return M(a)}),a=Jh(this.K,e,b,d)):(b=M(b),a=Fh(this.K,e,b,d)):c?(d=oa(b,function(a){return M(a)}),a=Eh(this.K,e,d)):(d=M(b),a=Bh(this.K,new Zb(Lg,e,d)));d=e;0<a.length&&(d=Xh(this,e));vc(this.da,d,a)};g.Kc=function(a){Uh(this,"connected",a);!1===a&&Yh(this)};g.ue=function(a){var b=this;ld(a,function(a,d){Uh(b,d,a)})};
function Uh(a,b,c){b=new L("/.info/"+b);c=M(c);var d=a.ie;d.Jd=d.Jd.F(b,c);c=Bh(a.pd,new Zb(Lg,b,c));vc(a.da,b,c)}g.Kb=function(a,b,c,d){this.f("set",{path:a.toString(),value:b,Dg:c});var e=Wh(this);b=M(b,c);var e=Tc(b,e),f=this.vd++,e=Ah(this.K,a,e,f,!0);rc(this.da,e);var h=this;this.va.put(a.toString(),b.H(!0),function(b,c){var e="ok"===b;e||O("set at "+a+" failed: "+b);e=Dh(h.K,f,!e);vc(h.da,a,e);Zh(d,b,c)});e=$h(this,a);Xh(this,e);vc(this.da,e,[])};
g.update=function(a,b,c){this.f("update",{path:a.toString(),value:b});var d=!0,e=Wh(this),f={};t(b,function(a,b){d=!1;var c=M(a);f[b]=Tc(c,e)});if(d)E("update() called with empty data.  Don't do anything."),Zh(c,"ok");else{var h=this.vd++,k=Ch(this.K,a,f,h);rc(this.da,k);var m=this;this.va.df(a.toString(),b,function(b,d){var e="ok"===b;e||O("update at "+a+" failed: "+b);var e=Dh(m.K,h,!e),f=a;0<e.length&&(f=Xh(m,a));vc(m.da,f,e);Zh(c,b,d)});b=$h(this,a);Xh(this,b);vc(this.da,a,[])}};
function Yh(a){a.f("onDisconnectEvents");var b=Wh(a),c=[];Rc(Pc(a.ja,b),C,function(b,e){c=c.concat(Bh(a.K,new Zb(Lg,b,e)));var f=$h(a,b);Xh(a,f)});a.ja=new Qc;vc(a.da,C,c)}g.xd=function(a,b){var c=this;this.va.xd(a.toString(),function(d,e){"ok"===d&&vf(c.ja,a);Zh(b,d,e)})};function Jf(a,b,c,d){var e=M(c);a.va.re(b.toString(),e.H(!0),function(c,h){"ok"===c&&Sc(a.ja,b,e);Zh(d,c,h)})}function Kf(a,b,c,d,e){var f=M(c,d);a.va.re(b.toString(),f.H(!0),function(c,d){"ok"===c&&Sc(a.ja,b,f);Zh(e,c,d)})}
function Lf(a,b,c,d){var e=!0,f;for(f in c)e=!1;e?(E("onDisconnect().update() called with empty data.  Don't do anything."),Zh(d,"ok")):a.va.ff(b.toString(),c,function(e,f){if("ok"===e)for(var m in c){var l=M(c[m]);Sc(a.ja,b.m(m),l)}Zh(d,e,f)})}function ug(a,b,c){c=".info"===J(b.path)?a.pd.Ob(b,c):a.K.Ob(b,c);tc(a.da,b.path,c)}g.eb=function(){this.Ua&&this.Ua.eb("repo_interrupt")};g.lc=function(){this.Ua&&this.Ua.lc("repo_interrupt")};
g.Be=function(a){if("undefined"!==typeof console){a?(this.Vc||(this.Vc=new jc(this.Xa)),a=this.Vc.get()):a=this.Xa.get();var b=Ma(ta(a),function(a,b){return Math.max(b.length,a)},0),c;for(c in a){for(var d=a[c],e=c.length;e<b+2;e++)c+=" ";console.log(c+d)}}};g.Ce=function(a){lc(this.Xa,a);this.xg.yf[a]=!0};g.f=function(a){var b="";this.Ua&&(b=this.Ua.id+":");E(b,arguments)};
function Zh(a,b,c){a&&Tb(function(){if("ok"==b)a(null);else{var d=(b||"error").toUpperCase(),e=d;c&&(e+=": "+c);e=Error(e);e.code=d;a(e)}})};function ai(a,b,c,d,e){function f(){}a.f("transaction on "+b);var h=new U(a,b);h.hc("value",f);c={path:b,update:c,G:d,status:null,kf:Vc(),Ie:e,uf:0,Rd:function(){h.Jc("value",f)},Td:null,Da:null,bd:null,cd:null,dd:null};d=a.K.Ba(b,void 0)||F;c.bd=d;d=c.update(d.H());if(p(d)){Bf("transaction failed: Data returned ",d,c.path);c.status=1;e=fh(a.nc,b);var k=e.Ea()||[];k.push(c);gh(e,k);"object"===typeof d&&null!==d&&Bb(d,".priority")?(k=x(d,".priority"),H(zf(k),"Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null.")):
k=(a.K.Ba(b)||F).C().H();e=Wh(a);d=M(d,k);e=Tc(d,e);c.cd=d;c.dd=e;c.Da=a.vd++;c=Ah(a.K,b,e,c.Da,c.Ie);vc(a.da,b,c);bi(a)}else c.Rd(),c.cd=null,c.dd=null,c.G&&(a=new W(c.bd,new U(a,c.path),N),c.G(null,!1,a))}function bi(a,b){var c=b||a.nc;b||ci(a,c);if(null!==c.Ea()){var d=di(a,c);H(0<d.length,"Sending zero length transaction queue");Na(d,function(a){return 1===a.status})&&ei(a,c.path(),d)}else c.kd()&&c.P(function(b){bi(a,b)})}
function ei(a,b,c){for(var d=La(c,function(a){return a.Da}),e=a.K.Ba(b,d)||F,d=e,e=e.hash(),f=0;f<c.length;f++){var h=c[f];H(1===h.status,"tryToSendTransactionQueue_: items in queue should all be run.");h.status=2;h.uf++;var k=T(b,h.path),d=d.F(k,h.cd)}d=d.H(!0);a.va.put(b.toString(),d,function(d){a.f("transaction put response",{path:b.toString(),status:d});var e=[];if("ok"===d){d=[];for(f=0;f<c.length;f++){c[f].status=3;e=e.concat(Dh(a.K,c[f].Da));if(c[f].G){var h=c[f].dd,k=new U(a,c[f].path);d.push(r(c[f].G,
null,null,!0,new W(h,k,N)))}c[f].Rd()}ci(a,fh(a.nc,b));bi(a);vc(a.da,b,e);for(f=0;f<d.length;f++)Tb(d[f])}else{if("datastale"===d)for(f=0;f<c.length;f++)c[f].status=4===c[f].status?5:1;else for(O("transaction at "+b.toString()+" failed: "+d),f=0;f<c.length;f++)c[f].status=5,c[f].Td=d;Xh(a,b)}},e)}function Xh(a,b){var c=fi(a,b),d=c.path(),c=di(a,c);gi(a,c,d);return d}
function gi(a,b,c){if(0!==b.length){for(var d=[],e=[],f=La(b,function(a){return a.Da}),h=0;h<b.length;h++){var k=b[h],m=T(c,k.path),l=!1,u;H(null!==m,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===k.status)l=!0,u=k.Td,e=e.concat(Dh(a.K,k.Da,!0));else if(1===k.status)if(25<=k.uf)l=!0,u="maxretry",e=e.concat(Dh(a.K,k.Da,!0));else{var z=a.K.Ba(k.path,f)||F;k.bd=z;var G=b[h].update(z.H());p(G)?(Bf("transaction failed: Data returned ",G,k.path),m=M(G),"object"===typeof G&&null!=
G&&Bb(G,".priority")||(m=m.ga(z.C())),z=k.Da,G=Wh(a),G=Tc(m,G),k.cd=m,k.dd=G,k.Da=a.vd++,Qa(f,z),e=e.concat(Ah(a.K,k.path,G,k.Da,k.Ie)),e=e.concat(Dh(a.K,z,!0))):(l=!0,u="nodata",e=e.concat(Dh(a.K,k.Da,!0)))}vc(a.da,c,e);e=[];l&&(b[h].status=3,setTimeout(b[h].Rd,Math.floor(0)),b[h].G&&("nodata"===u?(k=new U(a,b[h].path),d.push(r(b[h].G,null,null,!1,new W(b[h].bd,k,N)))):d.push(r(b[h].G,null,Error(u),!1,null))))}ci(a,a.nc);for(h=0;h<d.length;h++)Tb(d[h]);bi(a)}}
function fi(a,b){for(var c,d=a.nc;null!==(c=J(b))&&null===d.Ea();)d=fh(d,c),b=D(b);return d}function di(a,b){var c=[];hi(a,b,c);c.sort(function(a,b){return a.kf-b.kf});return c}function hi(a,b,c){var d=b.Ea();if(null!==d)for(var e=0;e<d.length;e++)c.push(d[e]);b.P(function(b){hi(a,b,c)})}function ci(a,b){var c=b.Ea();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;gh(b,0<c.length?c:null)}b.P(function(b){ci(a,b)})}
function $h(a,b){var c=fi(a,b).path(),d=fh(a.nc,b);jh(d,function(b){ii(a,b)});ii(a,d);ih(d,function(b){ii(a,b)});return c}
function ii(a,b){var c=b.Ea();if(null!==c){for(var d=[],e=[],f=-1,h=0;h<c.length;h++)4!==c[h].status&&(2===c[h].status?(H(f===h-1,"All SENT items should be at beginning of queue."),f=h,c[h].status=4,c[h].Td="set"):(H(1===c[h].status,"Unexpected transaction status in abort"),c[h].Rd(),e=e.concat(Dh(a.K,c[h].Da,!0)),c[h].G&&d.push(r(c[h].G,null,Error("set"),!1,null))));-1===f?gh(b,null):c.length=f+1;vc(a.da,b.path(),e);for(h=0;h<d.length;h++)Tb(d[h])}};function uf(){this.nb={};this.Ef=!1}uf.prototype.eb=function(){for(var a in this.nb)this.nb[a].eb()};uf.prototype.lc=function(){for(var a in this.nb)this.nb[a].lc()};uf.prototype.ce=function(a){this.Ef=a};ba(uf);uf.prototype.interrupt=uf.prototype.eb;uf.prototype.resume=uf.prototype.lc;var Z={};Z.pc=kh;Z.DataConnection=Z.pc;kh.prototype.wg=function(a,b){this.ua("q",{p:a},b)};Z.pc.prototype.simpleListen=Z.pc.prototype.wg;kh.prototype.Pf=function(a,b){this.ua("echo",{d:a},b)};Z.pc.prototype.echo=Z.pc.prototype.Pf;kh.prototype.interrupt=kh.prototype.eb;Z.Hf=Ye;Z.RealTimeConnection=Z.Hf;Ye.prototype.sendRequest=Ye.prototype.ua;Ye.prototype.close=Ye.prototype.close;
Z.ag=function(a){var b=kh.prototype.put;kh.prototype.put=function(c,d,e,f){p(f)&&(f=a());b.call(this,c,d,e,f)};return function(){kh.prototype.put=b}};Z.hijackHash=Z.ag;Z.Gf=fc;Z.ConnectionTarget=Z.Gf;Z.ya=function(a){return a.ya()};Z.queryIdentifier=Z.ya;Z.dg=function(a){return a.w.Ua.$};Z.listens=Z.dg;Z.ce=function(a){uf.Wb().ce(a)};Z.forceRestClient=Z.ce;Z.Context=uf;function U(a,b){if(!(a instanceof pf))throw Error("new Firebase() no longer supported - use app.database().");X.call(this,a,b,Be,!1);this.then=void 0;this["catch"]=void 0}ka(U,X);g=U.prototype;g.getKey=function(){y("Firebase.key",0,0,arguments.length);return this.path.e()?null:Xd(this.path)};
g.m=function(a){y("Firebase.child",1,1,arguments.length);if(fa(a))a=String(a);else if(!(a instanceof L))if(null===J(this.path)){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Hf("Firebase.child",b)}else Hf("Firebase.child",a);return new U(this.w,this.path.m(a))};g.getParent=function(){y("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return null===a?null:new U(this.w,a)};
g.Yf=function(){y("Firebase.ref",0,0,arguments.length);for(var a=this;null!==a.getParent();)a=a.getParent();return a};g.Of=function(){return this.w.$a};g.set=function(a,b){y("Firebase.set",1,2,arguments.length);If("Firebase.set",this.path);Af("Firebase.set",a,this.path,!1);A("Firebase.set",2,b,!0);var c=new Hb;this.w.Kb(this.path,a,null,Ib(c,b));return c.ra};
g.update=function(a,b){y("Firebase.update",1,2,arguments.length);If("Firebase.update",this.path);if(da(a)){for(var c={},d=0;d<a.length;++d)c[""+d]=a[d];a=c;O("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.")}Df("Firebase.update",a,this.path);A("Firebase.update",2,b,!0);c=new Hb;this.w.update(this.path,a,Ib(c,b));return c.ra};
g.Kb=function(a,b,c){y("Firebase.setWithPriority",2,3,arguments.length);If("Firebase.setWithPriority",this.path);Af("Firebase.setWithPriority",a,this.path,!1);Ef("Firebase.setWithPriority",2,b);A("Firebase.setWithPriority",3,c,!0);if(".length"===this.getKey()||".keys"===this.getKey())throw"Firebase.setWithPriority failed: "+this.getKey()+" is a read-only object.";var d=new Hb;this.w.Kb(this.path,a,b,Ib(d,c));return d.ra};
g.remove=function(a){y("Firebase.remove",0,1,arguments.length);If("Firebase.remove",this.path);A("Firebase.remove",1,a,!0);return this.set(null,a)};
g.transaction=function(a,b,c){y("Firebase.transaction",1,3,arguments.length);If("Firebase.transaction",this.path);A("Firebase.transaction",1,a,!1);A("Firebase.transaction",2,b,!0);if(p(c)&&"boolean"!=typeof c)throw Error(Db("Firebase.transaction",3,!0)+"must be a boolean.");if(".length"===this.getKey()||".keys"===this.getKey())throw"Firebase.transaction failed: "+this.getKey()+" is a read-only object.";"undefined"===typeof c&&(c=!0);var d=new Hb;ga(b)&&Jb(d.ra);ai(this.w,this.path,a,function(a,c,
h){a?d.reject(a):d.resolve(new Pb(c,h));ga(b)&&b(a,c,h)},c);return d.ra};g.ug=function(a,b){y("Firebase.setPriority",1,2,arguments.length);If("Firebase.setPriority",this.path);Ef("Firebase.setPriority",1,a);A("Firebase.setPriority",2,b,!0);var c=new Hb;this.w.Kb(this.path.m(".priority"),a,null,Ib(c,b));return c.ra};
g.push=function(a,b){y("Firebase.push",0,2,arguments.length);If("Firebase.push",this.path);Af("Firebase.push",a,this.path,!0);A("Firebase.push",2,b,!0);var c=Vh(this.w),d=Qf(c),c=this.m(d);if(null!=a){var e=this,f=c.set(a,b).then(function(){return e.m(d)});c.then=r(f.then,f);c["catch"]=r(f.then,f,void 0);ga(b)&&Jb(f)}return c};g.kb=function(){If("Firebase.onDisconnect",this.path);return new V(this.w,this.path)};U.prototype.child=U.prototype.m;U.prototype.set=U.prototype.set;U.prototype.update=U.prototype.update;
U.prototype.setWithPriority=U.prototype.Kb;U.prototype.remove=U.prototype.remove;U.prototype.transaction=U.prototype.transaction;U.prototype.setPriority=U.prototype.ug;U.prototype.push=U.prototype.push;U.prototype.onDisconnect=U.prototype.kb;od(U.prototype,"database",U.prototype.Of);od(U.prototype,"key",U.prototype.getKey);od(U.prototype,"parent",U.prototype.getParent);od(U.prototype,"root",U.prototype.Yf);if("undefined"===typeof firebase)throw Error("Cannot install Firebase Database - be sure to load firebase-app.js first.");
try{firebase.INTERNAL.registerService("database",function(a){var b=uf.Wb(),c=a.options.databaseURL;p(c)||dd("Can't determine Firebase Database URL.  Be sure to include databaseURL option when calling firebase.intializeApp().");var d=ed(c),c=d.kc;tf("Invalid Firebase Database URL",d);d.path.e()||dd("Database URL must point to the root of a Firebase Database (not including a child path).");(d=x(b.nb,a.name))&&dd("FIREBASE INTERNAL ERROR: Database initialized multiple times.");d=new pf(c,b.Ef,a);b.nb[a.name]=
d;return d.$a},{Reference:U,Query:X,Database:of,enableLogging:ad,INTERNAL:Y,TEST_ACCESS:Z,ServerValue:rf})}catch(ji){dd("Failed to register the Firebase Database Service ("+ji+")")};})();

(function() {var k,aa=aa||{},m=this,n=function(a){return void 0!==a},ba=function(){},p=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=
typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==b&&"undefined"==typeof a.call)return"object";return b},ca=function(a){var b=p(a);return"array"==b||"object"==b&&"number"==typeof a.length},q=function(a){return"string"==typeof a},r=function(a){return"function"==p(a)},da=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b},ea="closure_uid_"+(1E9*Math.random()>>>0),fa=0,ga=function(a,b,c){return a.call.apply(a.bind,
arguments)},ha=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}},t=function(a,b,c){t=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ga:ha;return t.apply(null,arguments)},ia=Date.now||function(){return+new Date},u=function(a,b){function c(){}
c.prototype=b.prototype;a.G=b.prototype;a.prototype=new c;a.Ma=function(a,c,f){for(var g=Array(arguments.length-2),h=2;h<arguments.length;h++)g[h-2]=arguments[h];return b.prototype[c].apply(a,g)}};var ja=function(a,b,c){function d(){N||(N=!0,b.apply(null,arguments))}function e(b){l=setTimeout(function(){l=null;a(f,2===w)},b)}function f(a,b){if(!N)if(a)d.apply(null,arguments);else if(2===w||B)d.apply(null,arguments);else{64>h&&(h*=2);var c;1===w?(w=2,c=0):c=1E3*(h+Math.random());e(c)}}function g(a){Tb||(Tb=!0,N||(null!==l?(a||(w=2),clearTimeout(l),e(0)):a||(w=1)))}var h=1,l=null,B=!1,w=0,N=!1,Tb=!1;e(0);setTimeout(function(){B=!0;g(!0)},c);return g};var ka="https://firebasestorage.googleapis.com";var v=function(a,b){this.code="storage/"+a;this.message="Firebase Storage: "+b;this.serverResponse=null;this.name="FirebaseError"};u(v,Error);var la=function(){return new v("unknown","An unknown error occurred, please check the error payload for server response.")},ma=function(){return new v("canceled","User canceled the upload/download.")},na=function(a,b,c){return new v("invalid-argument","Invalid argument in `"+b+"` at index "+a+": "+c)},oa=function(){return new v("app-deleted","The Firebase app was deleted.")};var pa=function(a,b){for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&b(c,a[c])},qa=function(a){var b={};pa(a,function(a,d){b[a]=d});return b};var x=function(a,b,c,d){this.l=a;this.f={};this.i=b;this.b={};this.c="";this.N=c;this.g=this.a=null;this.h=[200];this.j=d};var ra={STATE_CHANGED:"state_changed"},sa={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"},ta=function(a){switch(a){case "running":case "pausing":case "canceling":return"running";case "paused":return"paused";case "success":return"success";case "canceled":return"canceled";case "error":return"error";default:return"error"}};var y=function(a){return n(a)&&null!==a},ua=function(a){return"string"===typeof a||a instanceof String};var va=function(a,b,c){this.f=c;this.c=a;this.g=b;this.b=0;this.a=null};va.prototype.get=function(){var a;0<this.b?(this.b--,a=this.a,this.a=a.next,a.next=null):a=this.c();return a};var wa=function(a,b){a.g(b);a.b<a.f&&(a.b++,b.next=a.a,a.a=b)};var xa=function(a){if(Error.captureStackTrace)Error.captureStackTrace(this,xa);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))};u(xa,Error);xa.prototype.name="CustomError";var ya=function(a,b,c,d,e){this.reset(a,b,c,d,e)};ya.prototype.a=null;var za=0;ya.prototype.reset=function(a,b,c,d,e){"number"==typeof e||za++;d||ia();this.b=b;delete this.a};var Aa=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b},Ba=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b},Ca="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),Da=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Ca.length;f++)c=Ca[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};var Ea=function(a){a.prototype.then=a.prototype.then;a.prototype.$goog_Thenable=!0},Fa=function(a){if(!a)return!1;try{return!!a.$goog_Thenable}catch(b){return!1}};var Ga=function(a){Ga[" "](a);return a};Ga[" "]=ba;var Ha=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")},Ia=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},Ja=function(a,b){return a<b?-1:a>b?1:0};var Ka=function(a,b){this.a=a;this.b=b};Ka.prototype.clone=function(){return new Ka(this.a,this.b)};var z=function(a,b){this.bucket=a;this.path=b},La=function(a){var b=encodeURIComponent;return"/b/"+b(a.bucket)+"/o/"+b(a.path)},Ma=function(a){for(var b=null,c=[{ja:/^gs:\/\/([A-Za-z0-9.\-]+)(\/(.*))?$/i,aa:{bucket:1,path:3},ia:function(a){"/"===a.path.charAt(a.path.length-1)&&(a.path=a.path.slice(0,-1))}},{ja:/^https?:\/\/firebasestorage\.googleapis\.com\/v[A-Za-z0-9_]+\/b\/([A-Za-z0-9.\-]+)\/o(\/([^?#]*).*)?$/i,aa:{bucket:1,path:3},ia:function(a){a.path=decodeURIComponent(a.path)}}],d=0;d<c.length;d++){var e=
c[d],f=e.ja.exec(a);if(f){b=f[e.aa.bucket];(f=f[e.aa.path])||(f="");b=new z(b,f);e.ia(b);break}}if(null==b)throw new v("invalid-url","Invalid URL '"+a+"'.");return b};var Na=function(a,b,c){r(a)||y(b)||y(c)?(this.next=a,this.error=b||null,this.a=c||null):(this.next=a.next||null,this.error=a.error||null,this.a=a.complete||null)};var Oa=function(a){var b=encodeURIComponent,c="?";pa(a,function(a,e){a=b(a)+"="+b(e);c=c+a+"&"});return c=c.slice(0,-1)};var A=function(a,b,c,d,e,f){this.b=a;this.h=b;this.f=c;this.a=d;this.g=e;this.c=f};k=A.prototype;k.qa=function(){return this.b};k.La=function(){return this.h};k.Ia=function(){return this.f};k.Da=function(){return this.a};k.sa=function(){if(y(this.a)){var a=this.a.downloadURLs;return y(a)&&y(a[0])?a[0]:null}return null};k.Ka=function(){return this.g};k.Ga=function(){return this.c};var Pa=function(a,b){b.unshift(a);xa.call(this,Ha.apply(null,b));b.shift()};u(Pa,xa);Pa.prototype.name="AssertionError";
var Qa=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);throw new Pa(""+e,f||[]);},C=function(a,b,c){a||Qa("",null,b,Array.prototype.slice.call(arguments,2))},Ra=function(a,b){throw new Pa("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));},Sa=function(a,b,c){r(a)||Qa("Expected function but got %s: %s.",[p(a),a],b,Array.prototype.slice.call(arguments,2))};var D=function(){this.g=this.g;this.s=this.s};D.prototype.g=!1;D.prototype.fa=function(){this.g||(this.g=!0,this.A())};D.prototype.A=function(){if(this.s)for(;this.s.length;)this.s.shift()()};var Ta="closure_listenable_"+(1E6*Math.random()|0),Ua=0;var Wa;a:{var Xa=m.navigator;if(Xa){var Ya=Xa.userAgent;if(Ya){Wa=Ya;break a}}Wa=""}var E=function(a){return-1!=Wa.indexOf(a)};var Za=function(){};Za.prototype.a=null;var ab=function(a){var b;(b=a.a)||(b={},$a(a)&&(b[0]=!0,b[1]=!0),b=a.a=b);return b};var bb=Array.prototype.indexOf?function(a,b,c){C(null!=a.length);return Array.prototype.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(q(a))return q(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},cb=Array.prototype.forEach?function(a,b,c){C(null!=a.length);Array.prototype.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},db=Array.prototype.filter?function(a,
b,c){C(null!=a.length);return Array.prototype.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=q(a)?a.split(""):a,h=0;h<d;h++)if(h in g){var l=g[h];b.call(c,l,h,a)&&(e[f++]=l)}return e},eb=Array.prototype.map?function(a,b,c){C(null!=a.length);return Array.prototype.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=q(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e},fb=Array.prototype.some?function(a,b,c){C(null!=a.length);return Array.prototype.some.call(a,
b,c)}:function(a,b,c){for(var d=a.length,e=q(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1},hb=function(a){var b;a:{b=gb;for(var c=a.length,d=q(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:q(a)?a.charAt(b):a[b]},ib=function(a){if("array"!=p(a))for(var b=a.length-1;0<=b;b--)delete a[b];a.length=0},jb=function(a,b){b=bb(a,b);var c;if(c=0<=b)C(null!=a.length),Array.prototype.splice.call(a,b,1);return c},kb=function(a){var b=
a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]};var mb=new va(function(){return new lb},function(a){a.reset()},100),ob=function(){var a=nb,b=null;a.a&&(b=a.a,a.a=a.a.next,a.a||(a.b=null),b.next=null);return b},lb=function(){this.next=this.b=this.a=null};lb.prototype.set=function(a,b){this.a=a;this.b=b;this.next=null};lb.prototype.reset=function(){this.next=this.b=this.a=null};var pb=function(a,b){this.type=a;this.a=this.target=b;this.ka=!0};pb.prototype.b=function(){this.ka=!1};var qb=function(a,b,c,d,e){this.listener=a;this.a=null;this.src=b;this.type=c;this.U=!!d;this.N=e;++Ua;this.O=this.T=!1},rb=function(a){a.O=!0;a.listener=null;a.a=null;a.src=null;a.N=null};var sb=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;var tb=function(a,b){b=db(b.split("/"),function(a){return 0<a.length}).join("/");return 0===a.length?b:a+"/"+b},ub=function(a){var b=a.lastIndexOf("/",a.length-2);return-1===b?a:a.slice(b+1)};var vb=function(a){this.src=a;this.a={};this.b=0},xb=function(a,b,c,d,e,f){var g=b.toString();b=a.a[g];b||(b=a.a[g]=[],a.b++);var h=wb(b,c,e,f);-1<h?(a=b[h],d||(a.T=!1)):(a=new qb(c,a.src,g,!!e,f),a.T=d,b.push(a));return a},yb=function(a,b){var c=b.type;c in a.a&&jb(a.a[c],b)&&(rb(b),0==a.a[c].length&&(delete a.a[c],a.b--))},wb=function(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.O&&f.listener==b&&f.U==!!c&&f.N==d)return e}return-1};var zb,Ab=function(){};u(Ab,Za);var Bb=function(a){return(a=$a(a))?new ActiveXObject(a):new XMLHttpRequest},$a=function(a){if(!a.b&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.b=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.b};zb=new Ab;var Cb=function(a){this.a=[];if(a)a:{var b;if(a instanceof Cb){if(b=a.D(),a=a.w(),0>=this.o()){for(var c=this.a,d=0;d<b.length;d++)c.push(new Ka(b[d],a[d]));break a}}else b=Ba(a),a=Aa(a);for(d=0;d<b.length;d++)Db(this,b[d],a[d])}},Db=function(a,b,c){var d=a.a;d.push(new Ka(b,c));b=d.length-1;a=a.a;for(c=a[b];0<b;)if(d=b-1>>1,a[d].a>c.a)a[b]=a[d],b=d;else break;a[b]=c};k=Cb.prototype;k.w=function(){for(var a=this.a,b=[],c=a.length,d=0;d<c;d++)b.push(a[d].b);return b};
k.D=function(){for(var a=this.a,b=[],c=a.length,d=0;d<c;d++)b.push(a[d].a);return b};k.clone=function(){return new Cb(this)};k.o=function(){return this.a.length};k.F=function(){return 0==this.a.length};k.clear=function(){ib(this.a)};var Eb=function(){this.b=[];this.a=[]},Fb=function(a){0==a.b.length&&(a.b=a.a,a.b.reverse(),a.a=[]);return a.b.pop()};Eb.prototype.o=function(){return this.b.length+this.a.length};Eb.prototype.F=function(){return 0==this.b.length&&0==this.a.length};Eb.prototype.clear=function(){this.b=[];this.a=[]};Eb.prototype.w=function(){for(var a=[],b=this.b.length-1;0<=b;--b)a.push(this.b[b]);for(var c=this.a.length,b=0;b<c;++b)a.push(this.a[b]);return a};var Gb=function(a){if(a.w&&"function"==typeof a.w)return a.w();if(q(a))return a.split("");if(ca(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Aa(a)},Hb=function(a,b){if(a.forEach&&"function"==typeof a.forEach)a.forEach(b,void 0);else if(ca(a)||q(a))cb(a,b,void 0);else{var c;if(a.D&&"function"==typeof a.D)c=a.D();else if(a.w&&"function"==typeof a.w)c=void 0;else if(ca(a)||q(a)){c=[];for(var d=a.length,e=0;e<d;e++)c.push(e)}else c=Ba(a);for(var d=Gb(a),e=d.length,f=0;f<e;f++)b.call(void 0,
d[f],c&&c[f],a)}};var Ib=function(a){m.setTimeout(function(){throw a;},0)},Jb,Kb=function(){var a=m.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!E("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,
a=t(function(a){if(("*"==d||a.origin==d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!E("Trident")&&!E("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(n(c.next)){c=c.next;var a=c.ea;c.ea=null;a()}};return function(a){d.next={ea:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?
function(a){var b=document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){m.setTimeout(a,0)}};var Lb="StopIteration"in m?m.StopIteration:{message:"StopIteration",stack:""},Mb=function(){};Mb.prototype.next=function(){throw Lb;};Mb.prototype.Y=function(){return this};var Nb=function(){Cb.call(this)};u(Nb,Cb);var Ob=E("Opera"),F=E("Trident")||E("MSIE"),Pb=E("Edge"),Qb=E("Gecko")&&!(-1!=Wa.toLowerCase().indexOf("webkit")&&!E("Edge"))&&!(E("Trident")||E("MSIE"))&&!E("Edge"),Rb=-1!=Wa.toLowerCase().indexOf("webkit")&&!E("Edge"),Sb=function(){var a=m.document;return a?a.documentMode:void 0},Ub;
a:{var Vb="",Wb=function(){var a=Wa;if(Qb)return/rv\:([^\);]+)(\)|;)/.exec(a);if(Pb)return/Edge\/([\d\.]+)/.exec(a);if(F)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(Rb)return/WebKit\/(\S+)/.exec(a);if(Ob)return/(?:Version)[ \/]?(\S+)/.exec(a)}();Wb&&(Vb=Wb?Wb[1]:"");if(F){var Xb=Sb();if(null!=Xb&&Xb>parseFloat(Vb)){Ub=String(Xb);break a}}Ub=Vb}
var Yb=Ub,Zb={},G=function(a){var b;if(!(b=Zb[a])){b=0;for(var c=Ia(String(Yb)).split("."),d=Ia(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var g=c[f]||"",h=d[f]||"",l=/(\d*)(\D*)/g,B=/(\d*)(\D*)/g;do{var w=l.exec(g)||["","",""],N=B.exec(h)||["","",""];if(0==w[0].length&&0==N[0].length)break;b=Ja(0==w[1].length?0:parseInt(w[1],10),0==N[1].length?0:parseInt(N[1],10))||Ja(0==w[2].length,0==N[2].length)||Ja(w[2],N[2])}while(0==b)}b=Zb[a]=0<=b}return b},$b=m.document,ac=$b&&
F?Sb()||("CSS1Compat"==$b.compatMode?parseInt(Yb,10):5):void 0;var ec=function(a,b){bc||cc();dc||(bc(),dc=!0);var c=nb,d=mb.get();d.set(a,b);c.b?c.b.next=d:(C(!c.a),c.a=d);c.b=d},bc,cc=function(){if(m.Promise&&m.Promise.resolve){var a=m.Promise.resolve(void 0);bc=function(){a.then(fc)}}else bc=function(){var a=fc;!r(m.setImmediate)||m.Window&&m.Window.prototype&&!E("Edge")&&m.Window.prototype.setImmediate==m.setImmediate?(Jb||(Jb=Kb()),Jb(a)):m.setImmediate(a)}},dc=!1,nb=new function(){this.b=this.a=null},fc=function(){for(var a;a=ob();){try{a.a.call(a.b)}catch(b){Ib(b)}wa(mb,
a)}dc=!1};var gc;(gc=!F)||(gc=9<=Number(ac));var hc=gc,ic=F&&!G("9");!Rb||G("528");Qb&&G("1.9b")||F&&G("8")||Ob&&G("9.5")||Rb&&G("528");Qb&&!G("8")||F&&G("9");var jc=function(a,b){this.b={};this.a=[];this.f=this.c=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else if(a){a instanceof jc?(c=a.D(),d=a.w()):(c=Ba(a),d=Aa(a));for(var e=0;e<c.length;e++)this.set(c[e],d[e])}};k=jc.prototype;k.o=function(){return this.c};k.w=function(){kc(this);for(var a=[],b=0;b<this.a.length;b++)a.push(this.b[this.a[b]]);return a};k.D=function(){kc(this);return this.a.concat()};
k.F=function(){return 0==this.c};k.clear=function(){this.b={};this.f=this.c=this.a.length=0};
var lc=function(a,b){return Object.prototype.hasOwnProperty.call(a.b,b)?(delete a.b[b],a.c--,a.f++,a.a.length>2*a.c&&kc(a),!0):!1},kc=function(a){if(a.c!=a.a.length){for(var b=0,c=0;b<a.a.length;){var d=a.a[b];Object.prototype.hasOwnProperty.call(a.b,d)&&(a.a[c++]=d);b++}a.a.length=c}if(a.c!=a.a.length){for(var e={},c=b=0;b<a.a.length;)d=a.a[b],Object.prototype.hasOwnProperty.call(e,d)||(a.a[c++]=d,e[d]=1),b++;a.a.length=c}};k=jc.prototype;
k.get=function(a,b){return Object.prototype.hasOwnProperty.call(this.b,a)?this.b[a]:b};k.set=function(a,b){Object.prototype.hasOwnProperty.call(this.b,a)||(this.c++,this.a.push(a),this.f++);this.b[a]=b};k.forEach=function(a,b){for(var c=this.D(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};k.clone=function(){return new jc(this)};
k.Y=function(a){kc(this);var b=0,c=this.f,d=this,e=new Mb;e.next=function(){if(c!=d.f)throw Error("The map has changed since the iterator was created");if(b>=d.a.length)throw Lb;var e=d.a[b++];return a?e:d.b[e]};return e};var mc=function(a,b){pb.call(this,a?a.type:"");this.c=this.a=this.target=null;if(a){this.type=a.type;this.target=a.target||a.srcElement;this.a=b;if((b=a.relatedTarget)&&Qb)try{Ga(b.nodeName)}catch(c){}this.c=a;a.defaultPrevented&&this.b()}};u(mc,pb);mc.prototype.b=function(){mc.G.b.call(this);var a=this.c;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,ic)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var H=function(a,b){this.a=0;this.i=void 0;this.c=this.b=this.f=null;this.g=this.h=!1;if(a!=ba)try{var c=this;a.call(b,function(a){nc(c,2,a)},function(a){try{if(a instanceof Error)throw a;throw Error("Promise rejected.");}catch(b){}nc(c,3,a)})}catch(d){nc(this,3,d)}},oc=function(){this.next=this.f=this.c=this.a=this.b=null;this.g=!1};oc.prototype.reset=function(){this.f=this.c=this.a=this.b=null;this.g=!1};
var pc=new va(function(){return new oc},function(a){a.reset()},100),qc=function(a,b,c){var d=pc.get();d.a=a;d.c=b;d.f=c;return d},rc=function(a){if(a instanceof H)return a;var b=new H(ba);nc(b,2,a);return b},sc=function(a){return new H(function(b,c){c(a)})};
H.prototype.then=function(a,b,c){null!=a&&Sa(a,"opt_onFulfilled should be a function.");null!=b&&Sa(b,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?");return tc(this,r(a)?a:null,r(b)?b:null,c)};Ea(H);H.prototype.l=function(a,b){return tc(this,null,a,b)};
var vc=function(a,b){a.b||2!=a.a&&3!=a.a||uc(a);C(null!=b.a);a.c?a.c.next=b:a.b=b;a.c=b},tc=function(a,b,c,d){var e=qc(null,null,null);e.b=new H(function(a,g){e.a=b?function(c){try{var e=b.call(d,c);a(e)}catch(B){g(B)}}:a;e.c=c?function(b){try{var e=c.call(d,b);a(e)}catch(B){g(B)}}:g});e.b.f=a;vc(a,e);return e.b};H.prototype.s=function(a){C(1==this.a);this.a=0;nc(this,2,a)};H.prototype.m=function(a){C(1==this.a);this.a=0;nc(this,3,a)};
var nc=function(a,b,c){if(0==a.a){a===c&&(b=3,c=new TypeError("Promise cannot resolve to itself"));a.a=1;var d;a:{var e=c,f=a.s,g=a.m;if(e instanceof H)null!=f&&Sa(f,"opt_onFulfilled should be a function."),null!=g&&Sa(g,"opt_onRejected should be a function. Did you pass opt_context as the second argument instead of the third?"),vc(e,qc(f||ba,g||null,a)),d=!0;else if(Fa(e))e.then(f,g,a),d=!0;else{if(da(e))try{var h=e.then;if(r(h)){wc(e,h,f,g,a);d=!0;break a}}catch(l){g.call(a,l);d=!0;break a}d=!1}}d||
(a.i=c,a.a=b,a.f=null,uc(a),3!=b||xc(a,c))}},wc=function(a,b,c,d,e){var f=!1,g=function(a){f||(f=!0,c.call(e,a))},h=function(a){f||(f=!0,d.call(e,a))};try{b.call(a,g,h)}catch(l){h(l)}},uc=function(a){a.h||(a.h=!0,ec(a.j,a))},yc=function(a){var b=null;a.b&&(b=a.b,a.b=b.next,b.next=null);a.b||(a.c=null);null!=b&&C(null!=b.a);return b};
H.prototype.j=function(){for(var a;a=yc(this);){var b=this.a,c=this.i;if(3==b&&a.c&&!a.g){var d;for(d=this;d&&d.g;d=d.f)d.g=!1}if(a.b)a.b.f=null,zc(a,b,c);else try{a.g?a.a.call(a.f):zc(a,b,c)}catch(e){Ac.call(null,e)}wa(pc,a)}this.h=!1};var zc=function(a,b,c){2==b?a.a.call(a.f,c):a.c&&a.c.call(a.f,c)},xc=function(a,b){a.g=!0;ec(function(){a.g&&Ac.call(null,b)})},Ac=Ib;var Cc=function(a){this.a=new jc;if(a){a=Gb(a);for(var b=a.length,c=0;c<b;c++){var d=a[c];this.a.set(Bc(d),d)}}},Bc=function(a){var b=typeof a;return"object"==b&&a||"function"==b?"o"+(a[ea]||(a[ea]=++fa)):b.substr(0,1)+a};k=Cc.prototype;k.o=function(){return this.a.o()};k.clear=function(){this.a.clear()};k.F=function(){return this.a.F()};k.w=function(){return this.a.w()};k.clone=function(){return new Cc(this)};k.Y=function(){return this.a.Y(!1)};var Dc=function(a){return function(){var b=[];Array.prototype.push.apply(b,arguments);rc(!0).then(function(){a.apply(null,b)})}};var Ec="closure_lm_"+(1E6*Math.random()|0),Fc={},Gc=0,Hc=function(a,b,c,d,e){if("array"==p(b)){for(var f=0;f<b.length;f++)Hc(a,b[f],c,d,e);return null}c=Ic(c);a&&a[Ta]?(Jc(a),a=xb(a.b,String(b),c,!1,d,e)):a=Kc(a,b,c,!1,d,e);return a},Kc=function(a,b,c,d,e,f){if(!b)throw Error("Invalid event type");var g=!!e,h=Lc(a);h||(a[Ec]=h=new vb(a));c=xb(h,b,c,d,e,f);if(c.a)return c;d=Mc();c.a=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,g);else if(a.attachEvent)a.attachEvent(Nc(b.toString()),
d);else throw Error("addEventListener and attachEvent are unavailable.");Gc++;return c},Mc=function(){var a=Oc,b=hc?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b},Pc=function(a,b,c,d,e){if("array"==p(b))for(var f=0;f<b.length;f++)Pc(a,b[f],c,d,e);else c=Ic(c),a&&a[Ta]?xb(a.b,String(b),c,!0,d,e):Kc(a,b,c,!0,d,e)},Qc=function(a,b,c,d,e){if("array"==p(b))for(var f=0;f<b.length;f++)Qc(a,b[f],c,d,e);else(c=Ic(c),a&&a[Ta])?(a=a.b,b=String(b).toString(),
b in a.a&&(f=a.a[b],c=wb(f,c,d,e),-1<c&&(rb(f[c]),C(null!=f.length),Array.prototype.splice.call(f,c,1),0==f.length&&(delete a.a[b],a.b--)))):a&&(a=Lc(a))&&(b=a.a[b.toString()],a=-1,b&&(a=wb(b,c,!!d,e)),(c=-1<a?b[a]:null)&&Rc(c))},Rc=function(a){if("number"!=typeof a&&a&&!a.O){var b=a.src;if(b&&b[Ta])yb(b.b,a);else{var c=a.type,d=a.a;b.removeEventListener?b.removeEventListener(c,d,a.U):b.detachEvent&&b.detachEvent(Nc(c),d);Gc--;(c=Lc(b))?(yb(c,a),0==c.b&&(c.src=null,b[Ec]=null)):rb(a)}}},Nc=function(a){return a in
Fc?Fc[a]:Fc[a]="on"+a},Tc=function(a,b,c,d){var e=!0;if(a=Lc(a))if(b=a.a[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.U==c&&!f.O&&(f=Sc(f,d),e=e&&!1!==f)}return e},Sc=function(a,b){var c=a.listener,d=a.N||a.src;a.T&&Rc(a);return c.call(d,b)},Oc=function(a,b){if(a.O)return!0;if(!hc){if(!b)a:{b=["window","event"];for(var c=m,d;d=b.shift();)if(null!=c[d])c=c[d];else{b=null;break a}b=c}d=b;b=new mc(d,this);c=!0;if(!(0>d.keyCode||void 0!=d.returnValue)){a:{var e=!1;if(0==d.keyCode)try{d.keyCode=
-1;break a}catch(g){e=!0}if(e||void 0==d.returnValue)d.returnValue=!0}d=[];for(e=b.a;e;e=e.parentNode)d.push(e);a=a.type;for(e=d.length-1;0<=e;e--){b.a=d[e];var f=Tc(d[e],a,!0,b),c=c&&f}for(e=0;e<d.length;e++)b.a=d[e],f=Tc(d[e],a,!1,b),c=c&&f}return c}return Sc(a,new mc(b,this))},Lc=function(a){a=a[Ec];return a instanceof vb?a:null},Uc="__closure_events_fn_"+(1E9*Math.random()>>>0),Ic=function(a){C(a,"Listener can not be null.");if(r(a))return a;C(a.handleEvent,"An object listener must have handleEvent method.");
a[Uc]||(a[Uc]=function(b){return a.handleEvent(b)});return a[Uc]};var I=function(a,b){D.call(this);this.l=a||0;this.c=b||10;if(this.l>this.c)throw Error("[goog.structs.Pool] Min can not be greater than max");this.a=new Eb;this.b=new Cc;this.i=null;this.S()};u(I,D);I.prototype.W=function(){var a=ia();if(!(null!=this.i&&0>a-this.i)){for(var b;0<this.a.o()&&(b=Fb(this.a),!this.j(b));)this.S();!b&&this.o()<this.c&&(b=this.h());b&&(this.i=a,this.b.a.set(Bc(b),b));return b}};var Wc=function(a){var b=Vc;lc(b.b.a,Bc(a))&&b.Z(a)};
I.prototype.Z=function(a){lc(this.b.a,Bc(a));this.j(a)&&this.o()<this.c?this.a.a.push(a):Xc(a)};I.prototype.S=function(){for(var a=this.a;this.o()<this.l;){var b=this.h();a.a.push(b)}for(;this.o()>this.c&&0<this.a.o();)Xc(Fb(a))};I.prototype.h=function(){return{}};var Xc=function(a){if("function"==typeof a.fa)a.fa();else for(var b in a)a[b]=null};I.prototype.j=function(a){return"function"==typeof a.ra?a.ra():!0};I.prototype.o=function(){return this.a.o()+this.b.o()};
I.prototype.F=function(){return this.a.F()&&this.b.F()};I.prototype.A=function(){I.G.A.call(this);if(0<this.b.o())throw Error("[goog.structs.Pool] Objects not released");delete this.b;for(var a=this.a;!a.F();)Xc(Fb(a));delete this.a};/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
var Yc=function(a,b){this.c=[];this.m=b||null;this.a=this.h=!1;this.b=void 0;this.j=this.g=!1;this.f=0;this.i=null;this.s=0};Yc.prototype.l=function(a,b){this.g=!1;this.h=!0;this.b=b;this.a=!a;Zc(this)};var $c=function(a,b,c){C(!a.j,"Blocking Deferreds can not be re-used");a.c.push([b,c,void 0]);a.h&&Zc(a)};Yc.prototype.then=function(a,b,c){var d,e,f=new H(function(a,b){d=a;e=b});$c(this,d,function(a){e(a)});return f.then(a,b,c)};Ea(Yc);
var ad=function(a){return fb(a.c,function(a){return r(a[1])})},Zc=function(a){if(a.f&&a.h&&ad(a)){var b=a.f,c=bd[b];c&&(m.clearTimeout(c.a),delete bd[b]);a.f=0}a.i&&(a.i.s--,delete a.i);for(var b=a.b,d=c=!1;a.c.length&&!a.g;){var e=a.c.shift(),f=e[0],g=e[1],e=e[2];if(f=a.a?g:f)try{var h=f.call(e||a.m,b);n(h)&&(a.a=a.a&&(h==b||h instanceof Error),a.b=b=h);if(Fa(b)||"function"===typeof m.Promise&&b instanceof m.Promise)d=!0,a.g=!0}catch(l){b=l,a.a=!0,ad(a)||(c=!0)}}a.b=b;d&&(h=t(a.l,a,!0),d=t(a.l,a,
!1),b instanceof Yc?($c(b,h,d),b.j=!0):b.then(h,d));c&&(b=new cd(b),bd[b.a]=b,a.f=b.a)},cd=function(a){this.a=m.setTimeout(t(this.c,this),0);this.b=a};cd.prototype.c=function(){C(bd[this.a],"Cannot throw an error that is not scheduled.");delete bd[this.a];throw this.b;};var bd={};var dd=function(a){this.f=a;this.b=this.c=this.a=null},ed=function(a,b){this.name=a;this.value=b};ed.prototype.toString=function(){return this.name};var fd=new ed("SEVERE",1E3),gd=new ed("CONFIG",700),hd=new ed("FINE",500),id=function(a){if(a.c)return a.c;if(a.a)return id(a.a);Ra("Root logger has no level set.");return null};
dd.prototype.log=function(a,b,c){if(a.value>=id(this).value)for(r(b)&&(b=b()),a=new ya(a,String(b),this.f),c&&(a.a=c),c="log:"+a.b,m.console&&(m.console.timeStamp?m.console.timeStamp(c):m.console.markTimeline&&m.console.markTimeline(c)),m.msWriteProfilerMark&&m.msWriteProfilerMark(c),c=this;c;)c=c.a};
var jd={},kd=null,ld=function(a){kd||(kd=new dd(""),jd[""]=kd,kd.c=gd);var b;if(!(b=jd[a])){b=new dd(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=ld(a.substr(0,c));c.b||(c.b={});c.b[d]=b;b.a=c;jd[a]=b}return b};var J=function(){D.call(this);this.b=new vb(this);this.ma=this;this.I=null};u(J,D);J.prototype[Ta]=!0;J.prototype.removeEventListener=function(a,b,c,d){Qc(this,a,b,c,d)};
var K=function(a,b){Jc(a);var c,d=a.I;if(d){c=[];for(var e=1;d;d=d.I)c.push(d),C(1E3>++e,"infinite loop")}a=a.ma;d=b.type||b;q(b)?b=new pb(b,a):b instanceof pb?b.target=b.target||a:(e=b,b=new pb(d,a),Da(b,e));var e=!0,f;if(c)for(var g=c.length-1;0<=g;g--)f=b.a=c[g],e=md(f,d,!0,b)&&e;f=b.a=a;e=md(f,d,!0,b)&&e;e=md(f,d,!1,b)&&e;if(c)for(g=0;g<c.length;g++)f=b.a=c[g],e=md(f,d,!1,b)&&e};
J.prototype.A=function(){J.G.A.call(this);if(this.b){var a=this.b,b=0,c;for(c in a.a){for(var d=a.a[c],e=0;e<d.length;e++)++b,rb(d[e]);delete a.a[c];a.b--}}this.I=null};var md=function(a,b,c,d){b=a.b.a[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var g=b[f];if(g&&!g.O&&g.U==c){var h=g.listener,l=g.N||g.src;g.T&&yb(a.b,g);e=!1!==h.call(l,d)&&e}}return e&&0!=d.ka},Jc=function(a){C(a.b,"Event target is not initialized. Did you call the superclass (goog.events.EventTarget) constructor?")};var L=function(a,b){this.f=new Nb;I.call(this,a,b)};u(L,I);k=L.prototype;k.W=function(a,b){if(!a)return L.G.W.call(this);Db(this.f,n(b)?b:100,a);this.$()};k.$=function(){for(var a=this.f;0<a.o();){var b=this.W();if(b){var c;var d=a,e=d.a,f=e.length;c=e[0];if(0>=f)c=void 0;else{if(1==f)ib(e);else{e[0]=e.pop();for(var e=0,d=d.a,f=d.length,g=d[e];e<f>>1;){var h=2*e+1,l=2*e+2,h=l<f&&d[l].a<d[h].a?l:h;if(d[h].a>g.a)break;d[e]=d[h];e=h}d[e]=g}c=c.b}c.apply(this,[b])}else break}};
k.Z=function(a){L.G.Z.call(this,a);this.$()};k.S=function(){L.G.S.call(this);this.$()};k.A=function(){L.G.A.call(this);m.clearTimeout(void 0);this.f.clear();this.f=null};var M=function(a,b){a&&a.log(hd,b,void 0)};var nd=function(a,b,c){if(r(a))c&&(a=t(a,c));else if(a&&"function"==typeof a.handleEvent)a=t(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(b)?-1:m.setTimeout(a,b||0)};var O=function(a){J.call(this);this.L=new jc;this.C=a||null;this.c=!1;this.B=this.a=null;this.P=this.l="";this.J=0;this.h="";this.f=this.H=this.j=this.K=!1;this.i=0;this.m=null;this.da="";this.v=this.ba=this.X=!1};u(O,J);var od=O.prototype,pd=ld("goog.net.XhrIo");od.u=pd;var qd=/^https?$/i,rd=["POST","PUT"];
O.prototype.send=function(a,b,c,d){if(this.a)throw Error("[goog.net.XhrIo] Object is active with another request="+this.l+"; newUri="+a);b=b?b.toUpperCase():"GET";this.l=a;this.h="";this.J=0;this.P=b;this.K=!1;this.c=!0;this.a=this.C?Bb(this.C):Bb(zb);this.B=this.C?ab(this.C):ab(zb);this.a.onreadystatechange=t(this.ca,this);this.ba&&"onprogress"in this.a&&(this.a.onprogress=t(function(a){this.R(a,!0)},this),this.a.upload&&(this.a.upload.onprogress=t(this.R,this)));try{M(this.u,P(this,"Opening Xhr")),
this.H=!0,this.a.open(b,String(a),!0),this.H=!1}catch(f){M(this.u,P(this,"Error opening Xhr: "+f.message));sd(this,f);return}a=c||"";var e=this.L.clone();d&&Hb(d,function(a,b){e.set(b,a)});d=hb(e.D());c=m.FormData&&a instanceof m.FormData;!(0<=bb(rd,b))||d||c||e.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");e.forEach(function(a,b){this.a.setRequestHeader(b,a)},this);this.da&&(this.a.responseType=this.da);"withCredentials"in this.a&&this.a.withCredentials!==this.X&&(this.a.withCredentials=
this.X);try{td(this),0<this.i&&(this.v=ud(this.a),M(this.u,P(this,"Will abort after "+this.i+"ms if incomplete, xhr2 "+this.v)),this.v?(this.a.timeout=this.i,this.a.ontimeout=t(this.M,this)):this.m=nd(this.M,this.i,this)),M(this.u,P(this,"Sending request")),this.j=!0,this.a.send(a),this.j=!1}catch(f){M(this.u,P(this,"Send error: "+f.message)),sd(this,f)}};var ud=function(a){return F&&G(9)&&"number"==typeof a.timeout&&n(a.ontimeout)},gb=function(a){return"content-type"==a.toLowerCase()};
O.prototype.M=function(){"undefined"!=typeof aa&&this.a&&(this.h="Timed out after "+this.i+"ms, aborting",this.J=8,M(this.u,P(this,this.h)),K(this,"timeout"),vd(this,8))};var sd=function(a,b){a.c=!1;a.a&&(a.f=!0,a.a.abort(),a.f=!1);a.h=b;a.J=5;wd(a);xd(a)},wd=function(a){a.K||(a.K=!0,K(a,"complete"),K(a,"error"))},vd=function(a,b){a.a&&a.c&&(M(a.u,P(a,"Aborting")),a.c=!1,a.f=!0,a.a.abort(),a.f=!1,a.J=b||7,K(a,"complete"),K(a,"abort"),xd(a))};
O.prototype.A=function(){this.a&&(this.c&&(this.c=!1,this.f=!0,this.a.abort(),this.f=!1),xd(this,!0));O.G.A.call(this)};O.prototype.ca=function(){this.g||(this.H||this.j||this.f?yd(this):this.na())};O.prototype.na=function(){yd(this)};
var yd=function(a){if(a.c&&"undefined"!=typeof aa)if(a.B[1]&&4==zd(a)&&2==Q(a))M(a.u,P(a,"Local request error detected and ignored"));else if(a.j&&4==zd(a))nd(a.ca,0,a);else if(K(a,"readystatechange"),4==zd(a)){M(a.u,P(a,"Request complete"));a.c=!1;try{if(Bd(a))K(a,"complete"),K(a,"success");else{a.J=6;var b;try{b=2<zd(a)?a.a.statusText:""}catch(c){M(a.u,"Can not get status: "+c.message),b=""}a.h=b+" ["+Q(a)+"]";wd(a)}}finally{xd(a)}}};
O.prototype.R=function(a,b){C("progress"===a.type,"goog.net.EventType.PROGRESS is of the same type as raw XHR progress.");K(this,Cd(a,"progress"));K(this,Cd(a,b?"downloadprogress":"uploadprogress"))};
var Cd=function(a,b){return{type:b,lengthComputable:a.lengthComputable,loaded:a.loaded,total:a.total}},xd=function(a,b){if(a.a){td(a);var c=a.a,d=a.B[0]?ba:null;a.a=null;a.B=null;b||K(a,"ready");try{c.onreadystatechange=d}catch(e){(a=a.u)&&a.log(fd,"Problem encountered resetting onreadystatechange: "+e.message,void 0)}}},td=function(a){a.a&&a.v&&(a.a.ontimeout=null);"number"==typeof a.m&&(m.clearTimeout(a.m),a.m=null)},Bd=function(a){var b=Q(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=
!0;break a;default:c=!1}if(!c){if(b=0===b)a=String(a.l).match(sb)[1]||null,!a&&m.self&&m.self.location&&(a=m.self.location.protocol,a=a.substr(0,a.length-1)),b=!qd.test(a?a.toLowerCase():"");c=b}return c},zd=function(a){return a.a?a.a.readyState:0},Q=function(a){try{return 2<zd(a)?a.a.status:-1}catch(b){return-1}},Dd=function(a){try{return a.a?a.a.responseText:""}catch(b){return M(a.u,"Can not get responseText: "+b.message),""}},Ed=function(a,b){return a.a&&4==zd(a)?a.a.getResponseHeader(b):void 0},
P=function(a,b){return b+" ["+a.P+" "+a.l+" "+Q(a)+"]"};var Fd=function(a,b,c,d){this.m=a;this.v=!!d;L.call(this,b,c)};u(Fd,L);Fd.prototype.h=function(){var a=new O,b=this.m;b&&b.forEach(function(b,d){a.L.set(d,b)});this.v&&(a.X=!0);return a};Fd.prototype.j=function(a){return!a.g&&!a.a};var Vc=new Fd;var Hd=function(a,b,c,d,e,f,g,h,l,B){this.L=a;this.H=b;this.B=c;this.m=d;this.I=e.slice();this.s=this.l=this.f=this.c=null;this.h=this.i=!1;this.v=f;this.j=g;this.g=l;this.M=B;this.K=h;var w=this;this.C=new H(function(a,b){w.l=a;w.s=b;Gd(w)})},Id=function(a,b,c){this.b=a;this.c=b;this.a=!!c},Gd=function(a){function b(a,b){b?a(!1,new Id(!1,null,!0)):Vc.W(function(b){b.X=d.M;d.c=b;var c=null;null!==d.g&&(b.ba=!0,c=Hc(b,"uploadprogress",function(a){d.g(a.loaded,a.lengthComputable?a.total:-1)}),b.ba=
null!==d.g);b.send(d.L,d.H,d.m,d.B);Pc(b,"complete",function(b){null!==c&&Rc(c);d.c=null;b=b.target;var f=6===b.J&&100<=Q(b),f=Bd(b)||f,g=Q(b);!f||500<=g&&600>g||429===g?(f=7===b.J,Wc(b),a(!1,new Id(!1,null,f))):(f=0<=bb(d.I,g),a(!0,new Id(f,b)))})})}function c(a,b){var c=d.l;a=d.s;var h=b.c;if(b.b)try{var l=d.v(h,Dd(h));n(l)?c(l):c()}catch(B){a(B)}else null!==h?(b=la(),l=Dd(h),b.serverResponse=l,d.j?a(d.j(h,b)):a(b)):(b=b.a?d.h?oa():ma():new v("retry-limit-exceeded","Max retry time for operation exceeded, please try again."),
a(b));Wc(h)}var d=a;a.i?c(0,new Id(!1,null,!0)):a.f=ja(b,c,a.K)};Hd.prototype.a=function(){return this.C};Hd.prototype.b=function(a){this.i=!0;this.h=a||!1;null!==this.f&&(0,this.f)(!1);null!==this.c&&vd(this.c)};var Jd=function(a,b,c){var d=Oa(a.f),d=a.l+d,e=a.b?qa(a.b):{};null!==b&&0<b.length&&(e.Authorization="Firebase "+b);e["X-Firebase-Storage-Version"]="webjs/1.0.0";return new Hd(d,a.i,e,a.c,a.h,a.N,a.a,a.j,a.g,c)};var Kd=function(a){var b=m.BlobBuilder||m.WebKitBlobBuilder;if(n(b)){for(var b=new b,c=0;c<arguments.length;c++)b.append(arguments[c]);return b.getBlob()}b=kb(arguments);c=m.BlobBuilder||m.WebKitBlobBuilder;if(n(c)){for(var c=new c,d=0;d<b.length;d++)c.append(b[d],void 0);b=c.getBlob(void 0)}else if(n(m.Blob))b=new Blob(b,{});else throw Error("This browser doesn't seem to support creating Blobs");return b},Ld=function(a,b,c){n(c)||(c=a.size);return a.webkitSlice?a.webkitSlice(b,c):a.mozSlice?a.mozSlice(b,
c):a.slice?Qb&&!G("13.0")||Rb&&!G("537.1")?(0>b&&(b+=a.size),0>b&&(b=0),0>c&&(c+=a.size),c<b&&(c=b),a.slice(b,c-b)):a.slice(b,c):null};var Md=function(a){this.c=sc(a)};Md.prototype.a=function(){return this.c};Md.prototype.b=function(){};var Nd=function(){this.a={};this.b=Number.MIN_SAFE_INTEGER},Od=function(a,b){function c(){delete e.a[d]}var d=a.b;a.b++;a.a[d]=b;var e=a;b.a().then(c,c)};Nd.prototype.clear=function(){pa(this.a,function(a,b){b&&b.b(!0)});this.a={}};var Pd=function(a,b,c,d){this.a=a;this.g=null;if(null!==this.a&&(a=this.a.options,y(a))){a=a.storageBucket||null;if(null==a)a=null;else{var e=null;try{e=Ma(a)}catch(f){}if(null!==e){if(""!==e.path)throw new v("invalid-default-bucket","Invalid default bucket '"+a+"'.");a=e.bucket}}this.g=a}this.l=b;this.j=c;this.i=d;this.c=12E4;this.b=6E4;this.h=new Nd;this.f=!1},Qd=function(a){return null!==a.a&&y(a.a.INTERNAL)&&y(a.a.INTERNAL.getToken)?a.a.INTERNAL.getToken().then(function(a){return y(a)?a.accessToken:
null},function(){return null}):rc(null)};Pd.prototype.bucket=function(){if(this.f)throw oa();return this.g};var R=function(a,b,c){if(a.f)return new Md(oa());b=a.j(b,c,null===a.a);Od(a.h,b);return b};var Rd=function(a,b){return b},S=function(a,b,c,d){this.c=a;this.b=b||a;this.f=!!c;this.a=d||Rd},Sd=null,Td=function(){if(Sd)return Sd;var a=[];a.push(new S("bucket"));a.push(new S("generation"));a.push(new S("metageneration"));a.push(new S("name","fullPath",!0));var b=new S("name");b.a=function(a,b){return!ua(b)||2>b.length?b:ub(b)};a.push(b);b=new S("size");b.a=function(a,b){return y(b)?+b:b};a.push(b);a.push(new S("timeCreated"));a.push(new S("updated"));a.push(new S("md5Hash",null,!0));a.push(new S("cacheControl",
null,!0));a.push(new S("contentDisposition",null,!0));a.push(new S("contentEncoding",null,!0));a.push(new S("contentLanguage",null,!0));a.push(new S("contentType",null,!0));a.push(new S("metadata","customMetadata",!0));a.push(new S("downloadTokens","downloadURLs",!1,function(a,b){if(!(ua(b)&&0<b.length))return[];var e=encodeURIComponent;return eb(b.split(","),function(b){var d=a.fullPath,d="https://firebasestorage.googleapis.com/v0"+("/b/"+e(a.bucket)+"/o/"+e(d));b=Oa({alt:"media",token:b});return d+
b})}));return Sd=a},Ud=function(a,b){Object.defineProperty(a,"ref",{get:function(){return b.l(b,new z(a.bucket,a.fullPath))}})},Vd=function(a,b){for(var c={},d=b.length,e=0;e<d;e++){var f=b[e];f.f&&(c[f.c]=a[f.b])}return JSON.stringify(c)},Wd=function(a){if(!a||"object"!==typeof a)throw"Expected Metadata object.";for(var b in a){var c=a[b];if("customMetadata"===b&&"object"!==typeof c)throw"Expected object for 'customMetadata' mapping.";}};var T=function(a,b,c){for(var d=b.length,e=b.length,f=0;f<b.length;f++)if(b[f].b){d=f;break}if(!(d<=c.length&&c.length<=e))throw d===e?(b=d,d=1===d?"argument":"arguments"):(b="between "+d+" and "+e,d="arguments"),new v("invalid-argument-count","Invalid argument count in `"+a+"`: Expected "+b+" "+d+", received "+c.length+".");for(f=0;f<c.length;f++)try{b[f].a(c[f])}catch(g){if(g instanceof Error)throw na(f,a,g.message);throw na(f,a,g);}},U=function(a,b){var c=this;this.a=function(b){c.b&&!n(b)||a(b)};
this.b=!!b},Xd=function(a,b){return function(c){a(c);b(c)}},Yd=function(a,b){function c(a){if(!("string"===typeof a||a instanceof String))throw"Expected string.";}var d;a?d=Xd(c,a):d=c;return new U(d,b)},Zd=function(){return new U(function(a){if(!(a instanceof Blob))throw"Expected Blob or File.";})},$d=function(){return new U(function(a){if(!(("number"===typeof a||a instanceof Number)&&0<=a))throw"Expected a number 0 or greater.";})},ae=function(a,b){return new U(function(b){if(!(null===b||y(b)&&
b instanceof Object))throw"Expected an Object.";y(a)&&a(b)},b)},be=function(){return new U(function(a){if(null!==a&&!r(a))throw"Expected a Function.";},!0)};var ce=function(a){if(!a)throw la();},de=function(a,b){return function(c,d){a:{var e;try{e=JSON.parse(d)}catch(h){c=null;break a}c=da(e)?e:null}if(null===c)c=null;else{d={type:"file"};e=b.length;for(var f=0;f<e;f++){var g=b[f];d[g.b]=g.a(d,c[g.c])}Ud(d,a);c=d}ce(null!==c);return c}},ee=function(a){return function(b,c){b=401===Q(b)?new v("unauthenticated","User is not authenticated, please authenticate using Firebase Authentication and try again."):402===Q(b)?new v("quota-exceeded","Quota for bucket '"+
a.bucket+"' exceeded, please view quota on https://firebase.google.com/pricing/."):403===Q(b)?new v("unauthorized","User does not have permission to access '"+a.path+"'."):c;b.serverResponse=c.serverResponse;return b}},fe=function(a){var b=ee(a);return function(c,d){var e=b(c,d);404===Q(c)&&(e=new v("object-not-found","Object '"+a.path+"' does not exist."));e.serverResponse=d.serverResponse;return e}},ge=function(a,b,c){var d=La(b);a=new x(ka+"/v0"+d,"GET",de(a,c),a.c);a.a=fe(b);return a},he=function(a,
b){var c=La(b);a=new x(ka+"/v0"+c,"DELETE",function(){},a.c);a.h=[200,204];a.a=fe(b);return a},ie=function(a,b,c){c=c?qa(c):{};c.fullPath=a.path;c.size=b.size;c.contentType||(c.contentType=b&&b.type||"application/octet-stream");return c},je=function(a,b,c,d,e){var f="/b/"+encodeURIComponent(b.bucket)+"/o",g={"X-Goog-Upload-Protocol":"multipart"},h;h="";for(var l=0;2>l;l++)h+=Math.random().toString().slice(2);g["Content-Type"]="multipart/related; boundary="+h;e=ie(b,d,e);l=Vd(e,c);d=Kd("--"+h+"\r\nContent-Type: application/json; charset=utf-8\r\n\r\n"+
l+"\r\n--"+h+"\r\nContent-Type: "+e.contentType+"\r\n\r\n",d,"\r\n--"+h+"--");a=new x(ka+"/v0"+f,"POST",de(a,c),a.b);a.f={name:e.fullPath};a.b=g;a.c=d;a.a=ee(b);return a},ke=function(a,b,c,d){this.a=a;this.total=b;this.b=!!c;this.c=d||null},le=function(a,b){var c;try{c=Ed(a,"X-Goog-Upload-Status")}catch(d){ce(!1)}a=0<=bb(b||["active"],c);ce(a);return c},me=function(a,b,c,d,e){var f="/b/"+encodeURIComponent(b.bucket)+"/o",g=ie(b,d,e);e={name:g.fullPath};f=ka+"/v0"+f;d={"X-Goog-Upload-Protocol":"resumable",
"X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":d.size,"X-Goog-Upload-Header-Content-Type":g.contentType,"Content-Type":"application/json; charset=utf-8"};c=Vd(g,c);a=new x(f,"POST",function(a){le(a);var b;try{b=Ed(a,"X-Goog-Upload-URL")}catch(c){ce(!1)}ce(ua(b));return b},a.b);a.f=e;a.b=d;a.c=c;a.a=ee(b);return a},ne=function(a,b,c,d){a=new x(c,"POST",function(a){var b=le(a,["active","final"]),c;try{c=Ed(a,"X-Goog-Upload-Size-Received")}catch(h){ce(!1)}a=c;isFinite(a)&&(a=String(a));
a=q(a)?/^\s*-?0x/i.test(a)?parseInt(a,16):parseInt(a,10):NaN;ce(!isNaN(a));return new ke(a,d.size,"final"===b)},a.b);a.b={"X-Goog-Upload-Command":"query"};a.a=ee(b);return a},oe=function(a,b,c,d,e,f){var g=new ke(0,0);f?(g.a=f.a,g.total=f.total):(g.a=0,g.total=d.size);if(d.size!==g.total)throw new v("server-file-wrong-size","Server recorded incorrect upload file size, please retry the upload.");var h=f=g.total-g.a,h=Math.min(h,262144),l=g.a;f={"X-Goog-Upload-Command":h===f?"upload, finalize":"upload",
"X-Goog-Upload-Offset":g.a};l=Ld(d,l,l+h);if(null===l)throw new v("cannot-slice-blob","Cannot slice blob for upload. Please retry the upload.");c=new x(c,"POST",function(a,c){var f=le(a,["active","final"]),l=g.a+h,Ad=d.size,Va;"final"===f?Va=de(b,e)(a,c):Va=null;return new ke(l,Ad,"final"===f,Va)},b.b);c.b=f;c.c=l;c.g=null;c.a=ee(a);return c};var W=function(a,b,c,d,e,f){this.K=a;this.c=b;this.i=c;this.f=e;this.h=f||null;this.l=d;this.j=0;this.B=this.s=!1;this.v=[];this.R=262144<this.f.size;this.b="running";this.a=this.m=this.g=null;var g=this;this.V=function(a){g.a=null;"storage/canceled"===a.code?(g.s=!0,pe(g)):(g.g=a,V(g,"error"))};this.P=function(a){g.a=null;"storage/canceled"===a.code?pe(g):(g.g=a,V(g,"error"))};qe(this)},qe=function(a){"running"===a.b&&null===a.a&&(a.R?null===a.m?re(a):a.s?se(a):a.B?te(a):ue(a):ve(a))},we=function(a,
b){Qd(a.c).then(function(c){switch(a.b){case "running":b(c);break;case "canceling":V(a,"canceled");break;case "pausing":V(a,"paused")}})},re=function(a){we(a,function(b){var c=me(a.c,a.i,a.l,a.f,a.h);a.a=R(a.c,c,b);a.a.a().then(function(b){a.a=null;a.m=b;a.s=!1;pe(a)},this.V)})},se=function(a){var b=a.m;we(a,function(c){var d=ne(a.c,a.i,b,a.f);a.a=R(a.c,d,c);a.a.a().then(function(b){a.a=null;xe(a,b.a);a.s=!1;b.b&&(a.B=!0);pe(a)},a.V)})},ue=function(a){var b=new ke(a.j,a.f.size),c=a.m;we(a,function(d){var e;
try{e=oe(a.i,a.c,c,a.f,a.l,b)}catch(f){a.g=f;V(a,"error");return}a.a=R(a.c,e,d);a.a.a().then(function(b){a.a=null;xe(a,b.a);b.b?(a.h=b.c,V(a,"success")):pe(a)},a.V)})},te=function(a){we(a,function(b){var c=ge(a.c,a.i,a.l);a.a=R(a.c,c,b);a.a.a().then(function(b){a.a=null;a.h=b;V(a,"success")},a.P)})},ve=function(a){we(a,function(b){var c=je(a.c,a.i,a.l,a.f,a.h);a.a=R(a.c,c,b);a.a.a().then(function(b){a.a=null;a.h=b;xe(a,a.f.size);V(a,"success")},a.V)})},xe=function(a,b){var c=a.j;a.j=b;a.j>c&&ye(a)},
V=function(a,b){if(a.b!==b)switch(b){case "canceling":a.b=b;null!==a.a&&a.a.b();break;case "pausing":a.b=b;null!==a.a&&a.a.b();break;case "running":var c="paused"===a.b;a.b=b;c&&(ye(a),qe(a));break;case "paused":a.b=b;ye(a);break;case "canceled":a.g=ma();a.b=b;ye(a);break;case "error":a.b=b;ye(a);break;case "success":a.b=b,ye(a)}},pe=function(a){switch(a.b){case "pausing":V(a,"paused");break;case "canceling":V(a,"canceled");break;case "running":qe(a)}};
W.prototype.C=function(){return new A(this.j,this.f.size,ta(this.b),this.h,this,this.K)};
W.prototype.I=function(a,b,c,d){function e(a){try{g(a);return}catch(b){}try{if(h(a),!(n(a.next)||n(a.error)||n(a.complete)))throw"";}catch(b){throw"Expected a function or an Object with one of `next`, `error`, `complete` properties.";}}function f(a){return function(b,c,d){null!==a&&T("on",a,arguments);var e=new Na(b,c,d);ze(l,e);return function(){jb(l.v,e)}}}var g=be().a,h=ae(null,!0).a;T("on",[Yd(function(){if("state_changed"!==a)throw"Expected one of the event types: [state_changed].";}),ae(e,!0),
be(),be()],arguments);var l=this,B=[ae(function(a){if(null===a)throw"Expected a function or an Object with one of `next`, `error`, `complete` properties.";e(a)}),be(),be()];return n(b)||n(c)||n(d)?f(null)(b,c,d):f(B)};
var ze=function(a,b){a.v.push(b);Ae(a,b)},ye=function(a){var b=kb(a.v);cb(b,function(b){Ae(a,b)})},Ae=function(a,b){switch(ta(a.b)){case "running":case "paused":null!==b.next&&Dc(b.next.bind(b,a.C()))();break;case "success":null!==b.a&&Dc(b.a.bind(b))();break;case "canceled":case "error":null!==b.error&&Dc(b.error.bind(b,a.g))();break;default:null!==b.error&&Dc(b.error.bind(b,a.g))()}};
W.prototype.M=function(){T("resume",[],arguments);var a="paused"===this.b||"pausing"===this.b;a&&V(this,"running");return a};W.prototype.L=function(){T("pause",[],arguments);var a="running"===this.b;a&&V(this,"pausing");return a};W.prototype.H=function(){T("cancel",[],arguments);var a="running"===this.b||"pausing"===this.b;a&&V(this,"canceling");return a};var X=function(a,b){this.b=a;if(b)this.a=b instanceof z?b:Ma(b);else if(a=a.bucket(),null!==a)this.a=new z(a,"");else throw new v("no-default-bucket","No default bucket found. Did you set the 'storageBucket' property when initializing the app?");};X.prototype.toString=function(){T("toString",[],arguments);return"gs://"+this.a.bucket+"/"+this.a.path};var Be=function(a,b){return new X(a,b)};k=X.prototype;
k.ga=function(a){T("child",[Yd()],arguments);var b=tb(this.a.path,a);return Be(this.b,new z(this.a.bucket,b))};k.Fa=function(){var a;a=this.a.path;if(0==a.length)a=null;else{var b=a.lastIndexOf("/");a=-1===b?"":a.slice(0,b)}return null===a?null:Be(this.b,new z(this.a.bucket,a))};k.Ha=function(){return Be(this.b,new z(this.a.bucket,""))};k.pa=function(){return this.a.bucket};k.Aa=function(){return this.a.path};k.Ea=function(){return ub(this.a.path)};k.Ja=function(){return this.b.i};
k.ua=function(a,b){T("put",[Zd(),new U(Wd,!0)],arguments);Ce(this,"put");return new W(this,this.b,this.a,Td(),a,b)};k.delete=function(){T("delete",[],arguments);Ce(this,"delete");var a=this;return Qd(this.b).then(function(b){var c=he(a.b,a.a);return R(a.b,c,b).a()})};k.ha=function(){T("getMetadata",[],arguments);Ce(this,"getMetadata");var a=this;return Qd(this.b).then(function(b){var c=ge(a.b,a.a,Td());return R(a.b,c,b).a()})};
k.va=function(a){T("updateMetadata",[new U(Wd,void 0)],arguments);Ce(this,"updateMetadata");var b=this;return Qd(this.b).then(function(c){var d=b.b,e=b.a,f=a,g=Td(),h=La(e),h=ka+"/v0"+h,f=Vd(f,g),d=new x(h,"PATCH",de(d,g),d.c);d.b={"Content-Type":"application/json; charset=utf-8"};d.c=f;d.a=fe(e);return R(b.b,d,c).a()})};
k.ta=function(){T("getDownloadURL",[],arguments);Ce(this,"getDownloadURL");return this.ha().then(function(a){a=a.downloadURLs[0];if(y(a))return a;throw new v("no-download-url","The given file does not have any download URLs.");})};var Ce=function(a,b){if(""===a.a.path)throw new v("invalid-root-operation","The operation '"+b+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').");};var Y=function(a){this.a=new Pd(a,function(a,c){return new X(a,c)},Jd,this);this.b=a;this.c=new De(this)};k=Y.prototype;k.wa=function(a){T("ref",[Yd(function(a){if(/^[A-Za-z]+:\/\//.test(a))throw"Expected child path but got a URL, use refFromURL instead.";},!0)],arguments);var b=new X(this.a);return n(a)?b.ga(a):b};
k.xa=function(a){T("refFromURL",[Yd(function(a){if(!/^[A-Za-z]+:\/\//.test(a))throw"Expected full URL but got a child path, use ref instead.";try{Ma(a)}catch(c){throw"Expected valid full URL but got an invalid one.";}},!1)],arguments);return new X(this.a,a)};k.Ca=function(){return this.a.b};k.za=function(a){T("setMaxUploadRetryTime",[$d()],arguments);this.a.b=a};k.Ba=function(){return this.a.c};k.ya=function(a){T("setMaxOperationRetryTime",[$d()],arguments);this.a.c=a};k.oa=function(){return this.b};
k.la=function(){return this.c};var De=function(a){this.a=a};De.prototype.delete=function(){var a=this.a.a;a.f=!0;a.a=null;a.h.clear()};var Z=function(a,b,c){Object.defineProperty(a,b,{get:c})};X.prototype.toString=X.prototype.toString;X.prototype.child=X.prototype.ga;X.prototype.put=X.prototype.ua;X.prototype["delete"]=X.prototype.delete;X.prototype.getMetadata=X.prototype.ha;X.prototype.updateMetadata=X.prototype.va;X.prototype.getDownloadURL=X.prototype.ta;Z(X.prototype,"parent",X.prototype.Fa);Z(X.prototype,"root",X.prototype.Ha);Z(X.prototype,"bucket",X.prototype.pa);Z(X.prototype,"fullPath",X.prototype.Aa);
Z(X.prototype,"name",X.prototype.Ea);Z(X.prototype,"storage",X.prototype.Ja);Y.prototype.ref=Y.prototype.wa;Y.prototype.refFromURL=Y.prototype.xa;Z(Y.prototype,"maxOperationRetryTime",Y.prototype.Ba);Y.prototype.setMaxOperationRetryTime=Y.prototype.ya;Z(Y.prototype,"maxUploadRetryTime",Y.prototype.Ca);Y.prototype.setMaxUploadRetryTime=Y.prototype.za;Z(Y.prototype,"app",Y.prototype.oa);Z(Y.prototype,"INTERNAL",Y.prototype.la);De.prototype["delete"]=De.prototype.delete;
Y.prototype.capi_=function(a){ka=a};W.prototype.on=W.prototype.I;W.prototype.resume=W.prototype.M;W.prototype.pause=W.prototype.L;W.prototype.cancel=W.prototype.H;Z(W.prototype,"snapshot",W.prototype.C);Z(A.prototype,"bytesTransferred",A.prototype.qa);Z(A.prototype,"totalBytes",A.prototype.La);Z(A.prototype,"state",A.prototype.Ia);Z(A.prototype,"metadata",A.prototype.Da);Z(A.prototype,"downloadURL",A.prototype.sa);Z(A.prototype,"task",A.prototype.Ka);Z(A.prototype,"ref",A.prototype.Ga);
ra.STATE_CHANGED="state_changed";sa.RUNNING="running";sa.PAUSED="paused";sa.SUCCESS="success";sa.CANCELED="canceled";sa.ERROR="error";H.prototype["catch"]=H.prototype.l;H.prototype.then=H.prototype.then;
(function(){function a(a){return new Y(a)}var b={TaskState:sa,TaskEvent:ra,Storage:Y,Reference:X};if(window.firebase&&firebase.INTERNAL&&firebase.INTERNAL.registerService)firebase.INTERNAL.registerService("storage",a,b);else throw Error("Cannot install Firebase Storage - be sure to load firebase-app.js first.");})();})();
// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.



/*function getIt(url){
	$.ajax({
      type: "GET",
      url: url,
      success:(data) ->
        alert data.farms.length
        return false
      error:(data) ->
        return false
    })
}

function postIt(url, payload){
	$.ajax({
      type: "POST",
      url: url,
      data: payload,
      success:(data) ->
        alert data.farms.length
        return false
      error:(data) ->
        return false
    })
}
*/

$(document).on("ready", function(){
  //$("#map-view").hide();

  function showMap(){
    $("#map-view").show();
  }
})
