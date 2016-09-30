/**
 * This data rendering helper method can be useful for cases where you have
 * potentially large data strings to be shown in a column that is restricted by
 * width. The data for the column is still fully searchable and sortable, but if
 * it is longer than a give number of characters, it will be truncated and
 * shown with ellipsis. A browser provided tooltip will show the full string
 * to the end user on mouse hover of the cell.
 *
 * This function should be used with the `dt-init columns.render` configuration
 * option of DataTables.
 *
 * It accepts two parameters:
 *
 * 1. `-type integer` - The number of characters to restrict the displayed data
 *    to.
 * 2. `-type boolean` (optional - default `false`) - Indicate if the truncation
 *    of the string should not occur in the middle of a word (`true`) or if it
 *    can (`false`). This can allow the display of strings to look nicer, at the
 *    expense of showing less characters.
 *
 *  @name ellipsis
 *  @summary Restrict output data to a particular length, showing anything
 *      longer with ellipsis and a browser provided tooltip on hover.
 *  @author [Allan Jardine](http://datatables.net)
 *  @requires DataTables 1.10+
 *
 * @returns {Number} Calculated average
 *
 *  @example
 *    // Restrict a column to 17 characters, don't split words
 *    $('#example').DataTable( {
 *      columnDefs: [ {
 *        targets: 1,
 *        render: $.fn.dataTable.render.ellipsis( 17, true )
 *      } ]
 *    } );
 *
 *  @example
 *    // Restrict a column to 10 characters, do split words
 *    $('#example').DataTable( {
 *      columnDefs: [ {
 *        targets: 2,
 *        render: $.fn.dataTable.render.ellipsis( 10 )
 *      } ]
 *    } );
 */

jQuery.fn.dataTable.render = {
	ellipsis: function ( cutoff, wordbreak ) {
		return {
			display: function ( d ) {
				if ( wordbreak === undefined ) {
					wordbreak = false;
				}

				if ( typeof d !== 'number' && typeof d !== 'string' ) {
					return d;
				}

				var str = d.toString(); // cast numbers

				if ( d.length < cutoff ) {
					return d;
				}

				str = d.substr(0, cutoff);

				if ( wordbreak ) {
					// Find the last white space character in the string
					str = str.replace(/\s([^\s]*)$/, '');
				}

				return '<span class="ellipsis" title="'+d+'">'+str+'&#8230;</span>';
			}
		};
	}
};