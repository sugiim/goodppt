(function(){

    // template　{{}}
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
        parse : function parse(res) {    
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

        var dview = new DetailView({model: this.model});
        
        //$("#detail_dialog").append(dview.render().el);
        //$("#detail_dialog").html();
        $("#detail_dialog").append(dview.render().el);

        e.preventDefault();
        //$.mobile.changePage('#detail');
        $.mobile.changePage( $("#detail_dialog"), { role: "dialog" } );


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
      },

      // Re-render the titles of the todo item.
      render: function() {
        console.log("DetailView render : " + this.model.get("ppt_name"));
        //this.$el.html(this.detailTemplate(this.model.toJSON()));
        //this.$el.html(this.model.toJSON());
        $("#ppt_name").text(this.model.get("ppt_name"));
        return this;

      },

      countup: function(){
          console.log("DetailView countup : "+this.model.get("ppt_name"));
          

          var ripple = $("<span />").addClass("ripple").css({left: event.clientX - 250, top: event.clientY - 250, position: "absolute"}).appendTo("body");
          setTimeout(function () {
          ripple.remove();
          
          }, 1000);

          this.model.save(null, {
            success: function(model, resp) {
              console.log("countup success: ");
              
            },
            error: function(model, resp) {
                console.log("countup error: ");
                return false;
            }
          
          });

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
                  this.$("#presen-list").empty();
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
                presen.set("point", item.get("point"));
                //$('#count_'+presen.get("ppt_id")).text(presen.get("point"));
                
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
      },



    });

    // Finally, we kick things off by creating the **App**.

    console.log("Hello AppView!");
    var appview = new AppView();
    appview.render();

    var timer = _.extend({
      start : function() {
        setInterval(function() {
          // 
          appview.fetchAll();
        }, 3000);
      }
    }, Backbone.Events);
    timer.start();
  
    
}());

