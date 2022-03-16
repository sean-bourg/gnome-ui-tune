var mod = imports.misc.extensionUtils.getCurrentExtension().imports.src.mod

var workspaceThumbnail = imports.ui.workspaceThumbnail
var SecondaryMonitorDisplay = imports.ui.workspacesView.SecondaryMonitorDisplay

var Mod = class extends mod.Base {
    enable() {
        // Thumbnails on main monitor
        this.bkp_MAX_THUMBNAIL_SCALE = workspaceThumbnail.MAX_THUMBNAIL_SCALE
        workspaceThumbnail.MAX_THUMBNAIL_SCALE = 0.1
        
        // Thumbnails on second monitor
        if (!SecondaryMonitorDisplay) return; // gnome 42: this object does not exist when there is only one monitor or during login
        this.bkp_SecondaryMonitorDisplay_getThumbnailsHeight = SecondaryMonitorDisplay.prototype._getThumbnailsHeight
        SecondaryMonitorDisplay.prototype._getThumbnailsHeight = function(box) {
                if (!this._thumbnails.visible)
                    return 0;                
                const [width, height] = box.get_size();
                const { expandFraction } = this._thumbnails;
                const [thumbnailsHeight] = this._thumbnails.get_preferred_height(width);
                return Math.min(
                    thumbnailsHeight * expandFraction,
                    height * workspaceThumbnail.MAX_THUMBNAIL_SCALE);
        }
    }

    disable() {
        if (this.bkp_MAX_THUMBNAIL_SCALE) {
            workspaceThumbnail.MAX_THUMBNAIL_SCALE = this.bkp_MAX_THUMBNAIL_SCALE
        }

        if (!SecondaryMonitorDisplay) return; // gnome 42: this object does not exist when there is only one monitor or during login
        if (this.bkp_SecondaryMonitorDisplay_getThumbnailsHeight) {
            SecondaryMonitorDisplay.prototype._getThumbnailsHeight = this.bkp_SecondaryMonitorDisplay_getThumbnailsHeight
        }
    }
}

