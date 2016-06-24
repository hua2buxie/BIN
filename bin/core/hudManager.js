 define(["bin/common/indicatorView", "bin/common/alertView", "bin/common/statusView", "bin/common/datePickerView","bin/common/selectView"], 
	function(IndicatorView, AlertView, StatusView, DatePickerView, SelectView)
	{
		var HUDManager = function()
		{

		}

		var Class = HUDManager.prototype;

		Class.init = function()
		{
			var root = $("#HUDContainer");

			this._hudViews = {};

			// Add net
			var elemIndicatorContainer = $("<div id='indicatorHUD' style='z-index:1;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%'></div>");
			root.append(elemIndicatorContainer);

			this._indicator = new IndicatorView({style:bin.globalConfig.indicator || "dark"});
			elemIndicatorContainer.append(this._indicator.$());

			// Add alert
			this._elemAlertContainer = $("<div id='alertHUD'       style='z-index:2;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%;text-align:center;'></div>");
			root.append(this._elemAlertContainer);	
			// Add status
			this._elemStatusContainer = $("<div id='statusHUD'      style='z-index:3;position:absolute;background-color:transparent;pointer-events:none;width:100%;height:100%;text-align:center;'></div>");
			root.append(this._elemStatusContainer);

			this._alertZIndex = 1;
		
			console.info("HUDManager module initialize");
		}

		Class.startIndicator = function(options)
		{
			return this._indicator.start(options);
		}

		Class.stopIndicator = function(indicatorID)
		{
			this._indicator.stop(indicatorID);
		}

		Class.showStatus = function(message)
		{
			var v = new StatusView({text:message});
			this._elemStatusContainer.append(v.$()); 
		}
		Class.select = function(options)
		{
			var v = new SelectView(options);
			v.$().css("z-index", this._alertZIndex);
			++this._alertZIndex;
			
			this._elemAlertContainer.append(v.$());
		}
		Class.alert = function(options)
		{
			var v = new AlertView(options);
			v.$().css("z-index", this._alertZIndex);
			++this._alertZIndex;

			this._elemAlertContainer.append(v.$());

			return v;
		}

		Class.alertError = function(options)
		{
			if(options.title)
			{
				options.title.color = "red";
			}
			else
			{
				options.message.color = "red";
			}

			return this.alert(options);
		}

		Class.alertInfo = function(message, title)
		{
			var options = {title:(title ? {text:title} : null), message:{text:message}, buttons:[{text:"确定", onClick:function(v){v.close()}}]};

			return this.alert(options);
		}

		Class.datePicker = function(options)
		{
			if(typeof options === "function")
			{
				options = {onPick:options};
			}
			
			var v = new DatePickerView(options);
			v.$().css("z-index", this._alertZIndex);
			++this._alertZIndex;
			
			this._elemAlertContainer.append(v.$());
		} 

		Class.onCreateHUDView = function(view)
		{
			var hudid = view.hudid;
			if(this._hudViews[hudid])
			{
				return ;
			}

			this._hudViews[hudid] = view;
		}

		Class.onRemoveHUDView = function(view)
		{
			this._hudViews[view.hudid] = null;
			delete this._hudViews[view.hudid];
		}

		Class.onDeviceBack = function()
		{
			if(this._indicator.running())
			{
				this._indicator.reset();

				return true;
			}

			if(this._elemAlertContainer[0].children.length >  0)
			{ 
				var elem  = this._elemAlertContainer[0].children[this._elemAlertContainer[0].children.length-1];
				var hudid = elem.getAttribute("data-hudid");
				var view  = this._hudViews[hudid];
				if(view)
				{
					view.remove();
				}

				return true;
			}

			return false;
		}

		return HUDManager;
	}
);