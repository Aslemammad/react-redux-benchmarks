#!/bin/sh

if [ ! -e sources/tree-view-rher ]; then
	cp -r sources/tree-view sources/tree-view-rher
	patch -d sources/tree-view-rher -p2 < sources-patches/tree-view-rher
fi

#if [ ! -e sources/tree-view-rher-simple ]; then
#	cp -r sources/tree-view sources/tree-view-rher-simple
#	patch -d sources/tree-view-rher-simple -p2 < sources-patches/tree-view-rher-simple
#fi

#if [ ! -e sources/tree-view-dumb ]; then
#	cp -r sources/tree-view sources/tree-view-dumb
#	patch -d sources/tree-view-dumb -p2 < sources-patches/tree-view-dumb
#fi

#if [ ! -e sources/tree-view-memo ]; then
#	cp -r sources/tree-view sources/tree-view-memo
#	patch -d sources/tree-view-memo -p2 < sources-patches/tree-view-memo
#fi

#if [ ! -e sources/tree-view-rrh ]; then
#	cp -r sources/tree-view sources/tree-view-rrh
#	patch -d sources/tree-view-rrh -p2 < sources-patches/tree-view-rrh
#fi

if [ ! -e sources/deeptree-rher ]; then
	cp -r sources/deeptree sources/deeptree-rher
	patch -d sources/deeptree-rher -p2 < sources-patches/deeptree-rher
fi

if [ ! -e sources/twitter-lite-rher ]; then
	cp -r sources/twitter-lite sources/twitter-lite-rher
	patch -d sources/twitter-lite-rher -p2 < sources-patches/twitter-lite-rher
fi

if [ ! -e sources/stockticker-rher ]; then
	cp -r sources/stockticker sources/stockticker-rher
	patch -d sources/stockticker-rher -p2 < sources-patches/stockticker-rher
fi

if [ ! -e sources/forms-rher ]; then
	cp -r sources/forms sources/forms-rher
	patch -d sources/forms-rher -p2 < sources-patches/forms-rher
fi

if [ ! -e sources/deeptree-nested-rher ]; then
	cp -r sources/deeptree-nested sources/deeptree-nested-rher
	patch -d sources/deeptree-nested-rher -p2 < sources-patches/deeptree-nested-rher
fi
