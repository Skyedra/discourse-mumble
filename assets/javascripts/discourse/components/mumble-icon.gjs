import Component from "@glimmer/component";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";
import concatClass from "discourse/helpers/concat-class";
import icon from "discourse-common/helpers/d-icon";
import getURL from "discourse-common/lib/get-url";
import I18n from "discourse-i18n";
import Dropdown from "discourse/components/header/dropdown";
import DropdownMenu from "discourse/components/dropdown-menu";
import { action } from "@ember/object";

export default class MumbleHeaderIcon extends Component {
  @service currentUser;
  @service site;
  @service chatStateManager;
  @service router;

/*
  get showUnreadIndicator() {
    if (this.chatStateManager.isFullPageActive && this.site.desktopView) {
      return false;
    }
    return !this.currentUserInDnD;
  }
  */

  get isActive() {
    return (
      this.args.isActive 
	  /*||
      this.chatStateManager.isFullPageActive ||
      this.chatStateManager.isDrawerActive*/
    );
  }

  get title() {
	/*
    if (
      this.chatStateManager.isFullPageActive &&
      !this.chatSeparateSidebarMode.never &&
      this.site.desktopView
    ) {
      return I18n.t("sidebar.panels.forum.label");
    }

    return I18n.t("chat.title_capitalized");
	*/
	return I18n.t("mumble.icon.title");
  }

  get icon() {
	/*
    if (
      this.chatStateManager.isFullPageActive &&
      !this.chatSeparateSidebarMode.never &&
      this.site.desktopView
    ) {
      return "shuffle";
    }

    return "d-chat";
	*/

	return "headphones";
  }

/*
  get href() {
    if (this.site.mobileView && this.chatStateManager.isFullPageActive) {
      return getURL("/chat");
    }

    if (
      this.chatStateManager.isFullPageActive &&
      !this.chatSeparateSidebarMode.never
    ) {
      return getURL(this.chatStateManager.lastKnownAppURL || "/");
    }

    if (this.chatStateManager.isDrawerActive) {
      return getURL("/chat");
    }

    return getURL(this.chatStateManager.lastKnownChatURL || "/chat");
  }

  @href={{this.href}}

  {{#if this.showUnreadIndicator}}
          <ChatHeaderIconUnreadIndicator
            @urgentCount={{@urgentCount}}
            @unreadCount={{@unreadCount}}
            @indicatorPreference={{@indicatorPreference}}
          />
        {{/if}}
  */

/*
  <template>
    <li class="header-dropdown-toggle mumble-header-icon">
      <DButton
        
        tabindex="0"
        class={{concatClass "icon" "btn-flat" (if this.isActive "active")}}
        title={{this.title}}
      >
        {{~icon this.icon~}}
      </DButton>
    </li>
  </template>


  @iconId={{@searchButtonId}}
		@active={{this.search.visible}}
		@href={{getURL "/search"}}
  */

 @action
  toggleMumbleMenu() {
	/*
    if (this.site.mobileView) {
      const context = this.search.searchContext;
      let params = "";
      if (context) {
        params = `?context=${context.type}&context_id=${context.id}&skip_context=${this.skipSearchContext}`;
      }

      if (this.router.currentRouteName === "full-page-search") {
        scrollTop();
        document.querySelector(".full-page-search").focus();
        return false;
      } else {
        return DiscourseURL.routeTo("/search" + params);
      }
    }*/

    this.mumbleVisible = !this.mumbleVisible;

	// I have no idea how to do this the discourse way >.<
	if (this.mumbleVisible)
	{
		document.getElementById("mumble-menu").style.display = 'block';
		document.getElementsByClassName("mumble-dropdown")[0].classList.add('active');  // no idea how to get discourse to just use an id for the button >.<
	}
	else
	{
		document.getElementById("mumble-menu").style.display = 'none';
		document.getElementsByClassName("mumble-dropdown")[0].classList.remove('active');  // no idea how to get discourse to just use an id for the button >.<
	}
	/*
    if (!this.search.visible) {
      this.search.highlightTerm = "";
      this.search.inTopicContext = false;
      document.getElementById(SEARCH_BUTTON_ID)?.focus();
    }
	*/
  }

 <template>
	<Dropdown
		@title="mumble.icon.title"
		@icon="microphone"
		@className="mumble-dropdown"
		@targetSelector=".mumble-menu-panel"
		@onClick={{this.toggleMumbleMenu}}
		@active={{this.mumbleVisible}}
	/> 	
	<div class="mumble-menu glimmer-mumble-menu" aria-live="polite" ...attributes>
		<div class="menu-panel mumble-menu-panel drop-down" id='mumble-menu' data-max-width="500" style="display: none;">
			(Mumble server may be offline... this will refresh if it comes back online.)
		</div>
	</div>
 </template>
}
