# RowReorder for DataTables 

This package contains distribution files for the [RowReorder extension](https://datatables.net/extensions/rowreorder) for [DataTables](https://datatables.net/). Only the core software for this library is contained in this package - to be correctly styled, a styling package for RowReorder must also be included. Styling options include DataTable's native styling, [Bootstrap](http://getboostrap.com) and [Foundation](http://foundation.zurb.com/).

RowReorder adds end user reordering of rows in a DataTable through click-and-drag mouse and touch operations. RowReorder provides full support for Editor allowing end users to update sequential information in a fast and easy manner.


## Installation

### Browser

For inclusion of this library using a standard `<script>` tag, rather than using this package, it is recommended that you use the [DataTables download builder](//datatables.net/download) which can create CDN or locally hosted packages for you, will all dependencies satisfied.

### npm

```
npm install datatables.net-rowreorder
```

```
var $ = require( 'jquery' );
require( 'datatables.net-rowreorder' )( window, $ );
```

### bower

```
bower install --save datatables.net-rowreorder
```



## Documentation

Full documentation of the DataTables options, API and plug-in interface are available on the DOCS_LINK. The site also contains information on the wide variety of plug-ins that are available for DataTables, which can be used to enhance and customise your table even further.


## Bug / Support

Support for DataTables is available through the [DataTables forums](//datatables.net/forums) and [commercial support options](//datatables.net/support) are available.


### Contributing

If you are thinking of contributing code to DataTables, first of all, thank you! All fixes, patches and enhancements to DataTables are very warmly welcomed. This repository is a distribution repo, so patches and issues sent to this repo will not be accepted. Instead, please direct pull requests to the [DataTables/RowReorder](http://github.com/DataTables/RowReorder). For issues / bugs, please direct your questions to the [DataTables forums](//datatables.net/forums).


## License

This software is released under the [MIT license](//datatables.net/license). You are free to use, modify and distribute this software, but all copyright information must remain.
