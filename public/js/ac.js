$(function() {

   $("#company-query").autocomplete({
      source: function(request, response) {
         $.ajax({
            url: "/search/company",
            type: "GET",
            data: request, // request is the value of search input
            success: function(data) {
               // Map response values to fiedl label and value
               response($.map(data, function(el) {
                  return {
                     name: el.name,
                     _id: el._id,
                     id: el._id,
                     value: el.name
                  };
               }));
            }
         });
      },

      // The minimum number of characters a user must type before a search is performed.
      minLength: 3,

      // set an onFocus event to show the result on input field when result is focused
      focus: function(event, ui) {
         $("#company-query").val(ui.item.name);
         // Prevent other event from not being execute
         return false;
      },
      select: function(event, ui) {
         // Prevent value from being put in the input:
         $("#company-query").val(ui.item.name);
         // Set the id to the next input hidden field
         $("#companyId").val(ui.item.id);
         // Prevent other event from not being execute            
         return false;
         // optionnal: submit the form after field has been filled up
         //$('#quicksearch').submit();
      }
   });

   $("#agenda-query").autocomplete({
      source: function(request, response) {
         $.ajax({
            url: "/search/agenda",
            type: "GET",
            data: request, // request is the value of search input
            success: function(data) {
               // Map response values to fiedl label and value
               response($.map(data, function(el) {
                  return {
                     agenda: el.title,
                     value: el._id
                  };
               }));
            }
         });
      },

      // The minimum number of characters a user must type before a search is performed.
      minLength: 3,

      // set an onFocus event to show the result on input field when result is focused
      focus: function(event, ui) {
         this.value = ui.item.label;
         // Prevent other event from not being execute
         event.preventDefault();
      },
      select: function(event, ui) {
         // Prevent value from being put in the input:
         this.value = ui.item.label;
         // Set the id to the next input hidden field
         $(this).next("input").val(ui.item.value);
         // Prevent other event from not being execute            
         event.preventDefault();
         // optionnal: submit the form after field has been filled up
         $('#quicksearch').submit();
      }
   });
   $("#meeting-query").autocomplete({
      source: function(request, response) {
         $.ajax({
            url: "/search/meeting",
            type: "GET",
            data: request, // request is the value of search input
            success: function(data) {
               // Map response values to fiedl label and value
               response($.map(data, function(el) {
                  return {
                     meeting: el.title,
                     value: el._id
                  };
               }));
            }
         });
      },

      // The minimum number of characters a user must type before a search is performed.
      minLength: 3,

      // set an onFocus event to show the result on input field when result is focused
      focus: function(event, ui) {
         this.value = ui.item.label;
         // Prevent other event from not being execute
         event.preventDefault();
      },
      select: function(event, ui) {
         // Prevent value from being put in the input:
         this.value = ui.item.label;
         // Set the id to the next input hidden field
         $(this).next("input").val(ui.item.value);
         // Prevent other event from not being execute            
         event.preventDefault();
         // optionnal: submit the form after field has been filled up
         $('#quicksearch').submit();
      }
   });
   $("#topic-query").autocomplete({
      source: function(request, response) {
         $.ajax({
            url: "/search/topic",
            type: "GET",
            data: request, // request is the value of search input
            success: function(data) {
               // Map response values to fiedl label and value
               response($.map(data, function(el) {
                  return {
                     topic: el.title,
                     value: el._id
                  };
               }));
            }
         });
      },

      // The minimum number of characters a user must type before a search is performed.
      minLength: 3,

      // set an onFocus event to show the result on input field when result is focused
      focus: function(event, ui) {
         this.value = ui.item.label;
         // Prevent other event from not being execute
         event.preventDefault();
      },
      select: function(event, ui) {
         // Prevent value from being put in the input:
         this.value = ui.item.label;
         // Set the id to the next input hidden field
         $(this).next("input").val(ui.item.value);
         // Prevent other event from not being execute            
         event.preventDefault();
         // optionnal: submit the form after field has been filled up
         $('#quicksearch').submit();
      }
   });


   $(".form-datetime").datetimepicker({
      format: "dd MM yyyy @ hh:ii",
      autoclose: true,
      todayBtn: true,
      startDate: new Date().toUTCString(),
      minuteStep: 5
   });

   $(".formDateClose").datetimepicker({
      format: "dd MM yyyy @ hh:ii",
      autoclose: true,
      todayBtn: true,
      startDate: new Date().toUTCString(),
      minuteStep: 5
   });

   $(".formDateOpen").datetimepicker({
      format: "dd MM yyyy @ hh:ii",
      autoclose: true,
      todayBtn: true,
      startDate: new Date().toUTCString(),
      minuteStep: 5
   });

   $(".formDateQuorum").datetimepicker({
      format: "dd MM yyyy @ hh:ii",
      autoclose: true,
      todayBtn: true,
      startDate: new Date().toUTCString(),
      minuteStep: 5
   });
});