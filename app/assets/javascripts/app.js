(function(){

    // template{{}}
    _.templateSettings = {
          interpolate : /\{\{(.+?)\}\}/g
    };


	// Hello Backbone!
    console.log("Hello Backbone!");
    //console.log($('#item-template').html());
    
    /////////////////////////
    // model
    var Presentation = Backbone.Model.extend({
        idAttribute: "ppt_id",
        defaults: function() {
            return {
              ppt_id: "",
              ppt_order: 0,
              ppt_name: "..."
            };
        },
    });

    /////////////////////////
    // Collection
    var PresenList = Backbone.Collection.extend({

        
        url: "/ppts",
        model: Presentation,
        comparator: 'ppt_order',
        parse : function parse(res){    
            return res;
        },

      });
    
    // presenList
    var presenList = new PresenList();
    
    

    /////////////////////////
    // Presen Item View
    // --------------
    var PresenView = Backbone.View.extend({

      //... is a list tag.
      tagName:  'li',
      
      // Cache the template function for a single item.
      presenTemplate: _.template($('#item-template').html()),

      // The DOM events specific to an item.
      events: {
        //"click .toggle"   : "toggleDone",
        //"dblclick .view"  : "edit",
        "click a.popDetail" : "popDetail",
        //"keypress .edit"  : "updateOnEnter",
        //"blur .edit"      : "close"
      },

      // Re-render the titles of the todo item.
      render: function() {
        this.$el.html(this.presenTemplate(this.model.toJSON()));
        //this.$el.toggleClass('done', this.model.get('done'));
        //this.input = this.$('.edit');
        return this;
      },

      // PopUp Detail 
      popDetail: function(e) {
        // 

        console.log("popDetail : " + this.model.get("ppt_name"));
        
        this.model.set({vf: true},{silent: true});
        //dview.dialogview({model: this.model});
        
        dview.render(this.model);
        
        //$("#detail_dialog").append(dview.render().el);
        //$("#detail_dialog").html();
        //$("#detail_dialog").append(dview.render().el);

        e.preventDefault();
        //$.mobile.changePage('#detail');
        $.mobile.changePage( $("#detail_dialog"), { role: "dialog", transition: "fade" });


      }

    });
    
    ////////////////////////////
    // Detail View 
    var DetailView = Backbone.View.extend({

      //... is a list tag.
      el : $('#detail_dialog'),

      
      
      // Cache the template function for a single item.
      //detailTemplate: _.template($('#detail-template').html()),

      // The DOM events specific to an item.
      events: {
        "click #good"   : "countup",
        "click #close"   : "dialogClose",
      },

      // Re-render the titles of the todo item.
      render: function(presen) {
        console.log("DetailView render : " + presen.get("ppt_name")+ ":"+presen.get("vf"));
        //this.$el.html(this.detailTemplate(this.model.toJSON()));
        //this.$el.html(this.model.toJSON());
        $("#user_name").text("#"+presen.get("p_order")+" "+presen.get("user_name")+" のプレゼン");
        $("#ppt_name").text(presen.get("ppt_name"));
        $('#count_point').text(presen.get("point"));
        this.model = presen;
        return this;

      },
      dialogClose: function() {
        console.log("DetailView dialogClose : " + this.model.get("ppt_name"));

        this.model.set({vf: false},{silent: true});

        $('.ui-dialog').dialog('close');

      },

      dialogview: function(){
        
      },

      countup: function(){
          
          $("#count_point").hide();
          $("#updating").show();

          if(this.model.get("vf")==true){
            console.log("DetailView countup : "+this.model.get("ppt_name"));
            this.model.save(null, {
              success: function(model, resp) {
                console.log("countup success: "+model.get("ppt_name")+":"+model.get("point"));
                $('#count_point').text(model.get("point"));
                // $("#count_point").show();
                // $("#updating").hide();
                return;
              },
              error: function(model, resp) {
                  console.log("countup error: ");
                // $("#count_point").show();
                // $("#updating").hide();
                return;
              }
            
            });
          }

          var ripple = $("<span />").addClass("ripple").css({left: event.clientX - 250, top: event.clientY - 250, position: "absolute"}).appendTo("body");
          setTimeout(function () {
            ripple.remove();
            $("#count_point").show();
            $("#updating").hide();



          }, 1000);

          // if(this.model.get("vf") == true){
          //   console.log("DetailView countup : "+this.model.get("ppt_name"));
          //   this.model.save(null, {
          //     success: function(model, resp) {
          //       console.log("countup success: ");
          //       $('#count_point').text(model.get("point"));
          //       $("#count_point").show();
          //       $("#updating").hide();
          //     },
          //     error: function(model, resp) {
          //         console.log("countup error: ");
          //       $("#count_point").show();
          //       $("#updating").hide();
          //     }
            
          //   });
          // }

          //return;
      }
    });
    
    
    // The Application
    // ---------------

    // Our overall **AppView** is the top-level piece of UI.
    var AppView = Backbone.View.extend({

      el: $("#votelt"),
            
      initialize: function() {
          this.listenTo(presenList, 'reset', this.addAll);

          console.log("AppView initialized!");
      },

      render: function(){
        presenList.fetch({
              success : function success(collection, res, options) {
                  // collection.each( function(item, index){
                  // console.log("presenList["+index+"]: "+ item.get("ppt_id"));}
                  // );
                  //this.$("#presen-list").empty();
                  presenList.trigger('reset');

              },
              error : function error() {
                  console.log("fetch error!");
              }
        });
      },

      fetchAll: function(){

        presenList.fetch({
          success : function success(collection, res, options) {
               collection.each( function(item, index){

                var presen = presenList.get(item.get("ppt_id"));
                //console.log(item);
                //console.log(presen.get("ppt_name")+":"+presen.get("ppt_id")+":"+presen.get("point"));
                //console.log(item.get("ppt_name")+":"+item.get("ppt_id")+":"+item.get("point"));
                //presen.set({point: item.get("point")} ,{silent: true});
                //presen.set({point: item.get("point")});
                $('#count_'+presen.get("ppt_id")).text(item.get("point"));
                
              });
              console.log("fetchAll success!");
          },
          error : function error() {
              console.log("fetch error!");
          }
        });


      },


      addOne: function(presen) {
        //console.log("addOne : "+ presen.get("ppt_name"));
        var view = new PresenView({model: presen});
        this.$("#presen-list").append(view.render().el);
      },


      
      addAll: function() {
        console.log("addAll!");
        presenList.each(this.addOne, this);
        $('#presen-list').trigger("create");
      },



    });

    // Finally, we kick things off by creating the **App**.
    $.ajaxSetup({ cache: false });
    $('.ui-icon-loading').hide();

    console.log("Hello AppView!");
    var appview = new AppView();
    var dview = new DetailView();
    appview.render();


    var timer = _.extend({
      start : function() {
        setInterval(function() {
          // 
          appview.fetchAll();
        }, 10000);
      }
    }, Backbone.Events);
    timer.start();


    return;
  
    
}());

