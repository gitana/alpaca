(function() {
Alpaca.PathBasedDependencies = (function() {

	//var registry = {};

	return {

		postRenderCallback: function(control) {
			if (!control.options.x_dependencies) return;
			var deps = control.options.x_dependencies;
			control.on("change", function() {
				var deps = this.options.x_dependencies;
				Alpaca.PathBasedDependencies.updateDeps(deps,this,
					Alpaca.PathBasedDependencies.processDepLeaf);
			});
			Alpaca.PathBasedDependencies.doRecursive(control, function(current) {
				current.on("add",function() {
					//console.log("########ADD EVENT");
					Alpaca.PathBasedDependencies.updateDeps(deps,control,
						Alpaca.PathBasedDependencies.processDepLeaf);
				});
				current.on("move",function() {
					//console.log("########ADD EVENT");
					Alpaca.PathBasedDependencies.updateDeps(deps,control,
						Alpaca.PathBasedDependencies.processDepLeaf);
				});
			});
		},

		// call callback(element) on current and all of its children
		doRecursive: function(current,callback) {
			callback(current);
			if (!current.children) return;
			for (var i=0; i<current.children.length; i++) {
				Alpaca.PathBasedDependencies.doRecursive(current.children[i],callback);
			}
		},

		// Update all dependencies. Call on onChange or onAdd
		// deps - array of dependencies: {field, values, enables}
		//        field - path to source field
		//        values - array of source field values 
		//        enables - relative path to element(s) to enable when source field
		//                  matches one of the values
		updateDeps: function(deps,rootelem,callback) {
			for (var i=0; i<deps.length; i++) {
				var dep = deps[i];
				//console.log("###########START "+JSON.stringify(dep));
				var pathArray = dep.field.split('/');
				Alpaca.PathBasedDependencies.processDep(dep,pathArray,rootelem,callback);
			}
		},

		// process one dependency (recursive function). Can be used to traverse
		//     field path or enables path.
		// dep - dependency (see updateDeps)
		// pathArray - elements of field path
		// current - top level alpaca element that matches top of pathArray
		// callback - function to call on leaves
		processDep: function(dep,pathArray,current,callback) {
			pathArray = pathArray.slice(0); // clone
			if (pathArray.length == 0) {
				// leaf -> check dependency
				if (typeof current == "undefined") return;
				if (!current) return;
				callback(dep,current);
				return;
			}
			var name = pathArray.shift();
			var isArray=false;
			var z = name.indexOf("[]");
			if (z >= 0) {
				name = name.substring(0,z);
				isArray=true;
			}
			//console.log(name+"#"+isArray+"$");
			current = current.childrenByPropertyId[name];
			if (!isArray) {
				Alpaca.PathBasedDependencies.processDep(dep,pathArray,current,callback);
			} else {
				//console.log("array size "+current.children.length);
				for (var j=0; j<current.children.length; j++) {
					Alpaca.PathBasedDependencies.processDep(dep,pathArray,current.children[j],callback);
				}
			}
		},

		// process dependency of field leaf, check if field matches any of the values.
		processDepLeaf: function(dep,current) {
			//console.log("leaf="+current.getValue());
			//console.log(current);
			// check if value matches one of the possible values
			for (var i=0; i<dep.values.length; i++) {
				if (current.getValue() == dep.values[i]) {
					Alpaca.PathBasedDependencies.processDepLeafEnable(true,dep.enables,current.parent,
						Alpaca.PathBasedDependencies.enableField);
					return;
				}
			}
			// no match -> disable
			Alpaca.PathBasedDependencies.processDepLeafEnable(false,dep.enables,current.parent,
				Alpaca.PathBasedDependencies.enableField);
		},

		// traverse path to enable/disable leaves
		processDepLeafEnable: function(enable,dep,current,callback) {
			var pathArray = dep.split('/');
			Alpaca.PathBasedDependencies.processDep(enable,pathArray,current,callback);
		},

		// enable/disable leaf field
		enableField: function(enable,current) {
			//console.log(enable ? "###ENABLE" : "$$$DISABLE");
			current.getFieldEl().context.style.display = enable ? "" : "none";
			if (!enable) {
				/* Do not clear values for now.
				// clear value when disabled
				current.setDefault();
				// also clear values of children
				Alpaca.PathBasedDependencies.doRecursive(current, function(cur) {
					cur.setDefault();
				});
				// TODO empty arrays (setDefault on array does not empty it)
				*/
			}
			//console.log(current);
		},

	}

})();

})();
