import { withPluginApi } from 'discourse/lib/plugin-api';
import { iconNode } from 'discourse-common/lib/icon-library';
import { iconHTML } from 'discourse-common/lib/icon-library';
import { h } from 'virtual-dom';
import { ajax } from 'discourse/lib/ajax';
import MumbleHeaderIcon from "../components/mumble-icon";

let mumbleIconWidget, mumblePanelWidget, mumbleData;

function countUsers(channel) {
  let count = channel.users.length;
  const siteSettings = Discourse.__container__.lookup("site-settings:main");

  channel.channels.forEach((chan) => {
    if ( chan !== siteSettings.mumble_afkchannel ) {
      count += countUsers(chan);
    }
  });
  return count;
}

function subscribeMumble() {
  const messageBus = Discourse.__container__.lookup("message-bus:main");

  messageBus.subscribe("/mumble", (result) => {
    if (result.data) {
      mumbleData = result.data;
      rerenderWidgets();
    }
  });
}

function sanitize(string) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		"/": '&#x2F;',
	};
	const reg = /[&<>"'/]/ig;
	return string.replace(reg, (match)=>(map[match]));
  }

function getChannelHTML(channel)
{
	let outputText = "<li class='mumble-channel-name'>Channel:  " + channel.name + "</li>";
	if (channel.users)
	{
		outputText += "<ul>";
		channel.users.forEach((user) => {
			outputText += "<li>";
			if (user.deaf || user.selfDeaf)
				outputText += iconHTML("volume-mute", { class: 'mumble-user-icon'});
			else if (user.mute || user.selfMute)
				outputText += iconHTML("microphone-slash", { class: 'mumble-user-icon'});
			else
				outputText += iconHTML("microphone", { class: 'mumble-user-icon'});
			outputText += " " + sanitize(user.name) + "</li>";
		});
		outputText += "</ul>";
	}
	if (channel.channels)
	{
		channel.channels.forEach((subChannel) => {
			outputText += getChannelHTML(subChannel);
		});
	}
	return outputText;
}

function setBadge(userCount)
{
	var badge = document.getElementById("mumble-user-count-badge");

	if (badge != null && userCount == 0)
	{
		// Delete badge, no more users
		badge.remove();
		return;
	}

	if (badge == null && userCount == 0)
	{
		// No badge, but none is needed
		return;
	}

	if (badge == null && userCount > 0)
	{
		// No badge currently, need to add badge
		var button = document.getElementsByClassName("mumble-dropdown")[0].children[0];
		badge = document.createElement('div');
		badge.id = "mumble-user-count-badge";
		button.appendChild(badge);
	}

	// Update badge count
	badge.innerText = userCount;
}

function rerenderWidgets() 
{
	renderPanel();
	renderBadge();
}

function renderBadge()
{
	var userCount = 0;
	if (mumbleData != null)
	{
		userCount = countUsers(mumbleData.root);
	}
	setBadge(userCount);
}

function renderPanel()
{
	const siteSettings = Discourse.__container__.lookup("site-settings:main");

	let panel = document.getElementById("mumble-menu");
	panel.innerHTML = "<h3>Voice Server</h3>"; // clear existing DOM
	panel.innerHTML += "<p>Join us in our Mumble server!  ";
	if (siteSettings.mumble_daily_meet_time != '')
	{
		let currentTime = new Date();
		// (I put in the current day in the hopes that when the clocks spring forward or back (ugh), this will update the
		// time correctly to shift with the clocks.)
		let meetTime = new Date(currentTime.getFullYear() + " " + currentTime.getMonth() + " " + currentTime.getDay() +
			 " " + "02:30:00 -800")
		let convertedTime = meetTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZoneName:'longGeneric'});
		panel.innerHTML += "We chat at " + convertedTime + " most days.";
	}
	
	panel.innerHTML += "<hr>";
	panel.innerHTML += "<h4>Connection Info</h4>";
	panel.innerHTML += "<p>First, <a href='https://www.mumble.info/downloads/' target='_blank'>download</a> Mumble/Mumla client for Win, Mac, Linux, Android, or iOS.";
	panel.innerHTML += "<p>Then connect to <code>" + siteSettings.mumble_server_ui_connect_path + "</code> port <code>" + siteSettings.mumble_server_ui_connect_port + "</code>.  "
	panel.innerHTML += "<hr>"

	if (mumbleData == null)
		panel.innerHTML += "(No connection for live data, server may be offline.)";
	else
	{
		var totalUsers = countUsers(mumbleData.root);

		if (totalUsers == 0)
		{
			panel.innerHTML += "(No users currently connected.)";
		} else {
			panel.innerHTML += "<h4>Currently Chatting</h4>";
			panel.innerHTML += "<ul class='mumble-chat-list'>" + getChannelHTML(mumbleData.root) + "</ul>";
			panel.innerHTML += "<hr>" + totalUsers + " user(s) connected.";
		}
	}

  // ugly but works...
  /*
  if (mumbleIconWidget) {
    mumbleIconWidget.scheduleRerender();
  }
  if (mumblePanelWidget) {
    mumblePanelWidget.scheduleRerender();
  }
	*/
/*
	const caretIcon = state.expanded ? "caret-down" : "caret-right";
      const body      = [h("div.mumble-channel-name", [iconNode(caretIcon), attrs.channel.name])];

      if (state.expanded) {
        const list = [];
        attrs.channel.channels.forEach((channel) => {
          list.push(this.attach("mumble-channel", {channel}));
        });

        attrs.channel.users.forEach((user) => {
          list.push(this.attach("mumble-user", {user}));
        });

        body.push(h("div", list));
      }

	
	document.getElementById("mumble-menu").append(body);
	*/
}

function initMumbleWidget(api) {

  api.createWidget("mumble-icon", {
    tagName: "li.header-dropdown-toggle",

    buildKey(attrs) {
      return "mumble-icon";
    },

    buildClasses(attrs) {
      if (attrs.state.mumbleVisible) { return "active"; };
    },

    html(attrs) {
      const icon = iconNode("headphones");
      const userCount = attrs.data ? countUsers(attrs.data.root) : 0;
      const badge = h('div.badge-notification.mumble-badge', {}, userCount);
      return h('a.icon.btn-flat', {}, [icon, badge]);
    },

    click(e) {
      e.preventDefault();
      const action = this.attrs.state.mumbleVisible ? "hide" : "show";
      this.sendWidgetAction(`${action}Mumble`);
    }
  });

  api.createWidget("mumble-panel", {
    tagName: "div.mumble-panel",

    buildKey(attrs) {
      return "mumble-panel";
    },

    html(attrs) {
      if (attrs.state.mumbleVisible) {
        return this.attach("menu-panel", {
          contents: () => {
            if (attrs.data) {
              const header    = h("div.mumble-panel-header", [iconNode("server"), attrs.data.name]);
              const channels  = this.attach("mumble-channel", {channel: attrs.data.root, root: true});
              return [header, h("hr"), channels];
            }
          }
        });
      }
    },

    clickOutside() {
      this.sendWidgetAction("hideMumble");
    }
  });

  api.createWidget("mumble-channel", {
    tagName: "div.mumble-channel",

    buildClasses(attrs) {
      if (attrs.root) {
        return "root";
      }
    },

    buildKey(attrs) {
      return `mumble-channel-${attrs.channel.id}`;
    },

    defaultState(attrs) {
      return { expanded: (attrs.root ? true : false) };
    },

    html(attrs, state) {
      const caretIcon = state.expanded ? "caret-down" : "caret-right";
      const body      = [h("div.mumble-channel-name", [iconNode(caretIcon), attrs.channel.name])];

      if (state.expanded) {
        const list = [];
        attrs.channel.channels.forEach((channel) => {
          list.push(this.attach("mumble-channel", {channel}));
        });

        attrs.channel.users.forEach((user) => {
          list.push(this.attach("mumble-user", {user}));
        });

        body.push(h("div", list));
      }

      return body;
    },

    click() {
      this.state.expanded = !this.state.expanded;
    }
  });

  api.createWidget("mumble-user", {
    tagName: "div.mumble-user",

    buildKey(attrs) {
      return `mumble-user-${attrs.user.name}`;
    },

    buildClasses(attrs) {
      const idle = attrs.user.idlesecs;
      if (idle && parseInt(idle) > 0) {
        return "idle";
      }
    },

    html(attrs) {
      return h("span", [iconNode("user"), attrs.user.name]);
    }
  });

  /// EEE
  api.headerIcons.add("mumble", MumbleHeaderIcon, { before: "chat" });

  /*
  api.decorateWidget('header-icons:before', dec => {
    mumbleIconWidget = dec.widget;
    const state = dec.widget.parentWidget.state;
    return dec.attach("mumble-icon", {state, data: mumbleData});
  });

  api.attachWidgetAction("header", "showMumble", function() {
    this.state.mumbleVisible = true;
  });

  api.attachWidgetAction("header", "hideMumble", function() {
    this.state.mumbleVisible = false;
  });

  api.addHeaderPanel("mumble-panel", "mumbleVisible", function(attrs, state) {
    mumblePanelWidget = this;
    return {attrs, state, data: mumbleData};
  });
  */

  ajax("/mumble/list.json").then((result) => {
    if (result.data) {
      mumbleData = result.data;
      rerenderWidgets()
    }
  });

}

export default {
  name: 'extend-for-mumble',
  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    if (siteSettings.mumble_enabled) {
      withPluginApi('0.1', initMumbleWidget);
      subscribeMumble();
    }
  }
};