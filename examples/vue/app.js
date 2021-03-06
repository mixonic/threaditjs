var Home = Vue.extend({
	template : "#thread_list",
	route : {
		data : function() {
			return 	reqwest({
				url : T.apiUrl + "/threads",
				crossOrigin: true
			})
			.then(function(data) {
				document.title = "ThreaditJS: Vue | Home";
				return {threads: data.data};
			});
		}
	},
	//You can specify a lot more about the properties, this is closer to a minimum 
	props: ["threads", "responseText"],
	methods : {
		handleSubmit : function() {
			var self = this;
			reqwest({
				url : T.apiUrl + "/threads/create",
				method : "post",
				crossOrigin: true,
				data : {
					text : this.responseText,
				}
			})
			.then(function(response) {
				self.threads.push(response.data);
				self.responseText = "";
			});
		}
	}
});

//Create the filter, now accessible in the views
Vue.filter("trimThreadTitle", T.trimTitle);

//Comment component.
var Comment = Vue.component("comment", {
	template : "#comment",
	route : {
		data : function(transition) {
			return 	reqwest({
				url : T.apiUrl + "/comments/" + transition.to.params.id,
				crossOrigin: true
			})
			.then(function(response){
				document.title = "ThreaditJS: Vue | " + T.trimTitle(response.data[0].text);
				return T.transformResponse(response).root;
			});
		}
	},
	props: ["text", "children", "id", "comment_count", "replying", "responseText"],
	methods : {
		startReplying : function() {
			this.replying=true;
		},
		handleSubmit : function() {
			var self = this;
			reqwest({
				url : T.apiUrl + "/comments/create",
				method : "post",
				crossOrigin: true,
				data : {
					text : this.responseText,
					parent : this.id
				}
			})
			.then(function(response) {
				self.children.push(response.data);
				self.responseText = "";
				self.replying = false;
			});
		}
	}
});

//Has the router outlet in it
var Threadit = Vue.extend({
	template : "#threadit"
});

//Routing
var router = new VueRouter({
	hashbang : false,
	history: true,
	saveScrollPosition : true
}); 

router.map({
	"/" : {
		component : Home
	},
	"/thread/:id" : {
		name: "thread",
		component : Comment
	}
});
router.start(Threadit, "#app");