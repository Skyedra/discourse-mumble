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
import { rerenderWidgets } from "../initializers/extend-for-mumble";
import { requestInitialData } from "../initializers/extend-for-mumble";

export default class MumbleHeaderIcon extends Component {
  @service currentUser;
  @service site;
  @service chatStateManager;
  @service router;

  constructor() {
    super(...arguments);
	requestInitialData();
  }

  get title() {
	return I18n.t("mumble.icon.title");
  }

 @action
  toggleMumbleMenu() {

    this.mumbleVisible = !this.mumbleVisible;

	// I have no idea how to do this the discourse way >.<
	if (this.mumbleVisible)
	{
		document.getElementById("mumble-menu").style.display = 'block';
		document.getElementsByClassName("mumble-dropdown")[0].classList.add('active');  // no idea how to get discourse to just use an id for the button >.<

		rerenderWidgets(); // even if data isn't available, can at least render general info
	}
	else
	{
		document.getElementById("mumble-menu").style.display = 'none';
		document.getElementsByClassName("mumble-dropdown")[0].classList.remove('active');  // no idea how to get discourse to just use an id for the button >.<
	}
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
