sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, History) {
	"use strict";

	return BaseController.extend("generated.app.controller.translateui", {

		translateButtonPressed: function() {
			var self = this;
			var aLangName = ["German", "Spanish (Spain)", "French (France)", "Italian", "Japanese",
				"Portuguese (Brazil)", "Chinese (Simplified)"
			];
			var aLangCode = ["de", "es", "fr", "it", "ja", "pt", "zh"];
			var oldText = this.getView().byId("OldText").getValue();
			var newLang = this.getView().byId("NewLang").getSelectedItem();
			if (newLang !== null) {
				//var oldLangCode = aLangCode[aLangName.indexOf(oldLang.mProperties.text)];
				var newLangCode = aLangCode[aLangName.indexOf(newLang.mProperties.text)];
				var data =
					"{\r\n  \"sourceLanguage\":en,\r\n  \"targetLanguages\": [\r\n " + newLangCode +
					"   \r\n  ],\r\n  \"units\": [\r\n    {\r\n      \"value\":\"" + oldText + "\"\r\n    }\r\n  ]\r\n}";
				var xhr = new XMLHttpRequest();
				xhr.withCredentials = true;
				xhr.addEventListener("readystatechange", function() {
					if (this.readyState === this.DONE) {
						sap.m.MessageToast.show("Translated!");
						self.getView().byId("NewText").setValue(JSON.parse(this.responseText).units[0].translations[0].value);
					}
				});
				//setting request method
				xhr.open("POST", "https://sandbox.api.sap.com/translationhub/api/v1/translate");
				//adding request headers
				xhr.setRequestHeader("Content-Type", "string");
				xhr.setRequestHeader("Accept", "application/json; charset=utf-8");
				xhr.setRequestHeader("APIKey", "W3snwghloiP54BRuSVmr8TF45bAZsWUG");

				//sending request
				xhr.send(data);
			} else {
				var dialog = new sap.m.Dialog({
					title: 'Missing Language',
					type: 'Message',
					state: 'Error',
					content: new sap.m.Text({
						text: "Please select a language."
					}),
					beginButton: new sap.m.Button({
						text: 'OK',
						press: function() {
							dialog.close();
						}
					}),
					afterClose: function() {
						dialog.destroy();
					}
				});
				dialog.open();
			}
		},

		handleRouteMatched: function(oEvent) {
			var oParams = {};

			if (oEvent.mParameters.data.context || oEvent.mParameters.data.masterContext) {
				var oModel = this.getView ? this.getView().getModel() : null;
				if (oModel) {
					oModel.setRefreshAfterChange(true);

					if (oModel.hasPendingChanges()) {
						oModel.resetChanges();
					}
				}

				this.sContext = oEvent.mParameters.data.context;
				this.sMasterContext = oEvent.mParameters.data.masterContext;

				if (!this.sContext) {
					this.getView().bindElement("/" + this.sMasterContext, oParams);
				} else {
					this.getView().bindElement("/" + this.sContext, oParams);
				}

			}

		},
		onInit: function() {
			this.mBindingOptions = {};
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("translateui").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));

		}
	});
}, /* bExport= */ true);