var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "rates"	: "list",
        "rates/page/:page"	: "list",
        "rates/add"         : "addRate",
        "rates/:id"         : "rateDetails",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var rateList = new RateCollection();
        rateList.fetch({success: function(){
            $("#content").html(new RateListView({model: rateList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    rateDetails: function (id) {
        var rate = new Rate({_id: id});
        rate.fetch({success: function(){
            $("#content").html(new RateView({model: rate}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addRate: function() {
        var rate = new Rate();
        $('#content').html(new RateAddView({model: rate}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'RateView', 'RateAddView', 'RateListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});