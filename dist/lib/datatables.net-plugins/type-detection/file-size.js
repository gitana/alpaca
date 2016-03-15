/**
 * Detect file size type columns automatically. Commonly used for computer
 * file sizes, this can allow sorting to take the order of magnitude indicated
 * by the label (GB etc) into account.
 *
 *  @name File size
 *  @summary Detect abbreviated file size data (8MB, 4KB, 3B, etc)
 *  @author Allan Jardine - datatables.net
 */

jQuery.fn.dataTable.ext.type.detect.unshift( function ( data ) {
	if ( typeof data !== 'string' ) {
		return null;
	}

	var units = data.replace( /[\d\.]/g, '' ).toLowerCase();
	if ( units !== '' && units !== 'b' && units !== 'kb' && units !== 'mb' && units !== 'gb' ) {
		return null;
	}

	return isNaN( parseFloat( data ) ) ?
		null :
		'file-size';
} );