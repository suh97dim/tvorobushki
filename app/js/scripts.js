$(function () {
  if ($(".bootstrap-file-upload").length > 0) {
    $(".bootstrap-file-upload").fileinput({
      uploadUrl: "#",
      language: "ru",
      showUpload: false,
      showCaption: false,
      showCancel: false,
      showRemove: false,
      showProgress: true,
      browseClass: "box-file",
      overwriteInitial: false,
      initialPreviewAsData: true,
      preferIconicZoomPreview: true,
      allowedFileExtensions: ["jpg", "png", "gif", "mp4", "mov", "avi"],
    });
  }
  // маска для номера телефона
  $(".mask-phone").mask("+7 (999) 999-99-99");
  $.fn.DataTable.ext.pager.numbers_length = 5;
  var oTable = $('#winners').DataTable({ordering: false, bLengthChange: false, info: false, pageLength: 6, pagingType: "numbers"});
  $('#registered-receipts,#appl').DataTable({ ordering: false, bLengthChange: false, info: false, pageLength: 6, pagingType: "numbers" });

  $(".qa-title").click(function () {
    if ($('.qa-title').is(':visible')) {
      $(".qa-details").slideUp(300);
      $(".qa-item").removeClass('active');
      $(".qa-details").css('opacity', '0');
    }
    if ($(this).next(".qa-details").is(':visible')) {
      $(this).next(".qa-details").slideUp(300);
      $(this).parent().removeClass('active');
      $(this).next(".qa-desc").css('opacity', '0');
    } else {
      $(this).next(".qa-details").slideDown(300);
      $(this).next(".qa-details").css('opacity', '1');
      $(this).parent().addClass('active');
    }
  });

  $('.hamburger').click(function () {
    if ($('.hamburger').hasClass('collapsed')) {
      $(this).removeClass('collapsed');
      $('.page-header-menu').addClass('show');
    }
    else {
      $(this).addClass('collapsed');
      $('.page-header-menu').removeClass('show');
    }
  });
  $('.navigation-list--link').click(function () {
    $(this).parent().parent().parent().removeClass('show');
    $('.hamburger').addClass('collapsed');
  });
  $('.banner-form-control').focus(function () {
    $(this).parent().addClass('focus');
  }).blur(function () {
    $(this).parent().removeClass('focus');
  });

  $(".js-change-modal").on("click", function (e) {
    e.preventDefault();
    $(".modal").modal("hide");
    var id = $(this).attr("href");
    setTimeout(() => {
      $(id).modal("show");
    }, 1000);
  });
  // Маска для даты
  $('[data-toggle="datepicker"]').mask("99.99.9999");
  // bootstrap datepicker
  $('[data-toggle="datepicker"], .datepicker').datepicker({
    autoHide: true,
    zIndex: 2048,
    language: "ru-RU",
    format: "dd.mm.yyyy",
  });


//загрузка фото и инициализация croppier,
  $('#file-receipt ').on('input', function (e) {
    //инициализация с display none не проходит
    $('#step-2').css({ display: 'block' })
    var file = document.getElementById('file-receipt').files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var basic = $('#img-crop').croppie({
        viewport: { width: 550, height: 300 },
        boundary: { width: 570, height: 320 },
        showZoomer: true,
        mouseWheelZoom: 'ctrl'
      });
      basic.croppie('bind', {
        url: e.target.result,

      });
      // basic.croppie('result', 'html').then(function (html) {
      // });;

    }
    //
    reader.readAsDataURL(file);
    $('#step-1').fadeOut('slow');
    setTimeout(function () {
      $('#step-2').animate({ opacity: 1 })
    }, 1000);
  })


//удаляем сстарое фото и скрываем блок
  $('#other-photo').click(function (e) {
    $('#img-crop').croppie('destroy');
    $('#step-1').fadeIn('fast');
    $('#step-2').animate({ opacity: 0 })
    $('#step-2').css({ display: 'none' })
    $("#fileInputId").val(null);
  })

// валидация формы type = file, из-за вложенности подсказка не появлялась
  $('#nalog').click(function (e) {
    $('.file').each(function () {
      if ($(this).val() == '') {
        let a = ($(this).attr('invalid-custom'))
        let b = $("div").find("[invalid-customs='" + a + "']");
        $(b).css('display', 'block');
      } else {
        let a = ($(this).attr('invalid-custom'))
        let b = $("div").find("[invalid-customs='" + a + "']");
        $(b).css('display', 'none');
      }
    });
  })



// scroll button to tab 4
  $(function () {
    $('.to-data-tab').click(function (e) {
      e.preventDefault();
      $('a[href="#tab-4"]').tab('show');
    })
  });

  
  // scroll to id
  $(".js-scroll-to").on("click", function (e) {
    e.preventDefault();
    var id = $(this).attr("href").replace("#", "");
    $("html, body").animate(
      {
        scrollTop: $("#" + id).offset()
      },
      0
    );
  });
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
})





var forms = document.querySelectorAll('.needs-validation')
Array.prototype.slice.call(forms)
  .forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }
      form.classList.add('was-validated')
    }, false)
  })
