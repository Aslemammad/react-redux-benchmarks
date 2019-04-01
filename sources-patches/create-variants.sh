#!/bin/sh

if [ ! -e sources/tree-view-useReduxState ]; then
	cp -r sources/tree-view sources/tree-view-useReduxState
	patch -d sources/tree-view-useReduxState -p2 < sources-patches/tree-view-rher
fi

if [ ! -e sources/tree-view-useReduxStateSimple ]; then
	cp -r sources/tree-view sources/tree-view-useReduxStateSimple
	patch -d sources/tree-view-useReduxStateSimple -p2 < sources-patches/tree-view-rherSimple
fi

if [ ! -e sources/tree-view-dumb ]; then
	cp -r sources/tree-view sources/tree-view-dumb
	patch -d sources/tree-view-dumb -p2 < sources-patches/tree-view-dumb
fi

if [ ! -e sources/tree-view-memo ]; then
	cp -r sources/tree-view sources/tree-view-memo
	patch -d sources/tree-view-memo -p2 < sources-patches/tree-view-memo
fi

if [ ! -e sources/tree-view-rrh ]; then
	cp -r sources/tree-view sources/tree-view-rrh
	patch -d sources/tree-view-rrh -p2 < sources-patches/tree-view-rrh
fi

if [ ! -e sources/deeptree-useReduxState ]; then
	cp -r sources/deeptree sources/deeptree-useReduxState
	patch -d sources/deeptree-useReduxState -p2 < sources-patches/deeptree-rher
fi

if [ ! -e sources/twitter-lite-useReduxState ]; then
	cp -r sources/twitter-lite sources/twitter-lite-useReduxState
	patch -d sources/twitter-lite-useReduxState -p2 < sources-patches/twitter-lite-rher
fi

if [ ! -e sources/stockticker-useReduxState ]; then
	cp -r sources/stockticker sources/stockticker-useReduxState
	patch -d sources/stockticker-useReduxState -p2 < sources-patches/stockticker-rher
fi

if [ ! -e sources/stockticker-useReduxStateMapped ]; then
	cp -r sources/stockticker sources/stockticker-useReduxStateMapped
	patch -d sources/stockticker-useReduxStateMapped -p2 < sources-patches/stockticker-rher
fi

if [ ! -e sources/forms-useReduxState ]; then
	cp -r sources/forms sources/forms-useReduxState
	patch -d sources/forms-useReduxState -p2 < sources-patches/forms-rher
fi

if [ ! -e sources/deeptree-nested-useReduxState ]; then
	cp -r sources/deeptree-nested sources/deeptree-nested-useReduxState
	patch -d sources/deeptree-nested-useReduxState -p2 < sources-patches/deeptree-nested-rher
fi

if [ ! -e sources/deeptree-nested-rrh ]; then
	cp -r sources/deeptree-nested sources/deeptree-nested-rrh
	patch -d sources/deeptree-nested-rrh -p2 < sources-patches/deeptree-nested-rrh
fi
