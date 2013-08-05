// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Bootstrap for the Google JS Library (Closure).
 *
 * In uncompiled mode base.js will write out Closure's deps file, unless the
 * global <code>CLOSURE_NO_DEPS</code> is set to true.  This allows projects to
 * include their own deps file(s) from different locations.
 *
 */


/**
 * @define {boolean} Overridden to true by the compiler when --closure_pass
 *     or --mark_as_compiled is specified.
 */
var COMPILED = false;


/**
 * Base namespace for the Closure library.  Checks to see goog is
 * already defined in the current scope before assigning to prevent
 * clobbering if base.js is loaded more than once.
 *
 * @const
 */
var goog = goog || {}; // Identifies this file as the Closure base.


/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
goog.global = this;


/**
 * @define {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production js_binary can be easily stripped
 * by specifying --define goog.DEBUG=false to the JSCompiler. For example, most
 * toString() methods should be declared inside an "if (goog.DEBUG)" conditional
 * because they are generally used for debugging purposes and it is difficult
 * for the JSCompiler to statically determine whether they are used.
 */
goog.DEBUG = true;


/**
 * @define {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define goog.LOCALE=<locale_name>" as JSCompiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he), see http://wiki/Main/IIISynonyms.
 */
goog.LOCALE = 'en';  // default to en


/**
 * Creates object stubs for a namespace.  The presence of one or more
 * goog.provide() calls indicate that the file defines the given
 * objects/namespaces.  Build tools also scan for provide/require statements
 * to discern dependencies, build dependency files (see deps.js), etc.
 * @see goog.require
 * @param {string} name Namespace provided by this file in the form
 *     "goog.package.part".
 */
goog.provide = function(name) {
  if (!COMPILED) {
    // Ensure that the same namespace isn't provided twice. This is intended
    // to teach new developers that 'goog.provide' is effectively a variable
    // declaration. And when JSCompiler transforms goog.provide into a real
    // variable declaration, the compiled JS should work the same as the raw
    // JS--even when the raw JS uses goog.provide incorrectly.
    if (goog.isProvided_(name)) {
      throw Error('Namespace "' + name + '" already declared.');
    }
    delete goog.implicitNamespaces_[name];

    var namespace = name;
    while ((namespace = namespace.substring(0, namespace.lastIndexOf('.')))) {
      if (goog.getObjectByName(namespace)) {
        break;
      }
      goog.implicitNamespaces_[namespace] = true;
    }
  }

  goog.exportPath_(name);
};


/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
goog.setTestOnly = function(opt_message) {
  if (COMPILED && !goog.DEBUG) {
    opt_message = opt_message || '';
    throw Error('Importing test-only code into non-debug environment' +
                opt_message ? ': ' + opt_message : '.');
  }
};


if (!COMPILED) {

  /**
   * Check if the given name has been goog.provided. This will return false for
   * names that are available only as implicit namespaces.
   * @param {string} name name of the object to look for.
   * @return {boolean} Whether the name has been provided.
   * @private
   */
  goog.isProvided_ = function(name) {
    return !goog.implicitNamespaces_[name] && !!goog.getObjectByName(name);
  };

  /**
   * Namespaces implicitly defined by goog.provide. For example,
   * goog.provide('goog.events.Event') implicitly declares
   * that 'goog' and 'goog.events' must be namespaces.
   *
   * @type {Object}
   * @private
   */
  goog.implicitNamespaces_ = {};
}


/**
 * Builds an object structure for the provided namespace path,
 * ensuring that names that already exist are not overwritten. For
 * example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by goog.provide and goog.exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 * @private
 */
goog.exportPath_ = function(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || goog.global;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  // Certain browsers cannot parse code in the form for((a in b); c;);
  // This pattern is produced by the JSCompiler when it collapses the
  // statement above into the conditional loop below. To prevent this from
  // happening, use a for-loop and reserve the init logic as below.

  // Parentheses added to eliminate strict JS warning in Firefox.
  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && goog.isDef(opt_object)) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};


/**
 * Returns an object based on its fully qualified external name.  If you are
 * using a compilation pass that renames property names beware that using this
 * function will not find renamed properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |goog.global|.
 * @return {?} The value (object or primitive) or, if not found, null.
 */
goog.getObjectByName = function(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || goog.global;
  for (var part; part = parts.shift(); ) {
    if (goog.isDefAndNotNull(cur[part])) {
      cur = cur[part];
    } else {
      return null;
    }
  }
  return cur;
};


/**
 * Globalizes a whole namespace, such as goog or goog.lang.
 *
 * @param {Object} obj The namespace to globalize.
 * @param {Object=} opt_global The object to add the properties to.
 * @deprecated Properties may be explicitly exported to the global scope, but
 *     this should no longer be done in bulk.
 */
goog.globalize = function(obj, opt_global) {
  var global = opt_global || goog.global;
  for (var x in obj) {
    global[x] = obj[x];
  }
};


/**
 * Adds a dependency from a file to the files it requires.
 * @param {string} relPath The path to the js file.
 * @param {Array} provides An array of strings with the names of the objects
 *                         this file provides.
 * @param {Array} requires An array of strings with the names of the objects
 *                         this file requires.
 */
goog.addDependency = function(relPath, provides, requires) {
  if (!COMPILED) {
    var provide, require;
    var path = relPath.replace(/\\/g, '/');
    var deps = goog.dependencies_;
    for (var i = 0; provide = provides[i]; i++) {
      deps.nameToPath[provide] = path;
      if (!(path in deps.pathToNames)) {
        deps.pathToNames[path] = {};
      }
      deps.pathToNames[path][provide] = true;
    }
    for (var j = 0; require = requires[j]; j++) {
      if (!(path in deps.requires)) {
        deps.requires[path] = {};
      }
      deps.requires[path][require] = true;
    }
  }
};




// NOTE(nnaze): The debug DOM loader was included in base.js as an orignal
// way to do "debug-mode" development.  The dependency system can sometimes
// be confusing, as can the debug DOM loader's asyncronous nature.
//
// With the DOM loader, a call to goog.require() is not blocking -- the
// script will not load until some point after the current script.  If a
// namespace is needed at runtime, it needs to be defined in a previous
// script, or loaded via require() with its registered dependencies.
// User-defined namespaces may need their own deps file.  See http://go/js_deps,
// http://go/genjsdeps, or, externally, DepsWriter.
// http://code.google.com/closure/library/docs/depswriter.html
//
// Because of legacy clients, the DOM loader can't be easily removed from
// base.js.  Work is being done to make it disableable or replaceable for
// different environments (DOM-less JavaScript interpreters like Rhino or V8,
// for example). See bootstrap/ for more information.


/**
 * @define {boolean} Whether to enable the debug loader.
 *
 * If enabled, a call to goog.require() will attempt to load the namespace by
 * appending a script tag to the DOM (if the namespace has been registered).
 *
 * If disabled, goog.require() will simply assert that the namespace has been
 * provided (and depend on the fact that some outside tool correctly ordered
 * the script).
 */
goog.ENABLE_DEBUG_LOADER = true;


/**
 * Implements a system for the dynamic resolution of dependencies
 * that works in parallel with the BUILD system. Note that all calls
 * to goog.require will be stripped by the JSCompiler when the
 * --closure_pass option is used.
 * @see goog.provide
 * @param {string} name Namespace to include (as was given in goog.provide())
 *     in the form "goog.package.part".
 */
goog.require = function(name) {

  // if the object already exists we do not need do do anything
  // TODO(arv): If we start to support require based on file name this has
  //            to change
  // TODO(arv): If we allow goog.foo.* this has to change
  // TODO(arv): If we implement dynamic load after page load we should probably
  //            not remove this code for the compiled output
  if (!COMPILED) {
    if (goog.isProvided_(name)) {
      return;
    }

    if (goog.ENABLE_DEBUG_LOADER) {
      var path = goog.getPathFromDeps_(name);
      if (path) {
        goog.included_[path] = true;
        goog.writeScripts_();
        return;
      }
    }

    var errorMessage = 'goog.require could not find: ' + name;
    if (goog.global.console) {
      goog.global.console['error'](errorMessage);
    }


      throw Error(errorMessage);

  }
};


/**
 * Path for included scripts
 * @type {string}
 */
goog.basePath = '';


/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */
goog.global.CLOSURE_BASE_PATH;


/**
 * Whether to write out Closure's deps file. By default,
 * the deps are written.
 * @type {boolean|undefined}
 */
goog.global.CLOSURE_NO_DEPS;


/**
 * A function to import a single script. This is meant to be overridden when
 * Closure is being run in non-HTML contexts, such as web workers. It's defined
 * in the global scope so that it can be set before base.js is loaded, which
 * allows deps.js to be imported properly.
 *
 * The function is passed the script source, which is a relative URI. It should
 * return true if the script was imported, false otherwise.
 */
goog.global.CLOSURE_IMPORT_SCRIPT;


/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */
goog.nullFunction = function() {};


/**
 * The identity function. Returns its first argument.
 *
 * @param {*=} opt_returnValue The single value that will be returned.
 * @param {...*} var_args Optional trailing arguments. These are ignored.
 * @return {?} The first argument. We can't know the type -- just pass it along
 *      without type.
 * @deprecated Use goog.functions.identity instead.
 */
goog.identityFunction = function(opt_returnValue, var_args) {
  return opt_returnValue;
};


/**
 * When defining a class Foo with an abstract method bar(), you can do:
 *
 * Foo.prototype.bar = goog.abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error
 * will be thrown when bar() is invoked.
 *
 * Note: This does not take the name of the function to override as
 * an argument because that would make it more difficult to obfuscate
 * our JavaScript code.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be
 *   overridden.
 */
goog.abstractMethod = function() {
  throw Error('unimplemented abstract method');
};


/**
 * Adds a {@code getInstance} static method that always return the same instance
 * object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 */
goog.addSingletonGetter = function(ctor) {
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (goog.DEBUG) {
      // NOTE: JSCompiler can't optimize away Array#push.
      goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = ctor;
    }
    return ctor.instance_ = new ctor;
  };
};


/**
 * All singleton classes that have been instantiated, for testing. Don't read
 * it directly, use the {@code goog.testing.singleton} module. The compiler
 * removes this variable if unused.
 * @type {!Array.<!Function>}
 * @private
 */
goog.instantiatedSingletons_ = [];


if (!COMPILED && goog.ENABLE_DEBUG_LOADER) {
  /**
   * Object used to keep track of urls that have already been added. This
   * record allows the prevention of circular dependencies.
   * @type {Object}
   * @private
   */
  goog.included_ = {};


  /**
   * This object is used to keep track of dependencies and other data that is
   * used for loading scripts
   * @private
   * @type {Object}
   */
  goog.dependencies_ = {
    pathToNames: {}, // 1 to many
    nameToPath: {}, // 1 to 1
    requires: {}, // 1 to many
    // used when resolving dependencies to prevent us from
    // visiting the file twice
    visited: {},
    written: {} // used to keep track of script files we have written
  };


  /**
   * Tries to detect whether is in the context of an HTML document.
   * @return {boolean} True if it looks like HTML document.
   * @private
   */
  goog.inHtmlDocument_ = function() {
    var doc = goog.global.document;
    return typeof doc != 'undefined' &&
           'write' in doc;  // XULDocument misses write.
  };


  /**
   * Tries to detect the base path of the base.js script that bootstraps Closure
   * @private
   */
  goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) {
      goog.basePath = goog.global.CLOSURE_BASE_PATH;
      return;
    } else if (!goog.inHtmlDocument_()) {
      return;
    }
    var doc = goog.global.document;
    var scripts = doc.getElementsByTagName('script');
    // Search backwards since the current script is in almost all cases the one
    // that has base.js.
    for (var i = scripts.length - 1; i >= 0; --i) {
      var src = scripts[i].src;
      var qmark = src.lastIndexOf('?');
      var l = qmark == -1 ? src.length : qmark;
      if (src.substr(l - 7, 7) == 'base.js') {
        goog.basePath = src.substr(0, l - 7);
        return;
      }
    }
  };


  /**
   * Imports a script if, and only if, that script hasn't already been imported.
   * (Must be called at execution time)
   * @param {string} src Script source.
   * @private
   */
  goog.importScript_ = function(src) {
    var importScript = goog.global.CLOSURE_IMPORT_SCRIPT ||
        goog.writeScriptTag_;
    if (!goog.dependencies_.written[src] && importScript(src)) {
      goog.dependencies_.written[src] = true;
    }
  };


  /**
   * The default implementation of the import function. Writes a script tag to
   * import the script.
   *
   * @param {string} src The script source.
   * @return {boolean} True if the script was imported, false otherwise.
   * @private
   */
  goog.writeScriptTag_ = function(src) {
    if (goog.inHtmlDocument_()) {
      var doc = goog.global.document;
      doc.write(
          '<script type="text/javascript" src="' + src + '"></' + 'script>');
      return true;
    } else {
      return false;
    }
  };


  /**
   * Resolves dependencies based on the dependencies added using addDependency
   * and calls importScript_ in the correct order.
   * @private
   */
  goog.writeScripts_ = function() {
    // the scripts we need to write this time
    var scripts = [];
    var seenScript = {};
    var deps = goog.dependencies_;

    function visitNode(path) {
      if (path in deps.written) {
        return;
      }

      // we have already visited this one. We can get here if we have cyclic
      // dependencies
      if (path in deps.visited) {
        if (!(path in seenScript)) {
          seenScript[path] = true;
          scripts.push(path);
        }
        return;
      }

      deps.visited[path] = true;

      if (path in deps.requires) {
        for (var requireName in deps.requires[path]) {
          // If the required name is defined, we assume that it was already
          // bootstrapped by other means.
          if (!goog.isProvided_(requireName)) {
            if (requireName in deps.nameToPath) {
              visitNode(deps.nameToPath[requireName]);
            } else {
              throw Error('Undefined nameToPath for ' + requireName);
            }
          }
        }
      }

      if (!(path in seenScript)) {
        seenScript[path] = true;
        scripts.push(path);
      }
    }

    for (var path in goog.included_) {
      if (!deps.written[path]) {
        visitNode(path);
      }
    }

    for (var i = 0; i < scripts.length; i++) {
      if (scripts[i]) {
        goog.importScript_(goog.basePath + scripts[i]);
      } else {
        throw Error('Undefined script input');
      }
    }
  };


  /**
   * Looks at the dependency rules and tries to determine the script file that
   * fulfills a particular rule.
   * @param {string} rule In the form goog.namespace.Class or project.script.
   * @return {?string} Url corresponding to the rule, or null.
   * @private
   */
  goog.getPathFromDeps_ = function(rule) {
    if (rule in goog.dependencies_.nameToPath) {
      return goog.dependencies_.nameToPath[rule];
    } else {
      return null;
    }
  };

  goog.findBasePath_();

  // Allow projects to manage the deps files themselves.
 /* if (!goog.global.CLOSURE_NO_DEPS) {
    goog.importScript_(goog.basePath + 'deps.js');
  }*/
}



//==============================================================================
// Language Enhancements
//==============================================================================


/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {*} value The value to get the type of.
 * @return {string} The name of the type.
 */
goog.typeOf = function(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals tyepof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
          /** @type {Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use goog.isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case
           typeof value.length == 'number' &&
           typeof value.splice != 'undefined' &&
           typeof value.propertyIsEnumerable != 'undefined' &&
           !value.propertyIsEnumerable('splice')

          )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
          typeof value.call != 'undefined' &&
          typeof value.propertyIsEnumerable != 'undefined' &&
          !value.propertyIsEnumerable('call'))) {
        return 'function';
      }


    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox
    // typeof behaves similarly for HTML{Applet,Embed,Object}Elements
    // and RegExps.  We would like to return object for those and we can
    // detect an invalid function by making sure that the function
    // object has a call method.
    return 'object';
  }
  return s;
};


/**
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.  Additionally, this function assumes that the global
 * undefined variable has not been redefined.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
goog.isDef = function(val) {
  return val !== undefined;
};


/**
 * Returns true if the specified value is |null|
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
goog.isNull = function(val) {
  return val === null;
};


/**
 * Returns true if the specified value is defined and not null
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
goog.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
};


/**
 * Returns true if the specified value is an array
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArray = function(val) {
  return goog.typeOf(val) == 'array';
};


/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
goog.isArrayLike = function(val) {
  var type = goog.typeOf(val);
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};


/**
 * Returns true if the object looks like a Date. To qualify as Date-like
 * the value needs to be an object and have a getFullYear() function.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
goog.isDateLike = function(val) {
  return goog.isObject(val) && typeof val.getFullYear == 'function';
};


/**
 * Returns true if the specified value is a string
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
goog.isString = function(val) {
  return typeof val == 'string';
};


/**
 * Returns true if the specified value is a boolean
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
goog.isBoolean = function(val) {
  return typeof val == 'boolean';
};


/**
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
goog.isNumber = function(val) {
  return typeof val == 'number';
};


/**
 * Returns true if the specified value is a function
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
goog.isFunction = function(val) {
  return goog.typeOf(val) == 'function';
};


/**
 * Returns true if the specified value is an object.  This includes arrays
 * and functions.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
goog.isObject = function(val) {
  var type = typeof val;
  return type == 'object' && val != null || type == 'function';
  // return Object(val) === val also works, but is slower, especially if val is
  // not an object.
};


/**
 * Gets a unique ID for an object. This mutates the object so that further
 * calls with the same object as a parameter returns the same value. The unique
 * ID is guaranteed to be unique across the current session amongst objects that
 * are passed into {@code getUid}. There is no guarantee that the ID is unique
 * or consistent across sessions. It is unsafe to generate unique ID for
 * function prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
goog.getUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  return obj[goog.UID_PROPERTY_] ||
      (obj[goog.UID_PROPERTY_] = ++goog.uidCounter_);
};


/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using {@code goog.getUid} in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */
goog.removeUid = function(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // DOM nodes in IE are not instance of Object and throws exception
  // for delete. Instead we try to use removeAttribute
  if ('removeAttribute' in obj) {
    obj.removeAttribute(goog.UID_PROPERTY_);
  }
  /** @preserveTry */
  try {
    delete obj[goog.UID_PROPERTY_];
  } catch (ex) {
  }
};


/**
 * Name for unique ID property. Initialized in a way to help avoid collisions
 * with other closure javascript on the same page.
 * @type {string}
 * @private
 */
goog.UID_PROPERTY_ = 'closure_uid_' +
    Math.floor(Math.random() * 2147483648).toString(36);


/**
 * Counter for UID.
 * @type {number}
 * @private
 */
goog.uidCounter_ = 0;


/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for.
 * @return {number} The hash code for the object.
 * @deprecated Use goog.getUid instead.
 */
goog.getHashCode = goog.getUid;


/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 * @deprecated Use goog.removeUid instead.
 */
goog.removeHashCode = goog.removeUid;


/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>goog.cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>goog.cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated goog.cloneObject is unsafe. Prefer the goog.object methods.
 */
goog.cloneObject = function(obj) {
  var type = goog.typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (obj.clone) {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = goog.cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};


/**
 * A native implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 * @suppress {deprecated} The compiler thinks that Function.prototype.bind
 *     is deprecated because some people have declared a pure-JS version.
 *     Only the pure-JS version is truly deprecated.
 */
goog.bindNative_ = function(fn, selfObj, var_args) {
  return /** @type {!Function} */ (fn.call.apply(fn.bind, arguments));
};


/**
 * A pure-JS implementation of goog.bind.
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @private
 */
goog.bindJs_ = function(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };

  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};


/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of |this| 'pre-specified'.<br><br>
 *
 * Remaining arguments specified at call-time are appended to the pre-
 * specified ones.<br><br>
 *
 * Also see: {@link #partial}.<br><br>
 *
 * Usage:
 * <pre>var barMethBound = bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {Function} fn A function to partially apply.
 * @param {Object|undefined} selfObj Specifies the object which |this| should
 *     point to when the function is run.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to the function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @suppress {deprecated} See above.
 */
goog.bind = function(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default
      // Chrome extension environment. This means that for Chrome extensions,
      // they get the implementation of Function.prototype.bind that
      // calls goog.bind instead of the native one. Even worse, we don't want
      // to introduce a circular dependency between goog.bind and
      // Function.prototype.bind, so we have to hack this to make sure it
      // works correctly.
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    goog.bind = goog.bindNative_;
  } else {
    goog.bind = goog.bindJs_;
  }
  return goog.bind.apply(null, arguments);
};


/**
 * Like bind(), except that a 'this object' is not required. Useful when the
 * target function is already bound.
 *
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially
 *     applied to fn.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 */
goog.partial = function(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Prepend the bound arguments to the current arguments.
    var newArgs = Array.prototype.slice.call(arguments);
    newArgs.unshift.apply(newArgs, args);
    return fn.apply(this, newArgs);
  };
};


/**
 * Copies all the members of a source object to a target object. This method
 * does not work on all browsers for all objects that contain keys such as
 * toString or hasOwnProperty. Use goog.object.extend for this purpose.
 * @param {Object} target Target.
 * @param {Object} source Source.
 */
goog.mixin = function(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }

  // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
};


/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
goog.now = Date.now || (function() {
  // Unary plus operator converts its operand to a number which in the case of
  // a date is done by calling getTime().
  return +new Date();
});


/**
 * Evals javascript in the global scope.  In IE this uses execScript, other
 * browsers use goog.global.eval. If goog.global.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */
goog.globalEval = function(script) {
  if (goog.global.execScript) {
    goog.global.execScript(script, 'JavaScript');
  } else if (goog.global.eval) {
    // Test to see if eval works
    if (goog.evalWorksForGlobals_ == null) {
      goog.global.eval('var _et_ = 1;');
      if (typeof goog.global['_et_'] != 'undefined') {
        delete goog.global['_et_'];
        goog.evalWorksForGlobals_ = true;
      } else {
        goog.evalWorksForGlobals_ = false;
      }
    }

    if (goog.evalWorksForGlobals_) {
      goog.global.eval(script);
    } else {
      var doc = goog.global.document;
      var scriptElt = doc.createElement('script');
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.
      scriptElt.appendChild(doc.createTextNode(script));
      doc.body.appendChild(scriptElt);
      doc.body.removeChild(scriptElt);
    }
  } else {
    throw Error('goog.globalEval not available');
  }
};


/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to goog.globalEval (which
 * empirically tests whether eval works for globals). @see goog.globalEval
 * @type {?boolean}
 * @private
 */
goog.evalWorksForGlobals_ = null;


/**
 * Optional map of CSS class names to obfuscated names used with
 * goog.getCssName().
 * @type {Object|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMapping_;


/**
 * Optional obfuscation style for CSS class names. Should be set to either
 * 'BY_WHOLE' or 'BY_PART' if defined.
 * @type {string|undefined}
 * @private
 * @see goog.setCssNameMapping
 */
goog.cssNameMappingStyle_;


/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see goog.setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a
 * hyphen and passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which
 * these mappings are used. In the BY_PART style, each part (i.e. in
 * between hyphens) of the passed in css name is rewritten according
 * to the map. In the BY_WHOLE style, the full css name is looked up in
 * the map directly. If a rewrite is not specified by the map, the
 * compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls
 * to goog.getCssName with the strings from the mapping, e.g.
 *     var x = goog.getCssName('foo');
 *     var y = goog.getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x= 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed
 * only the modifier will be processed, as it is assumed the first
 * argument was generated as a result of calling goog.getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */
goog.getCssName = function(className, opt_modifier) {
  var getMapping = function(cssName) {
    return goog.cssNameMapping_[cssName] || cssName;
  };

  var renameByParts = function(cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
  };

  var rename;
  if (goog.cssNameMapping_) {
    rename = goog.cssNameMappingStyle_ == 'BY_WHOLE' ?
        getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }

  if (opt_modifier) {
    return className + '-' + rename(opt_modifier);
  } else {
    return rename(className);
  }
};


/**
 * Sets the map to check when returning a value from goog.getCssName(). Example:
 * <pre>
 * goog.setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = goog.getCssName('goog');
 * // The following evaluates to: "a a-b".
 * goog.getCssName('goog') + ' ' + goog.getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to goog.getCssName() using the supplied map if the
 * --closure_pass flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to goog.getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} opt_style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see goog.getCssName for a description.
 */
goog.setCssNameMapping = function(mapping, opt_style) {
  goog.cssNameMapping_ = mapping;
  goog.cssNameMappingStyle_ = opt_style;
};


/**
 * To use CSS renaming in compiled mode, one of the input files should have a
 * call to goog.setCssNameMapping() with an object literal that the JSCompiler
 * can extract and use to replace all calls to goog.getCssName(). In uncompiled
 * mode, JavaScript code should be loaded before this base.js file that declares
 * a global variable, CLOSURE_CSS_NAME_MAPPING, which is used below. This is
 * to ensure that the mapping is loaded before any calls to goog.getCssName()
 * are made in uncompiled mode.
 *
 * A hook for overriding the CSS name mapping.
 * @type {Object|undefined}
 */
goog.global.CLOSURE_CSS_NAME_MAPPING;


if (!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING) {
  // This does not call goog.setCssNameMapping() because the JSCompiler
  // requires that goog.setCssNameMapping() be called with an object literal.
  goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING;
}


/**
 * Abstract implementation of goog.getMsg for use with localized messages.
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object=} opt_values Map of place holder name to value.
 * @return {string} message with placeholders filled.
 */
goog.getMsg = function(str, opt_values) {
  var values = opt_values || {};
  for (var key in values) {
    var value = ('' + values[key]).replace(/\$/g, '$$$$');
    str = str.replace(new RegExp('\\{\\$' + key + '\\}', 'gi'), value);
  }
  return str;
};


/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated,
 * unless they are exported in turn via this function or
 * goog.exportProperty
 *
 * <p>Also handy for making public items that are defined in anonymous
 * closures.
 *
 * ex. goog.exportSymbol('public.path.Foo', Foo);
 *
 * ex. goog.exportSymbol('public.path.Foo.staticFunction',
 *                       Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. goog.exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is |goog.global|.
 */
goog.exportSymbol = function(publicPath, object, opt_objectToExportTo) {
  goog.exportPath_(publicPath, object, opt_objectToExportTo);
};


/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. goog.exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. goog.exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */
goog.exportProperty = function(object, publicName, symbol) {
  object[publicName] = symbol;
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { }
 *
 * function ChildClass(a, b, c) {
 *   goog.base(this, a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // works
 * </pre>
 *
 * In addition, a superclass' implementation of a method can be invoked
 * as follows:
 *
 * <pre>
 * ChildClass.prototype.foo = function(a) {
 *   ChildClass.superClass_.foo.call(this, a);
 *   // other code
 * };
 * </pre>
 *
 * @param {Function} childCtor Child class.
 * @param {Function} parentCtor Parent class.
 */
goog.inherits = function(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;
};


/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * contructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass
 * the name of the method as the second argument to this function. If
 * you do not, you will get a runtime error. This calls the superclass'
 * method with arguments 2-N.
 *
 * This function only works if you use goog.inherits to express
 * inheritance relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the
 * compiler will do macro expansion to remove a lot of
 * the extra overhead that this function introduces. The compiler
 * will also enforce a lot of the assumptions that this function
 * makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 */
goog.base = function(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;
  if (caller.superClass_) {
    // This is a constructor. Call the superclass constructor.
    return caller.superClass_.constructor.apply(
        me, Array.prototype.slice.call(arguments, 1));
  }

  var args = Array.prototype.slice.call(arguments, 2);
  var foundCaller = false;
  for (var ctor = me.constructor;
       ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
    if (ctor.prototype[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return ctor.prototype[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain,
  // then one of two things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw Error(
        'goog.base called from a method of one name ' +
        'to a method of a different name');
  }
};


/**
 * Allow for aliasing within scope functions.  This function exists for
 * uncompiled code - in compiled code the calls will be inlined and the
 * aliases applied.  In uncompiled code the function is simply run since the
 * aliases as written are valid JavaScript.
 * @param {function()} fn Function to call.  This function can contain aliases
 *     to namespaces (e.g. "var dom = goog.dom") or classes
 *    (e.g. "var Timer = goog.Timer").
 */
goog.scope = function(fn) {
  fn.call(goog.global);
};
/*! jQuery v1.7.1 jquery.com | jquery.org/license */
(function(a,b){function cy(a){return f.isWindow(a)?a:a.nodeType===9?a.defaultView||a.parentWindow:!1}function cv(a){if(!ck[a]){var b=c.body,d=f("<"+a+">").appendTo(b),e=d.css("display");d.remove();if(e==="none"||e===""){cl||(cl=c.createElement("iframe"),cl.frameBorder=cl.width=cl.height=0),b.appendChild(cl);if(!cm||!cl.createElement)cm=(cl.contentWindow||cl.contentDocument).document,cm.write((c.compatMode==="CSS1Compat"?"<!doctype html>":"")+"<html><body>"),cm.close();d=cm.createElement(a),cm.body.appendChild(d),e=f.css(d,"display"),b.removeChild(cl)}ck[a]=e}return ck[a]}function cu(a,b){var c={};f.each(cq.concat.apply([],cq.slice(0,b)),function(){c[this]=a});return c}function ct(){cr=b}function cs(){setTimeout(ct,0);return cr=f.now()}function cj(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}function ci(){try{return new a.XMLHttpRequest}catch(b){}}function cc(a,c){a.dataFilter&&(c=a.dataFilter(c,a.dataType));var d=a.dataTypes,e={},g,h,i=d.length,j,k=d[0],l,m,n,o,p;for(g=1;g<i;g++){if(g===1)for(h in a.converters)typeof h=="string"&&(e[h.toLowerCase()]=a.converters[h]);l=k,k=d[g];if(k==="*")k=l;else if(l!=="*"&&l!==k){m=l+" "+k,n=e[m]||e["* "+k];if(!n){p=b;for(o in e){j=o.split(" ");if(j[0]===l||j[0]==="*"){p=e[j[1]+" "+k];if(p){o=e[o],o===!0?n=p:p===!0&&(n=o);break}}}}!n&&!p&&f.error("No conversion from "+m.replace(" "," to ")),n!==!0&&(c=n?n(c):p(o(c)))}}return c}function cb(a,c,d){var e=a.contents,f=a.dataTypes,g=a.responseFields,h,i,j,k;for(i in g)i in d&&(c[g[i]]=d[i]);while(f[0]==="*")f.shift(),h===b&&(h=a.mimeType||c.getResponseHeader("content-type"));if(h)for(i in e)if(e[i]&&e[i].test(h)){f.unshift(i);break}if(f[0]in d)j=f[0];else{for(i in d){if(!f[0]||a.converters[i+" "+f[0]]){j=i;break}k||(k=i)}j=j||k}if(j){j!==f[0]&&f.unshift(j);return d[j]}}function ca(a,b,c,d){if(f.isArray(b))f.each(b,function(b,e){c||bE.test(a)?d(a,e):ca(a+"["+(typeof e=="object"||f.isArray(e)?b:"")+"]",e,c,d)});else if(!c&&b!=null&&typeof b=="object")for(var e in b)ca(a+"["+e+"]",b[e],c,d);else d(a,b)}function b_(a,c){var d,e,g=f.ajaxSettings.flatOptions||{};for(d in c)c[d]!==b&&((g[d]?a:e||(e={}))[d]=c[d]);e&&f.extend(!0,a,e)}function b$(a,c,d,e,f,g){f=f||c.dataTypes[0],g=g||{},g[f]=!0;var h=a[f],i=0,j=h?h.length:0,k=a===bT,l;for(;i<j&&(k||!l);i++)l=h[i](c,d,e),typeof l=="string"&&(!k||g[l]?l=b:(c.dataTypes.unshift(l),l=b$(a,c,d,e,l,g)));(k||!l)&&!g["*"]&&(l=b$(a,c,d,e,"*",g));return l}function bZ(a){return function(b,c){typeof b!="string"&&(c=b,b="*");if(f.isFunction(c)){var d=b.toLowerCase().split(bP),e=0,g=d.length,h,i,j;for(;e<g;e++)h=d[e],j=/^\+/.test(h),j&&(h=h.substr(1)||"*"),i=a[h]=a[h]||[],i[j?"unshift":"push"](c)}}}function bC(a,b,c){var d=b==="width"?a.offsetWidth:a.offsetHeight,e=b==="width"?bx:by,g=0,h=e.length;if(d>0){if(c!=="border")for(;g<h;g++)c||(d-=parseFloat(f.css(a,"padding"+e[g]))||0),c==="margin"?d+=parseFloat(f.css(a,c+e[g]))||0:d-=parseFloat(f.css(a,"border"+e[g]+"Width"))||0;return d+"px"}d=bz(a,b,b);if(d<0||d==null)d=a.style[b]||0;d=parseFloat(d)||0;if(c)for(;g<h;g++)d+=parseFloat(f.css(a,"padding"+e[g]))||0,c!=="padding"&&(d+=parseFloat(f.css(a,"border"+e[g]+"Width"))||0),c==="margin"&&(d+=parseFloat(f.css(a,c+e[g]))||0);return d+"px"}function bp(a,b){b.src?f.ajax({url:b.src,async:!1,dataType:"script"}):f.globalEval((b.text||b.textContent||b.innerHTML||"").replace(bf,"/*$0*/")),b.parentNode&&b.parentNode.removeChild(b)}function bo(a){var b=c.createElement("div");bh.appendChild(b),b.innerHTML=a.outerHTML;return b.firstChild}function bn(a){var b=(a.nodeName||"").toLowerCase();b==="input"?bm(a):b!=="script"&&typeof a.getElementsByTagName!="undefined"&&f.grep(a.getElementsByTagName("input"),bm)}function bm(a){if(a.type==="checkbox"||a.type==="radio")a.defaultChecked=a.checked}function bl(a){return typeof a.getElementsByTagName!="undefined"?a.getElementsByTagName("*"):typeof a.querySelectorAll!="undefined"?a.querySelectorAll("*"):[]}function bk(a,b){var c;if(b.nodeType===1){b.clearAttributes&&b.clearAttributes(),b.mergeAttributes&&b.mergeAttributes(a),c=b.nodeName.toLowerCase();if(c==="object")b.outerHTML=a.outerHTML;else if(c!=="input"||a.type!=="checkbox"&&a.type!=="radio"){if(c==="option")b.selected=a.defaultSelected;else if(c==="input"||c==="textarea")b.defaultValue=a.defaultValue}else a.checked&&(b.defaultChecked=b.checked=a.checked),b.value!==a.value&&(b.value=a.value);b.removeAttribute(f.expando)}}function bj(a,b){if(b.nodeType===1&&!!f.hasData(a)){var c,d,e,g=f._data(a),h=f._data(b,g),i=g.events;if(i){delete h.handle,h.events={};for(c in i)for(d=0,e=i[c].length;d<e;d++)f.event.add(b,c+(i[c][d].namespace?".":"")+i[c][d].namespace,i[c][d],i[c][d].data)}h.data&&(h.data=f.extend({},h.data))}}function bi(a,b){return f.nodeName(a,"table")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function U(a){var b=V.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}function T(a,b,c){b=b||0;if(f.isFunction(b))return f.grep(a,function(a,d){var e=!!b.call(a,d,a);return e===c});if(b.nodeType)return f.grep(a,function(a,d){return a===b===c});if(typeof b=="string"){var d=f.grep(a,function(a){return a.nodeType===1});if(O.test(b))return f.filter(b,d,!c);b=f.filter(b,d)}return f.grep(a,function(a,d){return f.inArray(a,b)>=0===c})}function S(a){return!a||!a.parentNode||a.parentNode.nodeType===11}function K(){return!0}function J(){return!1}function n(a,b,c){var d=b+"defer",e=b+"queue",g=b+"mark",h=f._data(a,d);h&&(c==="queue"||!f._data(a,e))&&(c==="mark"||!f._data(a,g))&&setTimeout(function(){!f._data(a,e)&&!f._data(a,g)&&(f.removeData(a,d,!0),h.fire())},0)}function m(a){for(var b in a){if(b==="data"&&f.isEmptyObject(a[b]))continue;if(b!=="toJSON")return!1}return!0}function l(a,c,d){if(d===b&&a.nodeType===1){var e="data-"+c.replace(k,"-$1").toLowerCase();d=a.getAttribute(e);if(typeof d=="string"){try{d=d==="true"?!0:d==="false"?!1:d==="null"?null:f.isNumeric(d)?parseFloat(d):j.test(d)?f.parseJSON(d):d}catch(g){}f.data(a,c,d)}else d=b}return d}function h(a){var b=g[a]={},c,d;a=a.split(/\s+/);for(c=0,d=a.length;c<d;c++)b[a[c]]=!0;return b}var c=a.document,d=a.navigator,e=a.location,f=function(){function J(){if(!e.isReady){try{c.documentElement.doScroll("left")}catch(a){setTimeout(J,1);return}e.ready()}}var e=function(a,b){return new e.fn.init(a,b,h)},f=a.jQuery,g=a.$,h,i=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,j=/\S/,k=/^\s+/,l=/\s+$/,m=/^<(\w+)\s*\/?>(?:<\/\1>)?$/,n=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,p=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,q=/(?:^|:|,)(?:\s*\[)+/g,r=/(webkit)[ \/]([\w.]+)/,s=/(opera)(?:.*version)?[ \/]([\w.]+)/,t=/(msie) ([\w.]+)/,u=/(mozilla)(?:.*? rv:([\w.]+))?/,v=/-([a-z]|[0-9])/ig,w=/^-ms-/,x=function(a,b){return(b+"").toUpperCase()},y=d.userAgent,z,A,B,C=Object.prototype.toString,D=Object.prototype.hasOwnProperty,E=Array.prototype.push,F=Array.prototype.slice,G=String.prototype.trim,H=Array.prototype.indexOf,I={};e.fn=e.prototype={constructor:e,init:function(a,d,f){var g,h,j,k;if(!a)return this;if(a.nodeType){this.context=this[0]=a,this.length=1;return this}if(a==="body"&&!d&&c.body){this.context=c,this[0]=c.body,this.selector=a,this.length=1;return this}if(typeof a=="string"){a.charAt(0)!=="<"||a.charAt(a.length-1)!==">"||a.length<3?g=i.exec(a):g=[null,a,null];if(g&&(g[1]||!d)){if(g[1]){d=d instanceof e?d[0]:d,k=d?d.ownerDocument||d:c,j=m.exec(a),j?e.isPlainObject(d)?(a=[c.createElement(j[1])],e.fn.attr.call(a,d,!0)):a=[k.createElement(j[1])]:(j=e.buildFragment([g[1]],[k]),a=(j.cacheable?e.clone(j.fragment):j.fragment).childNodes);return e.merge(this,a)}h=c.getElementById(g[2]);if(h&&h.parentNode){if(h.id!==g[2])return f.find(a);this.length=1,this[0]=h}this.context=c,this.selector=a;return this}return!d||d.jquery?(d||f).find(a):this.constructor(d).find(a)}if(e.isFunction(a))return f.ready(a);a.selector!==b&&(this.selector=a.selector,this.context=a.context);return e.makeArray(a,this)},selector:"",jquery:"1.7.1",length:0,size:function(){return this.length},toArray:function(){return F.call(this,0)},get:function(a){return a==null?this.toArray():a<0?this[this.length+a]:this[a]},pushStack:function(a,b,c){var d=this.constructor();e.isArray(a)?E.apply(d,a):e.merge(d,a),d.prevObject=this,d.context=this.context,b==="find"?d.selector=this.selector+(this.selector?" ":"")+c:b&&(d.selector=this.selector+"."+b+"("+c+")");return d},each:function(a,b){return e.each(this,a,b)},ready:function(a){e.bindReady(),A.add(a);return this},eq:function(a){a=+a;return a===-1?this.slice(a):this.slice(a,a+1)},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},slice:function(){return this.pushStack(F.apply(this,arguments),"slice",F.call(arguments).join(","))},map:function(a){return this.pushStack(e.map(this,function(b,c){return a.call(b,c,b)}))},end:function(){return this.prevObject||this.constructor(null)},push:E,sort:[].sort,splice:[].splice},e.fn.init.prototype=e.fn,e.extend=e.fn.extend=function(){var a,c,d,f,g,h,i=arguments[0]||{},j=1,k=arguments.length,l=!1;typeof i=="boolean"&&(l=i,i=arguments[1]||{},j=2),typeof i!="object"&&!e.isFunction(i)&&(i={}),k===j&&(i=this,--j);for(;j<k;j++)if((a=arguments[j])!=null)for(c in a){d=i[c],f=a[c];if(i===f)continue;l&&f&&(e.isPlainObject(f)||(g=e.isArray(f)))?(g?(g=!1,h=d&&e.isArray(d)?d:[]):h=d&&e.isPlainObject(d)?d:{},i[c]=e.extend(l,h,f)):f!==b&&(i[c]=f)}return i},e.extend({noConflict:function(b){a.$===e&&(a.$=g),b&&a.jQuery===e&&(a.jQuery=f);return e},isReady:!1,readyWait:1,holdReady:function(a){a?e.readyWait++:e.ready(!0)},ready:function(a){if(a===!0&&!--e.readyWait||a!==!0&&!e.isReady){if(!c.body)return setTimeout(e.ready,1);e.isReady=!0;if(a!==!0&&--e.readyWait>0)return;A.fireWith(c,[e]),e.fn.trigger&&e(c).trigger("ready").off("ready")}},bindReady:function(){if(!A){A=e.Callbacks("once memory");if(c.readyState==="complete")return setTimeout(e.ready,1);if(c.addEventListener)c.addEventListener("DOMContentLoaded",B,!1),a.addEventListener("load",e.ready,!1);else if(c.attachEvent){c.attachEvent("onreadystatechange",B),a.attachEvent("onload",e.ready);var b=!1;try{b=a.frameElement==null}catch(d){}c.documentElement.doScroll&&b&&J()}}},isFunction:function(a){return e.type(a)==="function"},isArray:Array.isArray||function(a){return e.type(a)==="array"},isWindow:function(a){return a&&typeof a=="object"&&"setInterval"in a},isNumeric:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},type:function(a){return a==null?String(a):I[C.call(a)]||"object"},isPlainObject:function(a){if(!a||e.type(a)!=="object"||a.nodeType||e.isWindow(a))return!1;try{if(a.constructor&&!D.call(a,"constructor")&&!D.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}var d;for(d in a);return d===b||D.call(a,d)},isEmptyObject:function(a){for(var b in a)return!1;return!0},error:function(a){throw new Error(a)},parseJSON:function(b){if(typeof b!="string"||!b)return null;b=e.trim(b);if(a.JSON&&a.JSON.parse)return a.JSON.parse(b);if(n.test(b.replace(o,"@").replace(p,"]").replace(q,"")))return(new Function("return "+b))();e.error("Invalid JSON: "+b)},parseXML:function(c){var d,f;try{a.DOMParser?(f=new DOMParser,d=f.parseFromString(c,"text/xml")):(d=new ActiveXObject("Microsoft.XMLDOM"),d.async="false",d.loadXML(c))}catch(g){d=b}(!d||!d.documentElement||d.getElementsByTagName("parsererror").length)&&e.error("Invalid XML: "+c);return d},noop:function(){},globalEval:function(b){b&&j.test(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(w,"ms-").replace(v,x)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toUpperCase()===b.toUpperCase()},each:function(a,c,d){var f,g=0,h=a.length,i=h===b||e.isFunction(a);if(d){if(i){for(f in a)if(c.apply(a[f],d)===!1)break}else for(;g<h;)if(c.apply(a[g++],d)===!1)break}else if(i){for(f in a)if(c.call(a[f],f,a[f])===!1)break}else for(;g<h;)if(c.call(a[g],g,a[g++])===!1)break;return a},trim:G?function(a){return a==null?"":G.call(a)}:function(a){return a==null?"":(a+"").replace(k,"").replace(l,"")},makeArray:function(a,b){var c=b||[];if(a!=null){var d=e.type(a);a.length==null||d==="string"||d==="function"||d==="regexp"||e.isWindow(a)?E.call(c,a):e.merge(c,a)}return c},inArray:function(a,b,c){var d;if(b){if(H)return H.call(b,a,c);d=b.length,c=c?c<0?Math.max(0,d+c):c:0;for(;c<d;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,c){var d=a.length,e=0;if(typeof c.length=="number")for(var f=c.length;e<f;e++)a[d++]=c[e];else while(c[e]!==b)a[d++]=c[e++];a.length=d;return a},grep:function(a,b,c){var d=[],e;c=!!c;for(var f=0,g=a.length;f<g;f++)e=!!b(a[f],f),c!==e&&d.push(a[f]);return d},map:function(a,c,d){var f,g,h=[],i=0,j=a.length,k=a instanceof e||j!==b&&typeof j=="number"&&(j>0&&a[0]&&a[j-1]||j===0||e.isArray(a));if(k)for(;i<j;i++)f=c(a[i],i,d),f!=null&&(h[h.length]=f);else for(g in a)f=c(a[g],g,d),f!=null&&(h[h.length]=f);return h.concat.apply([],h)},guid:1,proxy:function(a,c){if(typeof c=="string"){var d=a[c];c=a,a=d}if(!e.isFunction(a))return b;var f=F.call(arguments,2),g=function(){return a.apply(c,f.concat(F.call(arguments)))};g.guid=a.guid=a.guid||g.guid||e.guid++;return g},access:function(a,c,d,f,g,h){var i=a.length;if(typeof c=="object"){for(var j in c)e.access(a,j,c[j],f,g,d);return a}if(d!==b){f=!h&&f&&e.isFunction(d);for(var k=0;k<i;k++)g(a[k],c,f?d.call(a[k],k,g(a[k],c)):d,h);return a}return i?g(a[0],c):b},now:function(){return(new Date).getTime()},uaMatch:function(a){a=a.toLowerCase();var b=r.exec(a)||s.exec(a)||t.exec(a)||a.indexOf("compatible")<0&&u.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},sub:function(){function a(b,c){return new a.fn.init(b,c)}e.extend(!0,a,this),a.superclass=this,a.fn=a.prototype=this(),a.fn.constructor=a,a.sub=this.sub,a.fn.init=function(d,f){f&&f instanceof e&&!(f instanceof a)&&(f=a(f));return e.fn.init.call(this,d,f,b)},a.fn.init.prototype=a.fn;var b=a(c);return a},browser:{}}),e.each("Boolean Number String Function Array Date RegExp Object".split(" "),function(a,b){I["[object "+b+"]"]=b.toLowerCase()}),z=e.uaMatch(y),z.browser&&(e.browser[z.browser]=!0,e.browser.version=z.version),e.browser.webkit&&(e.browser.safari=!0),j.test(" ")&&(k=/^[\s\xA0]+/,l=/[\s\xA0]+$/),h=e(c),c.addEventListener?B=function(){c.removeEventListener("DOMContentLoaded",B,!1),e.ready()}:c.attachEvent&&(B=function(){c.readyState==="complete"&&(c.detachEvent("onreadystatechange",B),e.ready())});return e}(),g={};f.Callbacks=function(a){a=a?g[a]||h(a):{};var c=[],d=[],e,i,j,k,l,m=function(b){var d,e,g,h,i;for(d=0,e=b.length;d<e;d++)g=b[d],h=f.type(g),h==="array"?m(g):h==="function"&&(!a.unique||!o.has(g))&&c.push(g)},n=function(b,f){f=f||[],e=!a.memory||[b,f],i=!0,l=j||0,j=0,k=c.length;for(;c&&l<k;l++)if(c[l].apply(b,f)===!1&&a.stopOnFalse){e=!0;break}i=!1,c&&(a.once?e===!0?o.disable():c=[]:d&&d.length&&(e=d.shift(),o.fireWith(e[0],e[1])))},o={add:function(){if(c){var a=c.length;m(arguments),i?k=c.length:e&&e!==!0&&(j=a,n(e[0],e[1]))}return this},remove:function(){if(c){var b=arguments,d=0,e=b.length;for(;d<e;d++)for(var f=0;f<c.length;f++)if(b[d]===c[f]){i&&f<=k&&(k--,f<=l&&l--),c.splice(f--,1);if(a.unique)break}}return this},has:function(a){if(c){var b=0,d=c.length;for(;b<d;b++)if(a===c[b])return!0}return!1},empty:function(){c=[];return this},disable:function(){c=d=e=b;return this},disabled:function(){return!c},lock:function(){d=b,(!e||e===!0)&&o.disable();return this},locked:function(){return!d},fireWith:function(b,c){d&&(i?a.once||d.push([b,c]):(!a.once||!e)&&n(b,c));return this},fire:function(){o.fireWith(this,arguments);return this},fired:function(){return!!e}};return o};var i=[].slice;f.extend({Deferred:function(a){var b=f.Callbacks("once memory"),c=f.Callbacks("once memory"),d=f.Callbacks("memory"),e="pending",g={resolve:b,reject:c,notify:d},h={done:b.add,fail:c.add,progress:d.add,state:function(){return e},isResolved:b.fired,isRejected:c.fired,then:function(a,b,c){i.done(a).fail(b).progress(c);return this},always:function(){i.done.apply(i,arguments).fail.apply(i,arguments);return this},pipe:function(a,b,c){return f.Deferred(function(d){f.each({done:[a,"resolve"],fail:[b,"reject"],progress:[c,"notify"]},function(a,b){var c=b[0],e=b[1],g;f.isFunction(c)?i[a](function(){g=c.apply(this,arguments),g&&f.isFunction(g.promise)?g.promise().then(d.resolve,d.reject,d.notify):d[e+"With"](this===i?d:this,[g])}):i[a](d[e])})}).promise()},promise:function(a){if(a==null)a=h;else for(var b in h)a[b]=h[b];return a}},i=h.promise({}),j;for(j in g)i[j]=g[j].fire,i[j+"With"]=g[j].fireWith;i.done(function(){e="resolved"},c.disable,d.lock).fail(function(){e="rejected"},b.disable,d.lock),a&&a.call(i,i);return i},when:function(a){function m(a){return function(b){e[a]=arguments.length>1?i.call(arguments,0):b,j.notifyWith(k,e)}}function l(a){return function(c){b[a]=arguments.length>1?i.call(arguments,0):c,--g||j.resolveWith(j,b)}}var b=i.call(arguments,0),c=0,d=b.length,e=Array(d),g=d,h=d,j=d<=1&&a&&f.isFunction(a.promise)?a:f.Deferred(),k=j.promise();if(d>1){for(;c<d;c++)b[c]&&b[c].promise&&f.isFunction(b[c].promise)?b[c].promise().then(l(c),j.reject,m(c)):--g;g||j.resolveWith(j,b)}else j!==a&&j.resolveWith(j,d?[a]:[]);return k}}),f.support=function(){var b,d,e,g,h,i,j,k,l,m,n,o,p,q=c.createElement("div"),r=c.documentElement;q.setAttribute("className","t"),q.innerHTML="   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>",d=q.getElementsByTagName("*"),e=q.getElementsByTagName("a")[0];if(!d||!d.length||!e)return{};g=c.createElement("select"),h=g.appendChild(c.createElement("option")),i=q.getElementsByTagName("input")[0],b={leadingWhitespace:q.firstChild.nodeType===3,tbody:!q.getElementsByTagName("tbody").length,htmlSerialize:!!q.getElementsByTagName("link").length,style:/top/.test(e.getAttribute("style")),hrefNormalized:e.getAttribute("href")==="/a",opacity:/^0.55/.test(e.style.opacity),cssFloat:!!e.style.cssFloat,checkOn:i.value==="on",optSelected:h.selected,getSetAttribute:q.className!=="t",enctype:!!c.createElement("form").enctype,html5Clone:c.createElement("nav").cloneNode(!0).outerHTML!=="<:nav></:nav>",submitBubbles:!0,changeBubbles:!0,focusinBubbles:!1,deleteExpando:!0,noCloneEvent:!0,inlineBlockNeedsLayout:!1,shrinkWrapBlocks:!1,reliableMarginRight:!0},i.checked=!0,b.noCloneChecked=i.cloneNode(!0).checked,g.disabled=!0,b.optDisabled=!h.disabled;try{delete q.test}catch(s){b.deleteExpando=!1}!q.addEventListener&&q.attachEvent&&q.fireEvent&&(q.attachEvent("onclick",function(){b.noCloneEvent=!1}),q.cloneNode(!0).fireEvent("onclick")),i=c.createElement("input"),i.value="t",i.setAttribute("type","radio"),b.radioValue=i.value==="t",i.setAttribute("checked","checked"),q.appendChild(i),k=c.createDocumentFragment(),k.appendChild(q.lastChild),b.checkClone=k.cloneNode(!0).cloneNode(!0).lastChild.checked,b.appendChecked=i.checked,k.removeChild(i),k.appendChild(q),q.innerHTML="",a.getComputedStyle&&(j=c.createElement("div"),j.style.width="0",j.style.marginRight="0",q.style.width="2px",q.appendChild(j),b.reliableMarginRight=(parseInt((a.getComputedStyle(j,null)||{marginRight:0}).marginRight,10)||0)===0);if(q.attachEvent)for(o in{submit:1,change:1,focusin:1})n="on"+o,p=n in q,p||(q.setAttribute(n,"return;"),p=typeof q[n]=="function"),b[o+"Bubbles"]=p;k.removeChild(q),k=g=h=j=q=i=null,f(function(){var a,d,e,g,h,i,j,k,m,n,o,r=c.getElementsByTagName("body")[0];!r||(j=1,k="position:absolute;top:0;left:0;width:1px;height:1px;margin:0;",m="visibility:hidden;border:0;",n="style='"+k+"border:5px solid #000;padding:0;'",o="<div "+n+"><div></div></div>"+"<table "+n+" cellpadding='0' cellspacing='0'>"+"<tr><td></td></tr></table>",a=c.createElement("div"),a.style.cssText=m+"width:0;height:0;position:static;top:0;margin-top:"+j+"px",r.insertBefore(a,r.firstChild),q=c.createElement("div"),a.appendChild(q),q.innerHTML="<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>",l=q.getElementsByTagName("td"),p=l[0].offsetHeight===0,l[0].style.display="",l[1].style.display="none",b.reliableHiddenOffsets=p&&l[0].offsetHeight===0,q.innerHTML="",q.style.width=q.style.paddingLeft="1px",f.boxModel=b.boxModel=q.offsetWidth===2,typeof q.style.zoom!="undefined"&&(q.style.display="inline",q.style.zoom=1,b.inlineBlockNeedsLayout=q.offsetWidth===2,q.style.display="",q.innerHTML="<div style='width:4px;'></div>",b.shrinkWrapBlocks=q.offsetWidth!==2),q.style.cssText=k+m,q.innerHTML=o,d=q.firstChild,e=d.firstChild,h=d.nextSibling.firstChild.firstChild,i={doesNotAddBorder:e.offsetTop!==5,doesAddBorderForTableAndCells:h.offsetTop===5},e.style.position="fixed",e.style.top="20px",i.fixedPosition=e.offsetTop===20||e.offsetTop===15,e.style.position=e.style.top="",d.style.overflow="hidden",d.style.position="relative",i.subtractsBorderForOverflowNotVisible=e.offsetTop===-5,i.doesNotIncludeMarginInBodyOffset=r.offsetTop!==j,r.removeChild(a),q=a=null,f.extend(b,i))});return b}();var j=/^(?:\{.*\}|\[.*\])$/,k=/([A-Z])/g;f.extend({cache:{},uuid:0,expando:"jQuery"+(f.fn.jquery+Math.random()).replace(/\D/g,""),noData:{embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",applet:!0},hasData:function(a){a=a.nodeType?f.cache[a[f.expando]]:a[f.expando];return!!a&&!m(a)},data:function(a,c,d,e){if(!!f.acceptData(a)){var g,h,i,j=f.expando,k=typeof c=="string",l=a.nodeType,m=l?f.cache:a,n=l?a[j]:a[j]&&j,o=c==="events";if((!n||!m[n]||!o&&!e&&!m[n].data)&&k&&d===b)return;n||(l?a[j]=n=++f.uuid:n=j),m[n]||(m[n]={},l||(m[n].toJSON=f.noop));if(typeof c=="object"||typeof c=="function")e?m[n]=f.extend(m[n],c):m[n].data=f.extend(m[n].data,c);g=h=m[n],e||(h.data||(h.data={}),h=h.data),d!==b&&(h[f.camelCase(c)]=d);if(o&&!h[c])return g.events;k?(i=h[c],i==null&&(i=h[f.camelCase(c)])):i=h;return i}},removeData:function(a,b,c){if(!!f.acceptData(a)){var d,e,g,h=f.expando,i=a.nodeType,j=i?f.cache:a,k=i?a[h]:h;if(!j[k])return;if(b){d=c?j[k]:j[k].data;if(d){f.isArray(b)||(b in d?b=[b]:(b=f.camelCase(b),b in d?b=[b]:b=b.split(" ")));for(e=0,g=b.length;e<g;e++)delete d[b[e]];if(!(c?m:f.isEmptyObject)(d))return}}if(!c){delete j[k].data;if(!m(j[k]))return}f.support.deleteExpando||!j.setInterval?delete j[k]:j[k]=null,i&&(f.support.deleteExpando?delete a[h]:a.removeAttribute?a.removeAttribute(h):a[h]=null)}},_data:function(a,b,c){return f.data(a,b,c,!0)},acceptData:function(a){if(a.nodeName){var b=f.noData[a.nodeName.toLowerCase()];if(b)return b!==!0&&a.getAttribute("classid")===b}return!0}}),f.fn.extend({data:function(a,c){var d,e,g,h=null;if(typeof a=="undefined"){if(this.length){h=f.data(this[0]);if(this[0].nodeType===1&&!f._data(this[0],"parsedAttrs")){e=this[0].attributes;for(var i=0,j=e.length;i<j;i++)g=e[i].name,g.indexOf("data-")===0&&(g=f.camelCase(g.substring(5)),l(this[0],g,h[g]));f._data(this[0],"parsedAttrs",!0)}}return h}if(typeof a=="object")return this.each(function(){f.data(this,a)});d=a.split("."),d[1]=d[1]?"."+d[1]:"";if(c===b){h=this.triggerHandler("getData"+d[1]+"!",[d[0]]),h===b&&this.length&&(h=f.data(this[0],a),h=l(this[0],a,h));return h===b&&d[1]?this.data(d[0]):h}return this.each(function(){var b=f(this),e=[d[0],c];b.triggerHandler("setData"+d[1]+"!",e),f.data(this,a,c),b.triggerHandler("changeData"+d[1]+"!",e)})},removeData:function(a){return this.each(function(){f.removeData(this,a)})}}),f.extend({_mark:function(a,b){a&&(b=(b||"fx")+"mark",f._data(a,b,(f._data(a,b)||0)+1))},_unmark:function(a,b,c){a!==!0&&(c=b,b=a,a=!1);if(b){c=c||"fx";var d=c+"mark",e=a?0:(f._data(b,d)||1)-1;e?f._data(b,d,e):(f.removeData(b,d,!0),n(b,c,"mark"))}},queue:function(a,b,c){var d;if(a){b=(b||"fx")+"queue",d=f._data(a,b),c&&(!d||f.isArray(c)?d=f._data(a,b,f.makeArray(c)):d.push(c));return d||[]}},dequeue:function(a,b){b=b||"fx";var c=f.queue(a,b),d=c.shift(),e={};d==="inprogress"&&(d=c.shift()),d&&(b==="fx"&&c.unshift("inprogress"),f._data(a,b+".run",e),d.call(a,function(){f.dequeue(a,b)},e)),c.length||(f.removeData(a,b+"queue "+b+".run",!0),n(a,b,"queue"))}}),f.fn.extend({queue:function(a,c){typeof a!="string"&&(c=a,a="fx");if(c===b)return f.queue(this[0],a);return this.each(function(){var b=f.queue(this,a,c);a==="fx"&&b[0]!=="inprogress"&&f.dequeue(this,a)})},dequeue:function(a){return this.each(function(){f.dequeue(this,a)})},delay:function(a,b){a=f.fx?f.fx.speeds[a]||a:a,b=b||"fx";return this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,c){function m(){--h||d.resolveWith(e,[e])}typeof a!="string"&&(c=a,a=b),a=a||"fx";var d=f.Deferred(),e=this,g=e.length,h=1,i=a+"defer",j=a+"queue",k=a+"mark",l;while(g--)if(l=f.data(e[g],i,b,!0)||(f.data(e[g],j,b,!0)||f.data(e[g],k,b,!0))&&f.data(e[g],i,f.Callbacks("once memory"),!0))h++,l.add(m);m();return d.promise()}});var o=/[\n\t\r]/g,p=/\s+/,q=/\r/g,r=/^(?:button|input)$/i,s=/^(?:button|input|object|select|textarea)$/i,t=/^a(?:rea)?$/i,u=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,v=f.support.getSetAttribute,w,x,y;f.fn.extend({attr:function(a,b){return f.access(this,a,b,!0,f.attr)},removeAttr:function(a){return this.each(function(){f.removeAttr(this,a)})},prop:function(a,b){return f.access(this,a,b,!0,f.prop)},removeProp:function(a){a=f.propFix[a]||a;return this.each(function(){try{this[a]=b,delete this[a]}catch(c){}})},addClass:function(a){var b,c,d,e,g,h,i;if(f.isFunction(a))return this.each(function(b){f(this).addClass(a.call(this,b,this.className))});if(a&&typeof a=="string"){b=a.split(p);for(c=0,d=this.length;c<d;c++){e=this[c];if(e.nodeType===1)if(!e.className&&b.length===1)e.className=a;else{g=" "+e.className+" ";for(h=0,i=b.length;h<i;h++)~g.indexOf(" "+b[h]+" ")||(g+=b[h]+" ");e.className=f.trim(g)}}}return this},removeClass:function(a){var c,d,e,g,h,i,j;if(f.isFunction(a))return this.each(function(b){f(this).removeClass(a.call(this,b,this.className))});if(a&&typeof a=="string"||a===b){c=(a||"").split(p);for(d=0,e=this.length;d<e;d++){g=this[d];if(g.nodeType===1&&g.className)if(a){h=(" "+g.className+" ").replace(o," ");for(i=0,j=c.length;i<j;i++)h=h.replace(" "+c[i]+" "," ");g.className=f.trim(h)}else g.className=""}}return this},toggleClass:function(a,b){var c=typeof a,d=typeof b=="boolean";if(f.isFunction(a))return this.each(function(c){f(this).toggleClass(a.call(this,c,this.className,b),b)});return this.each(function(){if(c==="string"){var e,g=0,h=f(this),i=b,j=a.split(p);while(e=j[g++])i=d?i:!h.hasClass(e),h[i?"addClass":"removeClass"](e)}else if(c==="undefined"||c==="boolean")this.className&&f._data(this,"__className__",this.className),this.className=this.className||a===!1?"":f._data(this,"__className__")||""})},hasClass:function(a){var b=" "+a+" ",c=0,d=this.length;for(;c<d;c++)if(this[c].nodeType===1&&(" "+this[c].className+" ").replace(o," ").indexOf(b)>-1)return!0;return!1},val:function(a){var c,d,e,g=this[0];{if(!!arguments.length){e=f.isFunction(a);return this.each(function(d){var g=f(this),h;if(this.nodeType===1){e?h=a.call(this,d,g.val()):h=a,h==null?h="":typeof h=="number"?h+="":f.isArray(h)&&(h=f.map(h,function(a){return a==null?"":a+""})),c=f.valHooks[this.nodeName.toLowerCase()]||f.valHooks[this.type];if(!c||!("set"in c)||c.set(this,h,"value")===b)this.value=h}})}if(g){c=f.valHooks[g.nodeName.toLowerCase()]||f.valHooks[g.type];if(c&&"get"in c&&(d=c.get(g,"value"))!==b)return d;d=g.value;return typeof d=="string"?d.replace(q,""):d==null?"":d}}}}),f.extend({valHooks:{option:{get:function(a){var b=a.attributes.value;return!b||b.specified?a.value:a.text}},select:{get:function(a){var b,c,d,e,g=a.selectedIndex,h=[],i=a.options,j=a.type==="select-one";if(g<0)return null;c=j?g:0,d=j?g+1:i.length;for(;c<d;c++){e=i[c];if(e.selected&&(f.support.optDisabled?!e.disabled:e.getAttribute("disabled")===null)&&(!e.parentNode.disabled||!f.nodeName(e.parentNode,"optgroup"))){b=f(e).val();if(j)return b;h.push(b)}}if(j&&!h.length&&i.length)return f(i[g]).val();return h},set:function(a,b){var c=f.makeArray(b);f(a).find("option").each(function(){this.selected=f.inArray(f(this).val(),c)>=0}),c.length||(a.selectedIndex=-1);return c}}},attrFn:{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0},attr:function(a,c,d,e){var g,h,i,j=a.nodeType;if(!!a&&j!==3&&j!==8&&j!==2){if(e&&c in f.attrFn)return f(a)[c](d);if(typeof a.getAttribute=="undefined")return f.prop(a,c,d);i=j!==1||!f.isXMLDoc(a),i&&(c=c.toLowerCase(),h=f.attrHooks[c]||(u.test(c)?x:w));if(d!==b){if(d===null){f.removeAttr(a,c);return}if(h&&"set"in h&&i&&(g=h.set(a,d,c))!==b)return g;a.setAttribute(c,""+d);return d}if(h&&"get"in h&&i&&(g=h.get(a,c))!==null)return g;g=a.getAttribute(c);return g===null?b:g}},removeAttr:function(a,b){var c,d,e,g,h=0;if(b&&a.nodeType===1){d=b.toLowerCase().split(p),g=d.length;for(;h<g;h++)e=d[h],e&&(c=f.propFix[e]||e,f.attr(a,e,""),a.removeAttribute(v?e:c),u.test(e)&&c in a&&(a[c]=!1))}},attrHooks:{type:{set:function(a,b){if(r.test(a.nodeName)&&a.parentNode)f.error("type property can't be changed");else if(!f.support.radioValue&&b==="radio"&&f.nodeName(a,"input")){var c=a.value;a.setAttribute("type",b),c&&(a.value=c);return b}}},value:{get:function(a,b){if(w&&f.nodeName(a,"button"))return w.get(a,b);return b in a?a.value:null},set:function(a,b,c){if(w&&f.nodeName(a,"button"))return w.set(a,b,c);a.value=b}}},propFix:{tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},prop:function(a,c,d){var e,g,h,i=a.nodeType;if(!!a&&i!==3&&i!==8&&i!==2){h=i!==1||!f.isXMLDoc(a),h&&(c=f.propFix[c]||c,g=f.propHooks[c]);return d!==b?g&&"set"in g&&(e=g.set(a,d,c))!==b?e:a[c]=d:g&&"get"in g&&(e=g.get(a,c))!==null?e:a[c]}},propHooks:{tabIndex:{get:function(a){var c=a.getAttributeNode("tabindex");return c&&c.specified?parseInt(c.value,10):s.test(a.nodeName)||t.test(a.nodeName)&&a.href?0:b}}}}),f.attrHooks.tabindex=f.propHooks.tabIndex,x={get:function(a,c){var d,e=f.prop(a,c);return e===!0||typeof e!="boolean"&&(d=a.getAttributeNode(c))&&d.nodeValue!==!1?c.toLowerCase():b},set:function(a,b,c){var d;b===!1?f.removeAttr(a,c):(d=f.propFix[c]||c,d in a&&(a[d]=!0),a.setAttribute(c,c.toLowerCase()));return c}},v||(y={name:!0,id:!0},w=f.valHooks.button={get:function(a,c){var d;d=a.getAttributeNode(c);return d&&(y[c]?d.nodeValue!=="":d.specified)?d.nodeValue:b},set:function(a,b,d){var e=a.getAttributeNode(d);e||(e=c.createAttribute(d),a.setAttributeNode(e));return e.nodeValue=b+""}},f.attrHooks.tabindex.set=w.set,f.each(["width","height"],function(a,b){f.attrHooks[b]=f.extend(f.attrHooks[b],{set:function(a,c){if(c===""){a.setAttribute(b,"auto");return c}}})}),f.attrHooks.contenteditable={get:w.get,set:function(a,b,c){b===""&&(b="false"),w.set(a,b,c)}}),f.support.hrefNormalized||f.each(["href","src","width","height"],function(a,c){f.attrHooks[c]=f.extend(f.attrHooks[c],{get:function(a){var d=a.getAttribute(c,2);return d===null?b:d}})}),f.support.style||(f.attrHooks.style={get:function(a){return a.style.cssText.toLowerCase()||b},set:function(a,b){return a.style.cssText=""+b}}),f.support.optSelected||(f.propHooks.selected=f.extend(f.propHooks.selected,{get:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex);return null}})),f.support.enctype||(f.propFix.enctype="encoding"),f.support.checkOn||f.each(["radio","checkbox"],function(){f.valHooks[this]={get:function(a){return a.getAttribute("value")===null?"on":a.value}}}),f.each(["radio","checkbox"],function(){f.valHooks[this]=f.extend(f.valHooks[this],{set:function(a,b){if(f.isArray(b))return a.checked=f.inArray(f(a).val(),b)>=0}})});var z=/^(?:textarea|input|select)$/i,A=/^([^\.]*)?(?:\.(.+))?$/,B=/\bhover(\.\S+)?\b/,C=/^key/,D=/^(?:mouse|contextmenu)|click/,E=/^(?:focusinfocus|focusoutblur)$/,F=/^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,G=function(a){var b=F.exec(a);b&&(b[1]=(b[1]||"").toLowerCase(),b[3]=b[3]&&new RegExp("(?:^|\\s)"+b[3]+"(?:\\s|$)"));return b},H=function(a,b){var c=a.attributes||{};return(!b[1]||a.nodeName.toLowerCase()===b[1])&&(!b[2]||(c.id||{}).value===b[2])&&(!b[3]||b[3].test((c["class"]||{}).value))},I=function(a){return f.event.special.hover?a:a.replace(B,"mouseenter$1 mouseleave$1")};
f.event={add:function(a,c,d,e,g){var h,i,j,k,l,m,n,o,p,q,r,s;if(!(a.nodeType===3||a.nodeType===8||!c||!d||!(h=f._data(a)))){d.handler&&(p=d,d=p.handler),d.guid||(d.guid=f.guid++),j=h.events,j||(h.events=j={}),i=h.handle,i||(h.handle=i=function(a){return typeof f!="undefined"&&(!a||f.event.triggered!==a.type)?f.event.dispatch.apply(i.elem,arguments):b},i.elem=a),c=f.trim(I(c)).split(" ");for(k=0;k<c.length;k++){l=A.exec(c[k])||[],m=l[1],n=(l[2]||"").split(".").sort(),s=f.event.special[m]||{},m=(g?s.delegateType:s.bindType)||m,s=f.event.special[m]||{},o=f.extend({type:m,origType:l[1],data:e,handler:d,guid:d.guid,selector:g,quick:G(g),namespace:n.join(".")},p),r=j[m];if(!r){r=j[m]=[],r.delegateCount=0;if(!s.setup||s.setup.call(a,e,n,i)===!1)a.addEventListener?a.addEventListener(m,i,!1):a.attachEvent&&a.attachEvent("on"+m,i)}s.add&&(s.add.call(a,o),o.handler.guid||(o.handler.guid=d.guid)),g?r.splice(r.delegateCount++,0,o):r.push(o),f.event.global[m]=!0}a=null}},global:{},remove:function(a,b,c,d,e){var g=f.hasData(a)&&f._data(a),h,i,j,k,l,m,n,o,p,q,r,s;if(!!g&&!!(o=g.events)){b=f.trim(I(b||"")).split(" ");for(h=0;h<b.length;h++){i=A.exec(b[h])||[],j=k=i[1],l=i[2];if(!j){for(j in o)f.event.remove(a,j+b[h],c,d,!0);continue}p=f.event.special[j]||{},j=(d?p.delegateType:p.bindType)||j,r=o[j]||[],m=r.length,l=l?new RegExp("(^|\\.)"+l.split(".").sort().join("\\.(?:.*\\.)?")+"(\\.|$)"):null;for(n=0;n<r.length;n++)s=r[n],(e||k===s.origType)&&(!c||c.guid===s.guid)&&(!l||l.test(s.namespace))&&(!d||d===s.selector||d==="**"&&s.selector)&&(r.splice(n--,1),s.selector&&r.delegateCount--,p.remove&&p.remove.call(a,s));r.length===0&&m!==r.length&&((!p.teardown||p.teardown.call(a,l)===!1)&&f.removeEvent(a,j,g.handle),delete o[j])}f.isEmptyObject(o)&&(q=g.handle,q&&(q.elem=null),f.removeData(a,["events","handle"],!0))}},customEvent:{getData:!0,setData:!0,changeData:!0},trigger:function(c,d,e,g){if(!e||e.nodeType!==3&&e.nodeType!==8){var h=c.type||c,i=[],j,k,l,m,n,o,p,q,r,s;if(E.test(h+f.event.triggered))return;h.indexOf("!")>=0&&(h=h.slice(0,-1),k=!0),h.indexOf(".")>=0&&(i=h.split("."),h=i.shift(),i.sort());if((!e||f.event.customEvent[h])&&!f.event.global[h])return;c=typeof c=="object"?c[f.expando]?c:new f.Event(h,c):new f.Event(h),c.type=h,c.isTrigger=!0,c.exclusive=k,c.namespace=i.join("."),c.namespace_re=c.namespace?new RegExp("(^|\\.)"+i.join("\\.(?:.*\\.)?")+"(\\.|$)"):null,o=h.indexOf(":")<0?"on"+h:"";if(!e){j=f.cache;for(l in j)j[l].events&&j[l].events[h]&&f.event.trigger(c,d,j[l].handle.elem,!0);return}c.result=b,c.target||(c.target=e),d=d!=null?f.makeArray(d):[],d.unshift(c),p=f.event.special[h]||{};if(p.trigger&&p.trigger.apply(e,d)===!1)return;r=[[e,p.bindType||h]];if(!g&&!p.noBubble&&!f.isWindow(e)){s=p.delegateType||h,m=E.test(s+h)?e:e.parentNode,n=null;for(;m;m=m.parentNode)r.push([m,s]),n=m;n&&n===e.ownerDocument&&r.push([n.defaultView||n.parentWindow||a,s])}for(l=0;l<r.length&&!c.isPropagationStopped();l++)m=r[l][0],c.type=r[l][1],q=(f._data(m,"events")||{})[c.type]&&f._data(m,"handle"),q&&q.apply(m,d),q=o&&m[o],q&&f.acceptData(m)&&q.apply(m,d)===!1&&c.preventDefault();c.type=h,!g&&!c.isDefaultPrevented()&&(!p._default||p._default.apply(e.ownerDocument,d)===!1)&&(h!=="click"||!f.nodeName(e,"a"))&&f.acceptData(e)&&o&&e[h]&&(h!=="focus"&&h!=="blur"||c.target.offsetWidth!==0)&&!f.isWindow(e)&&(n=e[o],n&&(e[o]=null),f.event.triggered=h,e[h](),f.event.triggered=b,n&&(e[o]=n));return c.result}},dispatch:function(c){c=f.event.fix(c||a.event);var d=(f._data(this,"events")||{})[c.type]||[],e=d.delegateCount,g=[].slice.call(arguments,0),h=!c.exclusive&&!c.namespace,i=[],j,k,l,m,n,o,p,q,r,s,t;g[0]=c,c.delegateTarget=this;if(e&&!c.target.disabled&&(!c.button||c.type!=="click")){m=f(this),m.context=this.ownerDocument||this;for(l=c.target;l!=this;l=l.parentNode||this){o={},q=[],m[0]=l;for(j=0;j<e;j++)r=d[j],s=r.selector,o[s]===b&&(o[s]=r.quick?H(l,r.quick):m.is(s)),o[s]&&q.push(r);q.length&&i.push({elem:l,matches:q})}}d.length>e&&i.push({elem:this,matches:d.slice(e)});for(j=0;j<i.length&&!c.isPropagationStopped();j++){p=i[j],c.currentTarget=p.elem;for(k=0;k<p.matches.length&&!c.isImmediatePropagationStopped();k++){r=p.matches[k];if(h||!c.namespace&&!r.namespace||c.namespace_re&&c.namespace_re.test(r.namespace))c.data=r.data,c.handleObj=r,n=((f.event.special[r.origType]||{}).handle||r.handler).apply(p.elem,g),n!==b&&(c.result=n,n===!1&&(c.preventDefault(),c.stopPropagation()))}}return c.result},props:"attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){a.which==null&&(a.which=b.charCode!=null?b.charCode:b.keyCode);return a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,d){var e,f,g,h=d.button,i=d.fromElement;a.pageX==null&&d.clientX!=null&&(e=a.target.ownerDocument||c,f=e.documentElement,g=e.body,a.pageX=d.clientX+(f&&f.scrollLeft||g&&g.scrollLeft||0)-(f&&f.clientLeft||g&&g.clientLeft||0),a.pageY=d.clientY+(f&&f.scrollTop||g&&g.scrollTop||0)-(f&&f.clientTop||g&&g.clientTop||0)),!a.relatedTarget&&i&&(a.relatedTarget=i===a.target?d.toElement:i),!a.which&&h!==b&&(a.which=h&1?1:h&2?3:h&4?2:0);return a}},fix:function(a){if(a[f.expando])return a;var d,e,g=a,h=f.event.fixHooks[a.type]||{},i=h.props?this.props.concat(h.props):this.props;a=f.Event(g);for(d=i.length;d;)e=i[--d],a[e]=g[e];a.target||(a.target=g.srcElement||c),a.target.nodeType===3&&(a.target=a.target.parentNode),a.metaKey===b&&(a.metaKey=a.ctrlKey);return h.filter?h.filter(a,g):a},special:{ready:{setup:f.bindReady},load:{noBubble:!0},focus:{delegateType:"focusin"},blur:{delegateType:"focusout"},beforeunload:{setup:function(a,b,c){f.isWindow(this)&&(this.onbeforeunload=c)},teardown:function(a,b){this.onbeforeunload===b&&(this.onbeforeunload=null)}}},simulate:function(a,b,c,d){var e=f.extend(new f.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?f.event.trigger(e,null,b):f.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},f.event.handle=f.event.dispatch,f.removeEvent=c.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){a.detachEvent&&a.detachEvent("on"+b,c)},f.Event=function(a,b){if(!(this instanceof f.Event))return new f.Event(a,b);a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault()?K:J):this.type=a,b&&f.extend(this,b),this.timeStamp=a&&a.timeStamp||f.now(),this[f.expando]=!0},f.Event.prototype={preventDefault:function(){this.isDefaultPrevented=K;var a=this.originalEvent;!a||(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){this.isPropagationStopped=K;var a=this.originalEvent;!a||(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=K,this.stopPropagation()},isDefaultPrevented:J,isPropagationStopped:J,isImmediatePropagationStopped:J},f.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){f.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c=this,d=a.relatedTarget,e=a.handleObj,g=e.selector,h;if(!d||d!==c&&!f.contains(c,d))a.type=e.origType,h=e.handler.apply(this,arguments),a.type=b;return h}}}),f.support.submitBubbles||(f.event.special.submit={setup:function(){if(f.nodeName(this,"form"))return!1;f.event.add(this,"click._submit keypress._submit",function(a){var c=a.target,d=f.nodeName(c,"input")||f.nodeName(c,"button")?c.form:b;d&&!d._submit_attached&&(f.event.add(d,"submit._submit",function(a){this.parentNode&&!a.isTrigger&&f.event.simulate("submit",this.parentNode,a,!0)}),d._submit_attached=!0)})},teardown:function(){if(f.nodeName(this,"form"))return!1;f.event.remove(this,"._submit")}}),f.support.changeBubbles||(f.event.special.change={setup:function(){if(z.test(this.nodeName)){if(this.type==="checkbox"||this.type==="radio")f.event.add(this,"propertychange._change",function(a){a.originalEvent.propertyName==="checked"&&(this._just_changed=!0)}),f.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1,f.event.simulate("change",this,a,!0))});return!1}f.event.add(this,"beforeactivate._change",function(a){var b=a.target;z.test(b.nodeName)&&!b._change_attached&&(f.event.add(b,"change._change",function(a){this.parentNode&&!a.isSimulated&&!a.isTrigger&&f.event.simulate("change",this.parentNode,a,!0)}),b._change_attached=!0)})},handle:function(a){var b=a.target;if(this!==b||a.isSimulated||a.isTrigger||b.type!=="radio"&&b.type!=="checkbox")return a.handleObj.handler.apply(this,arguments)},teardown:function(){f.event.remove(this,"._change");return z.test(this.nodeName)}}),f.support.focusinBubbles||f.each({focus:"focusin",blur:"focusout"},function(a,b){var d=0,e=function(a){f.event.simulate(b,a.target,f.event.fix(a),!0)};f.event.special[b]={setup:function(){d++===0&&c.addEventListener(a,e,!0)},teardown:function(){--d===0&&c.removeEventListener(a,e,!0)}}}),f.fn.extend({on:function(a,c,d,e,g){var h,i;if(typeof a=="object"){typeof c!="string"&&(d=c,c=b);for(i in a)this.on(i,c,d,a[i],g);return this}d==null&&e==null?(e=c,d=c=b):e==null&&(typeof c=="string"?(e=d,d=b):(e=d,d=c,c=b));if(e===!1)e=J;else if(!e)return this;g===1&&(h=e,e=function(a){f().off(a);return h.apply(this,arguments)},e.guid=h.guid||(h.guid=f.guid++));return this.each(function(){f.event.add(this,a,e,d,c)})},one:function(a,b,c,d){return this.on.call(this,a,b,c,d,1)},off:function(a,c,d){if(a&&a.preventDefault&&a.handleObj){var e=a.handleObj;f(a.delegateTarget).off(e.namespace?e.type+"."+e.namespace:e.type,e.selector,e.handler);return this}if(typeof a=="object"){for(var g in a)this.off(g,c,a[g]);return this}if(c===!1||typeof c=="function")d=c,c=b;d===!1&&(d=J);return this.each(function(){f.event.remove(this,a,d,c)})},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},live:function(a,b,c){f(this.context).on(a,this.selector,b,c);return this},die:function(a,b){f(this.context).off(a,this.selector||"**",b);return this},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return arguments.length==1?this.off(a,"**"):this.off(b,a,c)},trigger:function(a,b){return this.each(function(){f.event.trigger(a,b,this)})},triggerHandler:function(a,b){if(this[0])return f.event.trigger(a,b,this[0],!0)},toggle:function(a){var b=arguments,c=a.guid||f.guid++,d=0,e=function(c){var e=(f._data(this,"lastToggle"+a.guid)||0)%d;f._data(this,"lastToggle"+a.guid,e+1),c.preventDefault();return b[e].apply(this,arguments)||!1};e.guid=c;while(d<b.length)b[d++].guid=c;return this.click(e)},hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){f.fn[b]=function(a,c){c==null&&(c=a,a=null);return arguments.length>0?this.on(b,null,a,c):this.trigger(b)},f.attrFn&&(f.attrFn[b]=!0),C.test(b)&&(f.event.fixHooks[b]=f.event.keyHooks),D.test(b)&&(f.event.fixHooks[b]=f.event.mouseHooks)}),function(){function x(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}if(j.nodeType===1){g||(j[d]=c,j.sizset=h);if(typeof b!="string"){if(j===b){k=!0;break}}else if(m.filter(b,[j]).length>0){k=j;break}}j=j[a]}e[h]=k}}}function w(a,b,c,e,f,g){for(var h=0,i=e.length;h<i;h++){var j=e[h];if(j){var k=!1;j=j[a];while(j){if(j[d]===c){k=e[j.sizset];break}j.nodeType===1&&!g&&(j[d]=c,j.sizset=h);if(j.nodeName.toLowerCase()===b){k=j;break}j=j[a]}e[h]=k}}}var a=/((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,d="sizcache"+(Math.random()+"").replace(".",""),e=0,g=Object.prototype.toString,h=!1,i=!0,j=/\\/g,k=/\r\n/g,l=/\W/;[0,0].sort(function(){i=!1;return 0});var m=function(b,d,e,f){e=e||[],d=d||c;var h=d;if(d.nodeType!==1&&d.nodeType!==9)return[];if(!b||typeof b!="string")return e;var i,j,k,l,n,q,r,t,u=!0,v=m.isXML(d),w=[],x=b;do{a.exec(""),i=a.exec(x);if(i){x=i[3],w.push(i[1]);if(i[2]){l=i[3];break}}}while(i);if(w.length>1&&p.exec(b))if(w.length===2&&o.relative[w[0]])j=y(w[0]+w[1],d,f);else{j=o.relative[w[0]]?[d]:m(w.shift(),d);while(w.length)b=w.shift(),o.relative[b]&&(b+=w.shift()),j=y(b,j,f)}else{!f&&w.length>1&&d.nodeType===9&&!v&&o.match.ID.test(w[0])&&!o.match.ID.test(w[w.length-1])&&(n=m.find(w.shift(),d,v),d=n.expr?m.filter(n.expr,n.set)[0]:n.set[0]);if(d){n=f?{expr:w.pop(),set:s(f)}:m.find(w.pop(),w.length===1&&(w[0]==="~"||w[0]==="+")&&d.parentNode?d.parentNode:d,v),j=n.expr?m.filter(n.expr,n.set):n.set,w.length>0?k=s(j):u=!1;while(w.length)q=w.pop(),r=q,o.relative[q]?r=w.pop():q="",r==null&&(r=d),o.relative[q](k,r,v)}else k=w=[]}k||(k=j),k||m.error(q||b);if(g.call(k)==="[object Array]")if(!u)e.push.apply(e,k);else if(d&&d.nodeType===1)for(t=0;k[t]!=null;t++)k[t]&&(k[t]===!0||k[t].nodeType===1&&m.contains(d,k[t]))&&e.push(j[t]);else for(t=0;k[t]!=null;t++)k[t]&&k[t].nodeType===1&&e.push(j[t]);else s(k,e);l&&(m(l,h,e,f),m.uniqueSort(e));return e};m.uniqueSort=function(a){if(u){h=i,a.sort(u);if(h)for(var b=1;b<a.length;b++)a[b]===a[b-1]&&a.splice(b--,1)}return a},m.matches=function(a,b){return m(a,null,null,b)},m.matchesSelector=function(a,b){return m(b,null,null,[a]).length>0},m.find=function(a,b,c){var d,e,f,g,h,i;if(!a)return[];for(e=0,f=o.order.length;e<f;e++){h=o.order[e];if(g=o.leftMatch[h].exec(a)){i=g[1],g.splice(1,1);if(i.substr(i.length-1)!=="\\"){g[1]=(g[1]||"").replace(j,""),d=o.find[h](g,b,c);if(d!=null){a=a.replace(o.match[h],"");break}}}}d||(d=typeof b.getElementsByTagName!="undefined"?b.getElementsByTagName("*"):[]);return{set:d,expr:a}},m.filter=function(a,c,d,e){var f,g,h,i,j,k,l,n,p,q=a,r=[],s=c,t=c&&c[0]&&m.isXML(c[0]);while(a&&c.length){for(h in o.filter)if((f=o.leftMatch[h].exec(a))!=null&&f[2]){k=o.filter[h],l=f[1],g=!1,f.splice(1,1);if(l.substr(l.length-1)==="\\")continue;s===r&&(r=[]);if(o.preFilter[h]){f=o.preFilter[h](f,s,d,r,e,t);if(!f)g=i=!0;else if(f===!0)continue}if(f)for(n=0;(j=s[n])!=null;n++)j&&(i=k(j,f,n,s),p=e^i,d&&i!=null?p?g=!0:s[n]=!1:p&&(r.push(j),g=!0));if(i!==b){d||(s=r),a=a.replace(o.match[h],"");if(!g)return[];break}}if(a===q)if(g==null)m.error(a);else break;q=a}return s},m.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)};var n=m.getText=function(a){var b,c,d=a.nodeType,e="";if(d){if(d===1||d===9){if(typeof a.textContent=="string")return a.textContent;if(typeof a.innerText=="string")return a.innerText.replace(k,"");for(a=a.firstChild;a;a=a.nextSibling)e+=n(a)}else if(d===3||d===4)return a.nodeValue}else for(b=0;c=a[b];b++)c.nodeType!==8&&(e+=n(c));return e},o=m.selectors={order:["ID","NAME","TAG"],match:{ID:/#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,CLASS:/\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,NAME:/\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,ATTR:/\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,TAG:/^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,CHILD:/:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,POS:/:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,PSEUDO:/:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/},leftMatch:{},attrMap:{"class":"className","for":"htmlFor"},attrHandle:{href:function(a){return a.getAttribute("href")},type:function(a){return a.getAttribute("type")}},relative:{"+":function(a,b){var c=typeof b=="string",d=c&&!l.test(b),e=c&&!d;d&&(b=b.toLowerCase());for(var f=0,g=a.length,h;f<g;f++)if(h=a[f]){while((h=h.previousSibling)&&h.nodeType!==1);a[f]=e||h&&h.nodeName.toLowerCase()===b?h||!1:h===b}e&&m.filter(b,a,!0)},">":function(a,b){var c,d=typeof b=="string",e=0,f=a.length;if(d&&!l.test(b)){b=b.toLowerCase();for(;e<f;e++){c=a[e];if(c){var g=c.parentNode;a[e]=g.nodeName.toLowerCase()===b?g:!1}}}else{for(;e<f;e++)c=a[e],c&&(a[e]=d?c.parentNode:c.parentNode===b);d&&m.filter(b,a,!0)}},"":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("parentNode",b,f,a,d,c)},"~":function(a,b,c){var d,f=e++,g=x;typeof b=="string"&&!l.test(b)&&(b=b.toLowerCase(),d=b,g=w),g("previousSibling",b,f,a,d,c)}},find:{ID:function(a,b,c){if(typeof b.getElementById!="undefined"&&!c){var d=b.getElementById(a[1]);return d&&d.parentNode?[d]:[]}},NAME:function(a,b){if(typeof b.getElementsByName!="undefined"){var c=[],d=b.getElementsByName(a[1]);for(var e=0,f=d.length;e<f;e++)d[e].getAttribute("name")===a[1]&&c.push(d[e]);return c.length===0?null:c}},TAG:function(a,b){if(typeof b.getElementsByTagName!="undefined")return b.getElementsByTagName(a[1])}},preFilter:{CLASS:function(a,b,c,d,e,f){a=" "+a[1].replace(j,"")+" ";if(f)return a;for(var g=0,h;(h=b[g])!=null;g++)h&&(e^(h.className&&(" "+h.className+" ").replace(/[\t\n\r]/g," ").indexOf(a)>=0)?c||d.push(h):c&&(b[g]=!1));return!1},ID:function(a){return a[1].replace(j,"")},TAG:function(a,b){return a[1].replace(j,"").toLowerCase()},CHILD:function(a){if(a[1]==="nth"){a[2]||m.error(a[0]),a[2]=a[2].replace(/^\+|\s*/g,"");var b=/(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2]==="even"&&"2n"||a[2]==="odd"&&"2n+1"||!/\D/.test(a[2])&&"0n+"+a[2]||a[2]);a[2]=b[1]+(b[2]||1)-0,a[3]=b[3]-0}else a[2]&&m.error(a[0]);a[0]=e++;return a},ATTR:function(a,b,c,d,e,f){var g=a[1]=a[1].replace(j,"");!f&&o.attrMap[g]&&(a[1]=o.attrMap[g]),a[4]=(a[4]||a[5]||"").replace(j,""),a[2]==="~="&&(a[4]=" "+a[4]+" ");return a},PSEUDO:function(b,c,d,e,f){if(b[1]==="not")if((a.exec(b[3])||"").length>1||/^\w/.test(b[3]))b[3]=m(b[3],null,null,c);else{var g=m.filter(b[3],c,d,!0^f);d||e.push.apply(e,g);return!1}else if(o.match.POS.test(b[0])||o.match.CHILD.test(b[0]))return!0;return b},POS:function(a){a.unshift(!0);return a}},filters:{enabled:function(a){return a.disabled===!1&&a.type!=="hidden"},disabled:function(a){return a.disabled===!0},checked:function(a){return a.checked===!0},selected:function(a){a.parentNode&&a.parentNode.selectedIndex;return a.selected===!0},parent:function(a){return!!a.firstChild},empty:function(a){return!a.firstChild},has:function(a,b,c){return!!m(c[3],a).length},header:function(a){return/h\d/i.test(a.nodeName)},text:function(a){var b=a.getAttribute("type"),c=a.type;return a.nodeName.toLowerCase()==="input"&&"text"===c&&(b===c||b===null)},radio:function(a){return a.nodeName.toLowerCase()==="input"&&"radio"===a.type},checkbox:function(a){return a.nodeName.toLowerCase()==="input"&&"checkbox"===a.type},file:function(a){return a.nodeName.toLowerCase()==="input"&&"file"===a.type},password:function(a){return a.nodeName.toLowerCase()==="input"&&"password"===a.type},submit:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"submit"===a.type},image:function(a){return a.nodeName.toLowerCase()==="input"&&"image"===a.type},reset:function(a){var b=a.nodeName.toLowerCase();return(b==="input"||b==="button")&&"reset"===a.type},button:function(a){var b=a.nodeName.toLowerCase();return b==="input"&&"button"===a.type||b==="button"},input:function(a){return/input|select|textarea|button/i.test(a.nodeName)},focus:function(a){return a===a.ownerDocument.activeElement}},setFilters:{first:function(a,b){return b===0},last:function(a,b,c,d){return b===d.length-1},even:function(a,b){return b%2===0},odd:function(a,b){return b%2===1},lt:function(a,b,c){return b<c[3]-0},gt:function(a,b,c){return b>c[3]-0},nth:function(a,b,c){return c[3]-0===b},eq:function(a,b,c){return c[3]-0===b}},filter:{PSEUDO:function(a,b,c,d){var e=b[1],f=o.filters[e];if(f)return f(a,c,b,d);if(e==="contains")return(a.textContent||a.innerText||n([a])||"").indexOf(b[3])>=0;if(e==="not"){var g=b[3];for(var h=0,i=g.length;h<i;h++)if(g[h]===a)return!1;return!0}m.error(e)},CHILD:function(a,b){var c,e,f,g,h,i,j,k=b[1],l=a;switch(k){case"only":case"first":while(l=l.previousSibling)if(l.nodeType===1)return!1;if(k==="first")return!0;l=a;case"last":while(l=l.nextSibling)if(l.nodeType===1)return!1;return!0;case"nth":c=b[2],e=b[3];if(c===1&&e===0)return!0;f=b[0],g=a.parentNode;if(g&&(g[d]!==f||!a.nodeIndex)){i=0;for(l=g.firstChild;l;l=l.nextSibling)l.nodeType===1&&(l.nodeIndex=++i);g[d]=f}j=a.nodeIndex-e;return c===0?j===0:j%c===0&&j/c>=0}},ID:function(a,b){return a.nodeType===1&&a.getAttribute("id")===b},TAG:function(a,b){return b==="*"&&a.nodeType===1||!!a.nodeName&&a.nodeName.toLowerCase()===b},CLASS:function(a,b){return(" "+(a.className||a.getAttribute("class"))+" ").indexOf(b)>-1},ATTR:function(a,b){var c=b[1],d=m.attr?m.attr(a,c):o.attrHandle[c]?o.attrHandle[c](a):a[c]!=null?a[c]:a.getAttribute(c),e=d+"",f=b[2],g=b[4];return d==null?f==="!=":!f&&m.attr?d!=null:f==="="?e===g:f==="*="?e.indexOf(g)>=0:f==="~="?(" "+e+" ").indexOf(g)>=0:g?f==="!="?e!==g:f==="^="?e.indexOf(g)===0:f==="$="?e.substr(e.length-g.length)===g:f==="|="?e===g||e.substr(0,g.length+1)===g+"-":!1:e&&d!==!1},POS:function(a,b,c,d){var e=b[2],f=o.setFilters[e];if(f)return f(a,c,b,d)}}},p=o.match.POS,q=function(a,b){return"\\"+(b-0+1)};for(var r in o.match)o.match[r]=new RegExp(o.match[r].source+/(?![^\[]*\])(?![^\(]*\))/.source),o.leftMatch[r]=new RegExp(/(^(?:.|\r|\n)*?)/.source+o.match[r].source.replace(/\\(\d+)/g,q));var s=function(a,b){a=Array.prototype.slice.call(a,0);if(b){b.push.apply(b,a);return b}return a};try{Array.prototype.slice.call(c.documentElement.childNodes,0)[0].nodeType}catch(t){s=function(a,b){var c=0,d=b||[];if(g.call(a)==="[object Array]")Array.prototype.push.apply(d,a);else if(typeof a.length=="number")for(var e=a.length;c<e;c++)d.push(a[c]);else for(;a[c];c++)d.push(a[c]);return d}}var u,v;c.documentElement.compareDocumentPosition?u=function(a,b){if(a===b){h=!0;return 0}if(!a.compareDocumentPosition||!b.compareDocumentPosition)return a.compareDocumentPosition?-1:1;return a.compareDocumentPosition(b)&4?-1:1}:(u=function(a,b){if(a===b){h=!0;return 0}if(a.sourceIndex&&b.sourceIndex)return a.sourceIndex-b.sourceIndex;var c,d,e=[],f=[],g=a.parentNode,i=b.parentNode,j=g;if(g===i)return v(a,b);if(!g)return-1;if(!i)return 1;while(j)e.unshift(j),j=j.parentNode;j=i;while(j)f.unshift(j),j=j.parentNode;c=e.length,d=f.length;for(var k=0;k<c&&k<d;k++)if(e[k]!==f[k])return v(e[k],f[k]);return k===c?v(a,f[k],-1):v(e[k],b,1)},v=function(a,b,c){if(a===b)return c;var d=a.nextSibling;while(d){if(d===b)return-1;d=d.nextSibling}return 1}),function(){var a=c.createElement("div"),d="script"+(new Date).getTime(),e=c.documentElement;a.innerHTML="<a name='"+d+"'/>",e.insertBefore(a,e.firstChild),c.getElementById(d)&&(o.find.ID=function(a,c,d){if(typeof c.getElementById!="undefined"&&!d){var e=c.getElementById(a[1]);return e?e.id===a[1]||typeof e.getAttributeNode!="undefined"&&e.getAttributeNode("id").nodeValue===a[1]?[e]:b:[]}},o.filter.ID=function(a,b){var c=typeof a.getAttributeNode!="undefined"&&a.getAttributeNode("id");return a.nodeType===1&&c&&c.nodeValue===b}),e.removeChild(a),e=a=null}(),function(){var a=c.createElement("div");a.appendChild(c.createComment("")),a.getElementsByTagName("*").length>0&&(o.find.TAG=function(a,b){var c=b.getElementsByTagName(a[1]);if(a[1]==="*"){var d=[];for(var e=0;c[e];e++)c[e].nodeType===1&&d.push(c[e]);c=d}return c}),a.innerHTML="<a href='#'></a>",a.firstChild&&typeof a.firstChild.getAttribute!="undefined"&&a.firstChild.getAttribute("href")!=="#"&&(o.attrHandle.href=function(a){return a.getAttribute("href",2)}),a=null}(),c.querySelectorAll&&function(){var a=m,b=c.createElement("div"),d="__sizzle__";b.innerHTML="<p class='TEST'></p>";if(!b.querySelectorAll||b.querySelectorAll(".TEST").length!==0){m=function(b,e,f,g){e=e||c;if(!g&&!m.isXML(e)){var h=/^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);if(h&&(e.nodeType===1||e.nodeType===9)){if(h[1])return s(e.getElementsByTagName(b),f);if(h[2]&&o.find.CLASS&&e.getElementsByClassName)return s(e.getElementsByClassName(h[2]),f)}if(e.nodeType===9){if(b==="body"&&e.body)return s([e.body],f);if(h&&h[3]){var i=e.getElementById(h[3]);if(!i||!i.parentNode)return s([],f);if(i.id===h[3])return s([i],f)}try{return s(e.querySelectorAll(b),f)}catch(j){}}else if(e.nodeType===1&&e.nodeName.toLowerCase()!=="object"){var k=e,l=e.getAttribute("id"),n=l||d,p=e.parentNode,q=/^\s*[+~]/.test(b);l?n=n.replace(/'/g,"\\$&"):e.setAttribute("id",n),q&&p&&(e=e.parentNode);try{if(!q||p)return s(e.querySelectorAll("[id='"+n+"'] "+b),f)}catch(r){}finally{l||k.removeAttribute("id")}}}return a(b,e,f,g)};for(var e in a)m[e]=a[e];b=null}}(),function(){var a=c.documentElement,b=a.matchesSelector||a.mozMatchesSelector||a.webkitMatchesSelector||a.msMatchesSelector;if(b){var d=!b.call(c.createElement("div"),"div"),e=!1;try{b.call(c.documentElement,"[test!='']:sizzle")}catch(f){e=!0}m.matchesSelector=function(a,c){c=c.replace(/\=\s*([^'"\]]*)\s*\]/g,"='$1']");if(!m.isXML(a))try{if(e||!o.match.PSEUDO.test(c)&&!/!=/.test(c)){var f=b.call(a,c);if(f||!d||a.document&&a.document.nodeType!==11)return f}}catch(g){}return m(c,null,null,[a]).length>0}}}(),function(){var a=c.createElement("div");a.innerHTML="<div class='test e'></div><div class='test'></div>";if(!!a.getElementsByClassName&&a.getElementsByClassName("e").length!==0){a.lastChild.className="e";if(a.getElementsByClassName("e").length===1)return;o.order.splice(1,0,"CLASS"),o.find.CLASS=function(a,b,c){if(typeof b.getElementsByClassName!="undefined"&&!c)return b.getElementsByClassName(a[1])},a=null}}(),c.documentElement.contains?m.contains=function(a,b){return a!==b&&(a.contains?a.contains(b):!0)}:c.documentElement.compareDocumentPosition?m.contains=function(a,b){return!!(a.compareDocumentPosition(b)&16)}:m.contains=function(){return!1},m.isXML=function(a){var b=(a?a.ownerDocument||a:0).documentElement;return b?b.nodeName!=="HTML":!1};var y=function(a,b,c){var d,e=[],f="",g=b.nodeType?[b]:b;while(d=o.match.PSEUDO.exec(a))f+=d[0],a=a.replace(o.match.PSEUDO,"");a=o.relative[a]?a+"*":a;for(var h=0,i=g.length;h<i;h++)m(a,g[h],e,c);return m.filter(f,e)};m.attr=f.attr,m.selectors.attrMap={},f.find=m,f.expr=m.selectors,f.expr[":"]=f.expr.filters,f.unique=m.uniqueSort,f.text=m.getText,f.isXMLDoc=m.isXML,f.contains=m.contains}();var L=/Until$/,M=/^(?:parents|prevUntil|prevAll)/,N=/,/,O=/^.[^:#\[\.,]*$/,P=Array.prototype.slice,Q=f.expr.match.POS,R={children:!0,contents:!0,next:!0,prev:!0};f.fn.extend({find:function(a){var b=this,c,d;if(typeof a!="string")return f(a).filter(function(){for(c=0,d=b.length;c<d;c++)if(f.contains(b[c],this))return!0});var e=this.pushStack("","find",a),g,h,i;for(c=0,d=this.length;c<d;c++){g=e.length,f.find(a,this[c],e);if(c>0)for(h=g;h<e.length;h++)for(i=0;i<g;i++)if(e[i]===e[h]){e.splice(h--,1);break}}return e},has:function(a){var b=f(a);return this.filter(function(){for(var a=0,c=b.length;a<c;a++)if(f.contains(this,b[a]))return!0})},not:function(a){return this.pushStack(T(this,a,!1),"not",a)},filter:function(a){return this.pushStack(T(this,a,!0),"filter",a)},is:function(a){return!!a&&(typeof a=="string"?Q.test(a)?f(a,this.context).index(this[0])>=0:f.filter(a,this).length>0:this.filter(a).length>0)},closest:function(a,b){var c=[],d,e,g=this[0];if(f.isArray(a)){var h=1;while(g&&g.ownerDocument&&g!==b){for(d=0;d<a.length;d++)f(g).is(a[d])&&c.push({selector:a[d],elem:g,level:h});g=g.parentNode,h++}return c}var i=Q.test(a)||typeof a!="string"?f(a,b||this.context):0;for(d=0,e=this.length;d<e;d++){g=this[d];while(g){if(i?i.index(g)>-1:f.find.matchesSelector(g,a)){c.push(g);break}g=g.parentNode;if(!g||!g.ownerDocument||g===b||g.nodeType===11)break}}c=c.length>1?f.unique(c):c;return this.pushStack(c,"closest",a)},index:function(a){if(!a)return this[0]&&this[0].parentNode?this.prevAll().length:-1;if(typeof a=="string")return f.inArray(this[0],f(a));return f.inArray(a.jquery?a[0]:a,this)},add:function(a,b){var c=typeof a=="string"?f(a,b):f.makeArray(a&&a.nodeType?[a]:a),d=f.merge(this.get(),c);return this.pushStack(S(c[0])||S(d[0])?d:f.unique(d))},andSelf:function(){return this.add(this.prevObject)}}),f.each({parent:function(a){var b=a.parentNode;return b&&b.nodeType!==11?b:null},parents:function(a){return f.dir(a,"parentNode")},parentsUntil:function(a,b,c){return f.dir(a,"parentNode",c)},next:function(a){return f.nth(a,2,"nextSibling")},prev:function(a){return f.nth(a,2,"previousSibling")},nextAll:function(a){return f.dir(a,"nextSibling")},prevAll:function(a){return f.dir(a,"previousSibling")},nextUntil:function(a,b,c){return f.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return f.dir(a,"previousSibling",c)},siblings:function(a){return f.sibling(a.parentNode.firstChild,a)},children:function(a){return f.sibling(a.firstChild)},contents:function(a){return f.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:f.makeArray(a.childNodes)}},function(a,b){f.fn[a]=function(c,d){var e=f.map(this,b,c);L.test(a)||(d=c),d&&typeof d=="string"&&(e=f.filter(d,e)),e=this.length>1&&!R[a]?f.unique(e):e,(this.length>1||N.test(d))&&M.test(a)&&(e=e.reverse());return this.pushStack(e,a,P.call(arguments).join(","))}}),f.extend({filter:function(a,b,c){c&&(a=":not("+a+")");return b.length===1?f.find.matchesSelector(b[0],a)?[b[0]]:[]:f.find.matches(a,b)},dir:function(a,c,d){var e=[],g=a[c];while(g&&g.nodeType!==9&&(d===b||g.nodeType!==1||!f(g).is(d)))g.nodeType===1&&e.push(g),g=g[c];return e},nth:function(a,b,c,d){b=b||1;var e=0;for(;a;a=a[c])if(a.nodeType===1&&++e===b)break;return a},sibling:function(a,b){var c=[];for(;a;a=a.nextSibling)a.nodeType===1&&a!==b&&c.push(a);return c}});var V="abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",W=/ jQuery\d+="(?:\d+|null)"/g,X=/^\s+/,Y=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,Z=/<([\w:]+)/,$=/<tbody/i,_=/<|&#?\w+;/,ba=/<(?:script|style)/i,bb=/<(?:script|object|embed|option|style)/i,bc=new RegExp("<(?:"+V+")","i"),bd=/checked\s*(?:[^=]|=\s*.checked.)/i,be=/\/(java|ecma)script/i,bf=/^\s*<!(?:\[CDATA\[|\-\-)/,bg={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],area:[1,"<map>","</map>"],_default:[0,"",""]},bh=U(c);bg.optgroup=bg.option,bg.tbody=bg.tfoot=bg.colgroup=bg.caption=bg.thead,bg.th=bg.td,f.support.htmlSerialize||(bg._default=[1,"div<div>","</div>"]),f.fn.extend({text:function(a){if(f.isFunction(a))return this.each(function(b){var c=f(this);c.text(a.call(this,b,c.text()))});if(typeof a!="object"&&a!==b)return this.empty().append((this[0]&&this[0].ownerDocument||c).createTextNode(a));return f.text(this)},wrapAll:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapAll(a.call(this,b))});if(this[0]){var b=f(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&a.firstChild.nodeType===1)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){if(f.isFunction(a))return this.each(function(b){f(this).wrapInner(a.call(this,b))});return this.each(function(){var b=f(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=f.isFunction(a);return this.each(function(c){f(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){f.nodeName(this,"body")||f(this).replaceWith(this.childNodes)}).end()},append:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.appendChild(a)})},prepend:function(){return this.domManip(arguments,!0,function(a){this.nodeType===1&&this.insertBefore(a,this.firstChild)})},before:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this)});if(arguments.length){var a=f.clean(arguments);a.push.apply(a,this.toArray());return this.pushStack(a,"before",arguments)}},after:function(){if(this[0]&&this[0].parentNode)return this.domManip(arguments,!1,function(a){this.parentNode.insertBefore(a,this.nextSibling)});if(arguments.length){var a=this.pushStack(this,"after",arguments);a.push.apply(a,f.clean(arguments));return a}},remove:function(a,b){for(var c=0,d;(d=this[c])!=null;c++)if(!a||f.filter(a,[d]).length)!b&&d.nodeType===1&&(f.cleanData(d.getElementsByTagName("*")),f.cleanData([d])),d.parentNode&&d.parentNode.removeChild(d);return this},empty:function()
{for(var a=0,b;(b=this[a])!=null;a++){b.nodeType===1&&f.cleanData(b.getElementsByTagName("*"));while(b.firstChild)b.removeChild(b.firstChild)}return this},clone:function(a,b){a=a==null?!1:a,b=b==null?a:b;return this.map(function(){return f.clone(this,a,b)})},html:function(a){if(a===b)return this[0]&&this[0].nodeType===1?this[0].innerHTML.replace(W,""):null;if(typeof a=="string"&&!ba.test(a)&&(f.support.leadingWhitespace||!X.test(a))&&!bg[(Z.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(Y,"<$1></$2>");try{for(var c=0,d=this.length;c<d;c++)this[c].nodeType===1&&(f.cleanData(this[c].getElementsByTagName("*")),this[c].innerHTML=a)}catch(e){this.empty().append(a)}}else f.isFunction(a)?this.each(function(b){var c=f(this);c.html(a.call(this,b,c.html()))}):this.empty().append(a);return this},replaceWith:function(a){if(this[0]&&this[0].parentNode){if(f.isFunction(a))return this.each(function(b){var c=f(this),d=c.html();c.replaceWith(a.call(this,b,d))});typeof a!="string"&&(a=f(a).detach());return this.each(function(){var b=this.nextSibling,c=this.parentNode;f(this).remove(),b?f(b).before(a):f(c).append(a)})}return this.length?this.pushStack(f(f.isFunction(a)?a():a),"replaceWith",a):this},detach:function(a){return this.remove(a,!0)},domManip:function(a,c,d){var e,g,h,i,j=a[0],k=[];if(!f.support.checkClone&&arguments.length===3&&typeof j=="string"&&bd.test(j))return this.each(function(){f(this).domManip(a,c,d,!0)});if(f.isFunction(j))return this.each(function(e){var g=f(this);a[0]=j.call(this,e,c?g.html():b),g.domManip(a,c,d)});if(this[0]){i=j&&j.parentNode,f.support.parentNode&&i&&i.nodeType===11&&i.childNodes.length===this.length?e={fragment:i}:e=f.buildFragment(a,this,k),h=e.fragment,h.childNodes.length===1?g=h=h.firstChild:g=h.firstChild;if(g){c=c&&f.nodeName(g,"tr");for(var l=0,m=this.length,n=m-1;l<m;l++)d.call(c?bi(this[l],g):this[l],e.cacheable||m>1&&l<n?f.clone(h,!0,!0):h)}k.length&&f.each(k,bp)}return this}}),f.buildFragment=function(a,b,d){var e,g,h,i,j=a[0];b&&b[0]&&(i=b[0].ownerDocument||b[0]),i.createDocumentFragment||(i=c),a.length===1&&typeof j=="string"&&j.length<512&&i===c&&j.charAt(0)==="<"&&!bb.test(j)&&(f.support.checkClone||!bd.test(j))&&(f.support.html5Clone||!bc.test(j))&&(g=!0,h=f.fragments[j],h&&h!==1&&(e=h)),e||(e=i.createDocumentFragment(),f.clean(a,i,e,d)),g&&(f.fragments[j]=h?e:1);return{fragment:e,cacheable:g}},f.fragments={},f.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){f.fn[a]=function(c){var d=[],e=f(c),g=this.length===1&&this[0].parentNode;if(g&&g.nodeType===11&&g.childNodes.length===1&&e.length===1){e[b](this[0]);return this}for(var h=0,i=e.length;h<i;h++){var j=(h>0?this.clone(!0):this).get();f(e[h])[b](j),d=d.concat(j)}return this.pushStack(d,a,e.selector)}}),f.extend({clone:function(a,b,c){var d,e,g,h=f.support.html5Clone||!bc.test("<"+a.nodeName)?a.cloneNode(!0):bo(a);if((!f.support.noCloneEvent||!f.support.noCloneChecked)&&(a.nodeType===1||a.nodeType===11)&&!f.isXMLDoc(a)){bk(a,h),d=bl(a),e=bl(h);for(g=0;d[g];++g)e[g]&&bk(d[g],e[g])}if(b){bj(a,h);if(c){d=bl(a),e=bl(h);for(g=0;d[g];++g)bj(d[g],e[g])}}d=e=null;return h},clean:function(a,b,d,e){var g;b=b||c,typeof b.createElement=="undefined"&&(b=b.ownerDocument||b[0]&&b[0].ownerDocument||c);var h=[],i;for(var j=0,k;(k=a[j])!=null;j++){typeof k=="number"&&(k+="");if(!k)continue;if(typeof k=="string")if(!_.test(k))k=b.createTextNode(k);else{k=k.replace(Y,"<$1></$2>");var l=(Z.exec(k)||["",""])[1].toLowerCase(),m=bg[l]||bg._default,n=m[0],o=b.createElement("div");b===c?bh.appendChild(o):U(b).appendChild(o),o.innerHTML=m[1]+k+m[2];while(n--)o=o.lastChild;if(!f.support.tbody){var p=$.test(k),q=l==="table"&&!p?o.firstChild&&o.firstChild.childNodes:m[1]==="<table>"&&!p?o.childNodes:[];for(i=q.length-1;i>=0;--i)f.nodeName(q[i],"tbody")&&!q[i].childNodes.length&&q[i].parentNode.removeChild(q[i])}!f.support.leadingWhitespace&&X.test(k)&&o.insertBefore(b.createTextNode(X.exec(k)[0]),o.firstChild),k=o.childNodes}var r;if(!f.support.appendChecked)if(k[0]&&typeof (r=k.length)=="number")for(i=0;i<r;i++)bn(k[i]);else bn(k);k.nodeType?h.push(k):h=f.merge(h,k)}if(d){g=function(a){return!a.type||be.test(a.type)};for(j=0;h[j];j++)if(e&&f.nodeName(h[j],"script")&&(!h[j].type||h[j].type.toLowerCase()==="text/javascript"))e.push(h[j].parentNode?h[j].parentNode.removeChild(h[j]):h[j]);else{if(h[j].nodeType===1){var s=f.grep(h[j].getElementsByTagName("script"),g);h.splice.apply(h,[j+1,0].concat(s))}d.appendChild(h[j])}}return h},cleanData:function(a){var b,c,d=f.cache,e=f.event.special,g=f.support.deleteExpando;for(var h=0,i;(i=a[h])!=null;h++){if(i.nodeName&&f.noData[i.nodeName.toLowerCase()])continue;c=i[f.expando];if(c){b=d[c];if(b&&b.events){for(var j in b.events)e[j]?f.event.remove(i,j):f.removeEvent(i,j,b.handle);b.handle&&(b.handle.elem=null)}g?delete i[f.expando]:i.removeAttribute&&i.removeAttribute(f.expando),delete d[c]}}}});var bq=/alpha\([^)]*\)/i,br=/opacity=([^)]*)/,bs=/([A-Z]|^ms)/g,bt=/^-?\d+(?:px)?$/i,bu=/^-?\d/,bv=/^([\-+])=([\-+.\de]+)/,bw={position:"absolute",visibility:"hidden",display:"block"},bx=["Left","Right"],by=["Top","Bottom"],bz,bA,bB;f.fn.css=function(a,c){if(arguments.length===2&&c===b)return this;return f.access(this,a,c,!0,function(a,c,d){return d!==b?f.style(a,c,d):f.css(a,c)})},f.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=bz(a,"opacity","opacity");return c===""?"1":c}return a.style.opacity}}},cssNumber:{fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":f.support.cssFloat?"cssFloat":"styleFloat"},style:function(a,c,d,e){if(!!a&&a.nodeType!==3&&a.nodeType!==8&&!!a.style){var g,h,i=f.camelCase(c),j=a.style,k=f.cssHooks[i];c=f.cssProps[i]||i;if(d===b){if(k&&"get"in k&&(g=k.get(a,!1,e))!==b)return g;return j[c]}h=typeof d,h==="string"&&(g=bv.exec(d))&&(d=+(g[1]+1)*+g[2]+parseFloat(f.css(a,c)),h="number");if(d==null||h==="number"&&isNaN(d))return;h==="number"&&!f.cssNumber[i]&&(d+="px");if(!k||!("set"in k)||(d=k.set(a,d))!==b)try{j[c]=d}catch(l){}}},css:function(a,c,d){var e,g;c=f.camelCase(c),g=f.cssHooks[c],c=f.cssProps[c]||c,c==="cssFloat"&&(c="float");if(g&&"get"in g&&(e=g.get(a,!0,d))!==b)return e;if(bz)return bz(a,c)},swap:function(a,b,c){var d={};for(var e in b)d[e]=a.style[e],a.style[e]=b[e];c.call(a);for(e in b)a.style[e]=d[e]}}),f.curCSS=f.css,f.each(["height","width"],function(a,b){f.cssHooks[b]={get:function(a,c,d){var e;if(c){if(a.offsetWidth!==0)return bC(a,b,d);f.swap(a,bw,function(){e=bC(a,b,d)});return e}},set:function(a,b){if(!bt.test(b))return b;b=parseFloat(b);if(b>=0)return b+"px"}}}),f.support.opacity||(f.cssHooks.opacity={get:function(a,b){return br.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?parseFloat(RegExp.$1)/100+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=f.isNumeric(b)?"alpha(opacity="+b*100+")":"",g=d&&d.filter||c.filter||"";c.zoom=1;if(b>=1&&f.trim(g.replace(bq,""))===""){c.removeAttribute("filter");if(d&&!d.filter)return}c.filter=bq.test(g)?g.replace(bq,e):g+" "+e}}),f(function(){f.support.reliableMarginRight||(f.cssHooks.marginRight={get:function(a,b){var c;f.swap(a,{display:"inline-block"},function(){b?c=bz(a,"margin-right","marginRight"):c=a.style.marginRight});return c}})}),c.defaultView&&c.defaultView.getComputedStyle&&(bA=function(a,b){var c,d,e;b=b.replace(bs,"-$1").toLowerCase(),(d=a.ownerDocument.defaultView)&&(e=d.getComputedStyle(a,null))&&(c=e.getPropertyValue(b),c===""&&!f.contains(a.ownerDocument.documentElement,a)&&(c=f.style(a,b)));return c}),c.documentElement.currentStyle&&(bB=function(a,b){var c,d,e,f=a.currentStyle&&a.currentStyle[b],g=a.style;f===null&&g&&(e=g[b])&&(f=e),!bt.test(f)&&bu.test(f)&&(c=g.left,d=a.runtimeStyle&&a.runtimeStyle.left,d&&(a.runtimeStyle.left=a.currentStyle.left),g.left=b==="fontSize"?"1em":f||0,f=g.pixelLeft+"px",g.left=c,d&&(a.runtimeStyle.left=d));return f===""?"auto":f}),bz=bA||bB,f.expr&&f.expr.filters&&(f.expr.filters.hidden=function(a){var b=a.offsetWidth,c=a.offsetHeight;return b===0&&c===0||!f.support.reliableHiddenOffsets&&(a.style&&a.style.display||f.css(a,"display"))==="none"},f.expr.filters.visible=function(a){return!f.expr.filters.hidden(a)});var bD=/%20/g,bE=/\[\]$/,bF=/\r?\n/g,bG=/#.*$/,bH=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,bI=/^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,bJ=/^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,bK=/^(?:GET|HEAD)$/,bL=/^\/\//,bM=/\?/,bN=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,bO=/^(?:select|textarea)/i,bP=/\s+/,bQ=/([?&])_=[^&]*/,bR=/^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,bS=f.fn.load,bT={},bU={},bV,bW,bX=["*/"]+["*"];try{bV=e.href}catch(bY){bV=c.createElement("a"),bV.href="",bV=bV.href}bW=bR.exec(bV.toLowerCase())||[],f.fn.extend({load:function(a,c,d){if(typeof a!="string"&&bS)return bS.apply(this,arguments);if(!this.length)return this;var e=a.indexOf(" ");if(e>=0){var g=a.slice(e,a.length);a=a.slice(0,e)}var h="GET";c&&(f.isFunction(c)?(d=c,c=b):typeof c=="object"&&(c=f.param(c,f.ajaxSettings.traditional),h="POST"));var i=this;f.ajax({url:a,type:h,dataType:"html",data:c,complete:function(a,b,c){c=a.responseText,a.isResolved()&&(a.done(function(a){c=a}),i.html(g?f("<div>").append(c.replace(bN,"")).find(g):c)),d&&i.each(d,[c,b,a])}});return this},serialize:function(){return f.param(this.serializeArray())},serializeArray:function(){return this.map(function(){return this.elements?f.makeArray(this.elements):this}).filter(function(){return this.name&&!this.disabled&&(this.checked||bO.test(this.nodeName)||bI.test(this.type))}).map(function(a,b){var c=f(this).val();return c==null?null:f.isArray(c)?f.map(c,function(a,c){return{name:b.name,value:a.replace(bF,"\r\n")}}):{name:b.name,value:c.replace(bF,"\r\n")}}).get()}}),f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "),function(a,b){f.fn[b]=function(a){return this.on(b,a)}}),f.each(["get","post"],function(a,c){f[c]=function(a,d,e,g){f.isFunction(d)&&(g=g||e,e=d,d=b);return f.ajax({type:c,url:a,data:d,success:e,dataType:g})}}),f.extend({getScript:function(a,c){return f.get(a,b,c,"script")},getJSON:function(a,b,c){return f.get(a,b,c,"json")},ajaxSetup:function(a,b){b?b_(a,f.ajaxSettings):(b=a,a=f.ajaxSettings),b_(a,b);return a},ajaxSettings:{url:bV,isLocal:bJ.test(bW[1]),global:!0,type:"GET",contentType:"application/x-www-form-urlencoded",processData:!0,async:!0,accepts:{xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript","*":bX},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText"},converters:{"* text":a.String,"text html":!0,"text json":f.parseJSON,"text xml":f.parseXML},flatOptions:{context:!0,url:!0}},ajaxPrefilter:bZ(bT),ajaxTransport:bZ(bU),ajax:function(a,c){function w(a,c,l,m){if(s!==2){s=2,q&&clearTimeout(q),p=b,n=m||"",v.readyState=a>0?4:0;var o,r,u,w=c,x=l?cb(d,v,l):b,y,z;if(a>=200&&a<300||a===304){if(d.ifModified){if(y=v.getResponseHeader("Last-Modified"))f.lastModified[k]=y;if(z=v.getResponseHeader("Etag"))f.etag[k]=z}if(a===304)w="notmodified",o=!0;else try{r=cc(d,x),w="success",o=!0}catch(A){w="parsererror",u=A}}else{u=w;if(!w||a)w="error",a<0&&(a=0)}v.status=a,v.statusText=""+(c||w),o?h.resolveWith(e,[r,w,v]):h.rejectWith(e,[v,w,u]),v.statusCode(j),j=b,t&&g.trigger("ajax"+(o?"Success":"Error"),[v,d,o?r:u]),i.fireWith(e,[v,w]),t&&(g.trigger("ajaxComplete",[v,d]),--f.active||f.event.trigger("ajaxStop"))}}typeof a=="object"&&(c=a,a=b),c=c||{};var d=f.ajaxSetup({},c),e=d.context||d,g=e!==d&&(e.nodeType||e instanceof f)?f(e):f.event,h=f.Deferred(),i=f.Callbacks("once memory"),j=d.statusCode||{},k,l={},m={},n,o,p,q,r,s=0,t,u,v={readyState:0,setRequestHeader:function(a,b){if(!s){var c=a.toLowerCase();a=m[c]=m[c]||a,l[a]=b}return this},getAllResponseHeaders:function(){return s===2?n:null},getResponseHeader:function(a){var c;if(s===2){if(!o){o={};while(c=bH.exec(n))o[c[1].toLowerCase()]=c[2]}c=o[a.toLowerCase()]}return c===b?null:c},overrideMimeType:function(a){s||(d.mimeType=a);return this},abort:function(a){a=a||"abort",p&&p.abort(a),w(0,a);return this}};h.promise(v),v.success=v.done,v.error=v.fail,v.complete=i.add,v.statusCode=function(a){if(a){var b;if(s<2)for(b in a)j[b]=[j[b],a[b]];else b=a[v.status],v.then(b,b)}return this},d.url=((a||d.url)+"").replace(bG,"").replace(bL,bW[1]+"//"),d.dataTypes=f.trim(d.dataType||"*").toLowerCase().split(bP),d.crossDomain==null&&(r=bR.exec(d.url.toLowerCase()),d.crossDomain=!(!r||r[1]==bW[1]&&r[2]==bW[2]&&(r[3]||(r[1]==="http:"?80:443))==(bW[3]||(bW[1]==="http:"?80:443)))),d.data&&d.processData&&typeof d.data!="string"&&(d.data=f.param(d.data,d.traditional)),b$(bT,d,c,v);if(s===2)return!1;t=d.global,d.type=d.type.toUpperCase(),d.hasContent=!bK.test(d.type),t&&f.active++===0&&f.event.trigger("ajaxStart");if(!d.hasContent){d.data&&(d.url+=(bM.test(d.url)?"&":"?")+d.data,delete d.data),k=d.url;if(d.cache===!1){var x=f.now(),y=d.url.replace(bQ,"$1_="+x);d.url=y+(y===d.url?(bM.test(d.url)?"&":"?")+"_="+x:"")}}(d.data&&d.hasContent&&d.contentType!==!1||c.contentType)&&v.setRequestHeader("Content-Type",d.contentType),d.ifModified&&(k=k||d.url,f.lastModified[k]&&v.setRequestHeader("If-Modified-Since",f.lastModified[k]),f.etag[k]&&v.setRequestHeader("If-None-Match",f.etag[k])),v.setRequestHeader("Accept",d.dataTypes[0]&&d.accepts[d.dataTypes[0]]?d.accepts[d.dataTypes[0]]+(d.dataTypes[0]!=="*"?", "+bX+"; q=0.01":""):d.accepts["*"]);for(u in d.headers)v.setRequestHeader(u,d.headers[u]);if(d.beforeSend&&(d.beforeSend.call(e,v,d)===!1||s===2)){v.abort();return!1}for(u in{success:1,error:1,complete:1})v[u](d[u]);p=b$(bU,d,c,v);if(!p)w(-1,"No Transport");else{v.readyState=1,t&&g.trigger("ajaxSend",[v,d]),d.async&&d.timeout>0&&(q=setTimeout(function(){v.abort("timeout")},d.timeout));try{s=1,p.send(l,w)}catch(z){if(s<2)w(-1,z);else throw z}}return v},param:function(a,c){var d=[],e=function(a,b){b=f.isFunction(b)?b():b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};c===b&&(c=f.ajaxSettings.traditional);if(f.isArray(a)||a.jquery&&!f.isPlainObject(a))f.each(a,function(){e(this.name,this.value)});else for(var g in a)ca(g,a[g],c,e);return d.join("&").replace(bD,"+")}}),f.extend({active:0,lastModified:{},etag:{}});var cd=f.now(),ce=/(\=)\?(&|$)|\?\?/i;f.ajaxSetup({jsonp:"callback",jsonpCallback:function(){return f.expando+"_"+cd++}}),f.ajaxPrefilter("json jsonp",function(b,c,d){var e=b.contentType==="application/x-www-form-urlencoded"&&typeof b.data=="string";if(b.dataTypes[0]==="jsonp"||b.jsonp!==!1&&(ce.test(b.url)||e&&ce.test(b.data))){var g,h=b.jsonpCallback=f.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,i=a[h],j=b.url,k=b.data,l="$1"+h+"$2";b.jsonp!==!1&&(j=j.replace(ce,l),b.url===j&&(e&&(k=k.replace(ce,l)),b.data===k&&(j+=(/\?/.test(j)?"&":"?")+b.jsonp+"="+h))),b.url=j,b.data=k,a[h]=function(a){g=[a]},d.always(function(){a[h]=i,g&&f.isFunction(i)&&a[h](g[0])}),b.converters["script json"]=function(){g||f.error(h+" was not called");return g[0]},b.dataTypes[0]="json";return"script"}}),f.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/javascript|ecmascript/},converters:{"text script":function(a){f.globalEval(a);return a}}}),f.ajaxPrefilter("script",function(a){a.cache===b&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),f.ajaxTransport("script",function(a){if(a.crossDomain){var d,e=c.head||c.getElementsByTagName("head")[0]||c.documentElement;return{send:function(f,g){d=c.createElement("script"),d.async="async",a.scriptCharset&&(d.charset=a.scriptCharset),d.src=a.url,d.onload=d.onreadystatechange=function(a,c){if(c||!d.readyState||/loaded|complete/.test(d.readyState))d.onload=d.onreadystatechange=null,e&&d.parentNode&&e.removeChild(d),d=b,c||g(200,"success")},e.insertBefore(d,e.firstChild)},abort:function(){d&&d.onload(0,1)}}}});var cf=a.ActiveXObject?function(){for(var a in ch)ch[a](0,1)}:!1,cg=0,ch;f.ajaxSettings.xhr=a.ActiveXObject?function(){return!this.isLocal&&ci()||cj()}:ci,function(a){f.extend(f.support,{ajax:!!a,cors:!!a&&"withCredentials"in a})}(f.ajaxSettings.xhr()),f.support.ajax&&f.ajaxTransport(function(c){if(!c.crossDomain||f.support.cors){var d;return{send:function(e,g){var h=c.xhr(),i,j;c.username?h.open(c.type,c.url,c.async,c.username,c.password):h.open(c.type,c.url,c.async);if(c.xhrFields)for(j in c.xhrFields)h[j]=c.xhrFields[j];c.mimeType&&h.overrideMimeType&&h.overrideMimeType(c.mimeType),!c.crossDomain&&!e["X-Requested-With"]&&(e["X-Requested-With"]="XMLHttpRequest");try{for(j in e)h.setRequestHeader(j,e[j])}catch(k){}h.send(c.hasContent&&c.data||null),d=function(a,e){var j,k,l,m,n;try{if(d&&(e||h.readyState===4)){d=b,i&&(h.onreadystatechange=f.noop,cf&&delete ch[i]);if(e)h.readyState!==4&&h.abort();else{j=h.status,l=h.getAllResponseHeaders(),m={},n=h.responseXML,n&&n.documentElement&&(m.xml=n),m.text=h.responseText;try{k=h.statusText}catch(o){k=""}!j&&c.isLocal&&!c.crossDomain?j=m.text?200:404:j===1223&&(j=204)}}}catch(p){e||g(-1,p)}m&&g(j,k,m,l)},!c.async||h.readyState===4?d():(i=++cg,cf&&(ch||(ch={},f(a).unload(cf)),ch[i]=d),h.onreadystatechange=d)},abort:function(){d&&d(0,1)}}}});var ck={},cl,cm,cn=/^(?:toggle|show|hide)$/,co=/^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,cp,cq=[["height","marginTop","marginBottom","paddingTop","paddingBottom"],["width","marginLeft","marginRight","paddingLeft","paddingRight"],["opacity"]],cr;f.fn.extend({show:function(a,b,c){var d,e;if(a||a===0)return this.animate(cu("show",3),a,b,c);for(var g=0,h=this.length;g<h;g++)d=this[g],d.style&&(e=d.style.display,!f._data(d,"olddisplay")&&e==="none"&&(e=d.style.display=""),e===""&&f.css(d,"display")==="none"&&f._data(d,"olddisplay",cv(d.nodeName)));for(g=0;g<h;g++){d=this[g];if(d.style){e=d.style.display;if(e===""||e==="none")d.style.display=f._data(d,"olddisplay")||""}}return this},hide:function(a,b,c){if(a||a===0)return this.animate(cu("hide",3),a,b,c);var d,e,g=0,h=this.length;for(;g<h;g++)d=this[g],d.style&&(e=f.css(d,"display"),e!=="none"&&!f._data(d,"olddisplay")&&f._data(d,"olddisplay",e));for(g=0;g<h;g++)this[g].style&&(this[g].style.display="none");return this},_toggle:f.fn.toggle,toggle:function(a,b,c){var d=typeof a=="boolean";f.isFunction(a)&&f.isFunction(b)?this._toggle.apply(this,arguments):a==null||d?this.each(function(){var b=d?a:f(this).is(":hidden");f(this)[b?"show":"hide"]()}):this.animate(cu("toggle",3),a,b,c);return this},fadeTo:function(a,b,c,d){return this.filter(":hidden").css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){function g(){e.queue===!1&&f._mark(this);var b=f.extend({},e),c=this.nodeType===1,d=c&&f(this).is(":hidden"),g,h,i,j,k,l,m,n,o;b.animatedProperties={};for(i in a){g=f.camelCase(i),i!==g&&(a[g]=a[i],delete a[i]),h=a[g],f.isArray(h)?(b.animatedProperties[g]=h[1],h=a[g]=h[0]):b.animatedProperties[g]=b.specialEasing&&b.specialEasing[g]||b.easing||"swing";if(h==="hide"&&d||h==="show"&&!d)return b.complete.call(this);c&&(g==="height"||g==="width")&&(b.overflow=[this.style.overflow,this.style.overflowX,this.style.overflowY],f.css(this,"display")==="inline"&&f.css(this,"float")==="none"&&(!f.support.inlineBlockNeedsLayout||cv(this.nodeName)==="inline"?this.style.display="inline-block":this.style.zoom=1))}b.overflow!=null&&(this.style.overflow="hidden");for(i in a)j=new f.fx(this,b,i),h=a[i],cn.test(h)?(o=f._data(this,"toggle"+i)||(h==="toggle"?d?"show":"hide":0),o?(f._data(this,"toggle"+i,o==="show"?"hide":"show"),j[o]()):j[h]()):(k=co.exec(h),l=j.cur(),k?(m=parseFloat(k[2]),n=k[3]||(f.cssNumber[i]?"":"px"),n!=="px"&&(f.style(this,i,(m||1)+n),l=(m||1)/j.cur()*l,f.style(this,i,l+n)),k[1]&&(m=(k[1]==="-="?-1:1)*m+l),j.custom(l,m,n)):j.custom(l,h,""));return!0}var e=f.speed(b,c,d);if(f.isEmptyObject(a))return this.each(e.complete,[!1]);a=f.extend({},a);return e.queue===!1?this.each(g):this.queue(e.queue,g)},stop:function(a,c,d){typeof a!="string"&&(d=c,c=a,a=b),c&&a!==!1&&this.queue(a||"fx",[]);return this.each(function(){function h(a,b,c){var e=b[c];f.removeData(a,c,!0),e.stop(d)}var b,c=!1,e=f.timers,g=f._data(this);d||f._unmark(!0,this);if(a==null)for(b in g)g[b]&&g[b].stop&&b.indexOf(".run")===b.length-4&&h(this,g,b);else g[b=a+".run"]&&g[b].stop&&h(this,g,b);for(b=e.length;b--;)e[b].elem===this&&(a==null||e[b].queue===a)&&(d?e[b](!0):e[b].saveState(),c=!0,e.splice(b,1));(!d||!c)&&f.dequeue(this,a)})}}),f.each({slideDown:cu("show",1),slideUp:cu("hide",1),slideToggle:cu("toggle",1),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){f.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),f.extend({speed:function(a,b,c){var d=a&&typeof a=="object"?f.extend({},a):{complete:c||!c&&b||f.isFunction(a)&&a,duration:a,easing:c&&b||b&&!f.isFunction(b)&&b};d.duration=f.fx.off?0:typeof d.duration=="number"?d.duration:d.duration in f.fx.speeds?f.fx.speeds[d.duration]:f.fx.speeds._default;if(d.queue==null||d.queue===!0)d.queue="fx";d.old=d.complete,d.complete=function(a){f.isFunction(d.old)&&d.old.call(this),d.queue?f.dequeue(this,d.queue):a!==!1&&f._unmark(this)};return d},easing:{linear:function(a,b,c,d){return c+d*a},swing:function(a,b,c,d){return(-Math.cos(a*Math.PI)/2+.5)*d+c}},timers:[],fx:function(a,b,c){this.options=b,this.elem=a,this.prop=c,b.orig=b.orig||{}}}),f.fx.prototype={update:function(){this.options.step&&this.options.step.call(this.elem,this.now,this),(f.fx.step[this.prop]||f.fx.step._default)(this)},cur:function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null))return this.elem[this.prop];var a,b=f.css(this.elem,this.prop);return isNaN(a=parseFloat(b))?!b||b==="auto"?0:b:a},custom:function(a,c,d){function h(a){return e.step(a)}var e=this,g=f.fx;this.startTime=cr||cs(),this.end=c,this.now=this.start=a,this.pos=this.state=0,this.unit=d||this.unit||(f.cssNumber[this.prop]?"":"px"),h.queue=this.options.queue,h.elem=this.elem,h.saveState=function(){e.options.hide&&f._data(e.elem,"fxshow"+e.prop)===b&&f._data(e.elem,"fxshow"+e.prop,e.start)},h()&&f.timers.push(h)&&!cp&&(cp=setInterval(g.tick,g.interval))},show:function(){var a=f._data(this.elem,"fxshow"+this.prop);this.options.orig[this.prop]=a||f.style(this.elem,this.prop),this.options.show=!0,a!==b?this.custom(this.cur(),a):this.custom(this.prop==="width"||this.prop==="height"?1:0,this.cur()),f(this.elem).show()},hide:function(){this.options.orig[this.prop]=f._data(this.elem,"fxshow"+this.prop)||f.style(this.elem,this.prop),this.options.hide=!0,this.custom(this.cur(),0)},step:function(a){var b,c,d,e=cr||cs(),g=!0,h=this.elem,i=this.options;if(a||e>=i.duration+this.startTime){this.now=this.end,this.pos=this.state=1,this.update(),i.animatedProperties[this.prop]=!0;for(b in i.animatedProperties)i.animatedProperties[b]!==!0&&(g=!1);if(g){i.overflow!=null&&!f.support.shrinkWrapBlocks&&f.each(["","X","Y"],function(a,b){h.style["overflow"+b]=i.overflow[a]}),i.hide&&f(h).hide();if(i.hide||i.show)for(b in i.animatedProperties)f.style(h,b,i.orig[b]),f.removeData(h,"fxshow"+b,!0),f.removeData(h,"toggle"+b,!0);d=i.complete,d&&(i.complete=!1,d.call(h))}return!1}i.duration==Infinity?this.now=e:(c=e-this.startTime,this.state=c/i.duration,this.pos=f.easing[i.animatedProperties[this.prop]](this.state,c,0,1,i.duration),this.now=this.start+(this.end-this.start)*this.pos),this.update();return!0}},f.extend(f.fx,{tick:function(){var a,b=f.timers,c=0;for(;c<b.length;c++)a=b[c],!a()&&b[c]===a&&b.splice(c--,1);b.length||f.fx.stop()},interval:13,stop:function(){clearInterval(cp),cp=null},speeds:{slow:600,fast:200,_default:400},step:{opacity:function(a){f.style(a.elem,"opacity",a.now)},_default:function(a){a.elem.style&&a.elem.style[a.prop]!=null?a.elem.style[a.prop]=a.now+a.unit:a.elem[a.prop]=a.now}}}),f.each(["width","height"],function(a,b){f.fx.step[b]=function(a){f.style(a.elem,b,Math.max(0,a.now)+a.unit)}}),f.expr&&f.expr.filters&&(f.expr.filters.animated=function(a){return f.grep(f.timers,function(b){return a===b.elem}).length});var cw=/^t(?:able|d|h)$/i,cx=/^(?:body|html)$/i;"getBoundingClientRect"in c.documentElement?f.fn.offset=function(a){var b=this[0],c;if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);try{c=b.getBoundingClientRect()}catch(d){}var e=b.ownerDocument,g=e.documentElement;if(!c||!f.contains(g,b))return c?{top:c.top,left:c.left}:{top:0,left:0};var h=e.body,i=cy(e),j=g.clientTop||h.clientTop||0,k=g.clientLeft||h.clientLeft||0,l=i.pageYOffset||f.support.boxModel&&g.scrollTop||h.scrollTop,m=i.pageXOffset||f.support.boxModel&&g.scrollLeft||h.scrollLeft,n=c.top+l-j,o=c.left+m-k;return{top:n,left:o}}:f.fn.offset=function(a){var b=this[0];if(a)return this.each(function(b){f.offset.setOffset(this,a,b)});if(!b||!b.ownerDocument)return null;if(b===b.ownerDocument.body)return f.offset.bodyOffset(b);var c,d=b.offsetParent,e=b,g=b.ownerDocument,h=g.documentElement,i=g.body,j=g.defaultView,k=j?j.getComputedStyle(b,null):b.currentStyle,l=b.offsetTop,m=b.offsetLeft;while((b=b.parentNode)&&b!==i&&b!==h){if(f.support.fixedPosition&&k.position==="fixed")break;c=j?j.getComputedStyle(b,null):b.currentStyle,l-=b.scrollTop,m-=b.scrollLeft,b===d&&(l+=b.offsetTop,m+=b.offsetLeft,f.support.doesNotAddBorder&&(!f.support.doesAddBorderForTableAndCells||!cw.test(b.nodeName))&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),e=d,d=b.offsetParent),f.support.subtractsBorderForOverflowNotVisible&&c.overflow!=="visible"&&(l+=parseFloat(c.borderTopWidth)||0,m+=parseFloat(c.borderLeftWidth)||0),k=c}if(k.position==="relative"||k.position==="static")l+=i.offsetTop,m+=i.offsetLeft;f.support.fixedPosition&&k.position==="fixed"&&(l+=Math.max(h.scrollTop,i.scrollTop),m+=Math.max(h.scrollLeft,i.scrollLeft));return{top:l,left:m}},f.offset={bodyOffset:function(a){var b=a.offsetTop,c=a.offsetLeft;f.support.doesNotIncludeMarginInBodyOffset&&(b+=parseFloat(f.css(a,"marginTop"))||0,c+=parseFloat(f.css(a,"marginLeft"))||0);return{top:b,left:c}},setOffset:function(a,b,c){var d=f.css(a,"position");d==="static"&&(a.style.position="relative");var e=f(a),g=e.offset(),h=f.css(a,"top"),i=f.css(a,"left"),j=(d==="absolute"||d==="fixed")&&f.inArray("auto",[h,i])>-1,k={},l={},m,n;j?(l=e.position(),m=l.top,n=l.left):(m=parseFloat(h)||0,n=parseFloat(i)||0),f.isFunction(b)&&(b=b.call(a,c,g)),b.top!=null&&(k.top=b.top-g.top+m),b.left!=null&&(k.left=b.left-g.left+n),"using"in b?b.using.call(a,k):e.css(k)}},f.fn.extend({position:function(){if(!this[0])return null;var a=this[0],b=this.offsetParent(),c=this.offset(),d=cx.test(b[0].nodeName)?{top:0,left:0}:b.offset();c.top-=parseFloat(f.css(a,"marginTop"))||0,c.left-=parseFloat(f.css(a,"marginLeft"))||0,d.top+=parseFloat(f.css(b[0],"borderTopWidth"))||0,d.left+=parseFloat(f.css(b[0],"borderLeftWidth"))||0;return{top:c.top-d.top,left:c.left-d.left}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||c.body;while(a&&!cx.test(a.nodeName)&&f.css(a,"position")==="static")a=a.offsetParent;return a})}}),f.each(["Left","Top"],function(a,c){var d="scroll"+c;f.fn[d]=function(c){var e,g;if(c===b){e=this[0];if(!e)return null;g=cy(e);return g?"pageXOffset"in g?g[a?"pageYOffset":"pageXOffset"]:f.support.boxModel&&g.document.documentElement[d]||g.document.body[d]:e[d]}return this.each(function(){g=cy(this),g?g.scrollTo(a?f(g).scrollLeft():c,a?c:f(g).scrollTop()):this[d]=c})}}),f.each(["Height","Width"],function(a,c){var d=c.toLowerCase();f.fn["inner"+c]=function(){var a=this[0];return a?a.style?parseFloat(f.css(a,d,"padding")):this[d]():null},f.fn["outer"+c]=function(a){var b=this[0];return b?b.style?parseFloat(f.css(b,d,a?"margin":"border")):this[d]():null},f.fn[d]=function(a){var e=this[0];if(!e)return a==null?null:this;if(f.isFunction(a))return this.each(function(b){var c=f(this);c[d](a.call(this,b,c[d]()))});if(f.isWindow(e)){var g=e.document.documentElement["client"+c],h=e.document.body;return e.document.compatMode==="CSS1Compat"&&g||h&&h["client"+c]||g}if(e.nodeType===9)return Math.max(e.documentElement["client"+c],e.body["scroll"+c],e.documentElement["scroll"+c],e.body["offset"+c],e.documentElement["offset"+c]);if(a===b){var i=f.css(e,d),j=parseFloat(i);return f.isNumeric(j)?j:i}return this.css(d,typeof a=="string"?a:a+"px")}}),a.jQuery=a.$=f,typeof define=="function"&&define.amd&&define.amd.jQuery&&define("jquery",[],function(){return f})})(window);
/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2009 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 5/25/2009
 * @author Ariel Flesler
 * @version 1.4.2
 *
 * http://flesler.blogspot.com/2007/10/jqueryscrollto.html
 */
;(function(d){var k=d.scrollTo=function(a,i,e){d(window).scrollTo(a,i,e)};k.defaults={axis:'xy',duration:parseFloat(d.fn.jquery)>=1.3?0:1};k.window=function(a){return d(window)._scrollable()};d.fn._scrollable=function(){return this.map(function(){var a=this,i=!a.nodeName||d.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!=-1;if(!i)return a;var e=(a.contentWindow||a).document||a.ownerDocument||a;return d.browser.safari||e.compatMode=='BackCompat'?e.body:e.documentElement})};d.fn.scrollTo=function(n,j,b){if(typeof j=='object'){b=j;j=0}if(typeof b=='function')b={onAfter:b};if(n=='max')n=9e9;b=d.extend({},k.defaults,b);j=j||b.speed||b.duration;b.queue=b.queue&&b.axis.length>1;if(b.queue)j/=2;b.offset=p(b.offset);b.over=p(b.over);return this._scrollable().each(function(){var q=this,r=d(q),f=n,s,g={},u=r.is('html,body');switch(typeof f){case'number':case'string':if(/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(f)){f=p(f);break}f=d(f,this);case'object':if(f.is||f.style)s=(f=d(f)).offset()}d.each(b.axis.split(''),function(a,i){var e=i=='x'?'Left':'Top',h=e.toLowerCase(),c='scroll'+e,l=q[c],m=k.max(q,i);if(s){g[c]=s[h]+(u?0:l-r.offset()[h]);if(b.margin){g[c]-=parseInt(f.css('margin'+e))||0;g[c]-=parseInt(f.css('border'+e+'Width'))||0}g[c]+=b.offset[h]||0;if(b.over[h])g[c]+=f[i=='x'?'width':'height']()*b.over[h]}else{var o=f[h];g[c]=o.slice&&o.slice(-1)=='%'?parseFloat(o)/100*m:o}if(/^\d+$/.test(g[c]))g[c]=g[c]<=0?0:Math.min(g[c],m);if(!a&&b.queue){if(l!=g[c])t(b.onAfterFirst);delete g[c]}});t(b.onAfter);function t(a){r.animate(g,j,b.easing,a&&function(){a.call(this,n,b)})}}).end()};k.max=function(a,i){var e=i=='x'?'Width':'Height',h='scroll'+e;if(!d(a).is('html,body'))return a[h]-d(a)[e.toLowerCase()]();var c='client'+e,l=a.ownerDocument.documentElement,m=a.ownerDocument.body;return Math.max(l[h],m[h])-Math.min(l[c],m[c])};function p(a){return typeof a=='object'?a:{top:a,left:a}}})(jQuery);
/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.core.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){function c(b,c){var e=b.nodeName.toLowerCase();if("area"===e){var f=b.parentNode,g=f.name,h;return!b.href||!g||f.nodeName.toLowerCase()!=="map"?!1:(h=a("img[usemap=#"+g+"]")[0],!!h&&d(h))}return(/input|select|textarea|button|object/.test(e)?!b.disabled:"a"==e?b.href||c:c)&&d(b)}function d(b){return!a(b).parents().andSelf().filter(function(){return a.curCSS(this,"visibility")==="hidden"||a.expr.filters.hidden(this)}).length}a.ui=a.ui||{};if(a.ui.version)return;a.extend(a.ui,{version:"1.8.21",keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91}}),a.fn.extend({propAttr:a.fn.prop||a.fn.attr,_focus:a.fn.focus,focus:function(b,c){return typeof b=="number"?this.each(function(){var d=this;setTimeout(function(){a(d).focus(),c&&c.call(d)},b)}):this._focus.apply(this,arguments)},scrollParent:function(){var b;return a.browser.msie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?b=this.parents().filter(function(){return/(relative|absolute|fixed)/.test(a.curCSS(this,"position",1))&&/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0):b=this.parents().filter(function(){return/(auto|scroll)/.test(a.curCSS(this,"overflow",1)+a.curCSS(this,"overflow-y",1)+a.curCSS(this,"overflow-x",1))}).eq(0),/fixed/.test(this.css("position"))||!b.length?a(document):b},zIndex:function(c){if(c!==b)return this.css("zIndex",c);if(this.length){var d=a(this[0]),e,f;while(d.length&&d[0]!==document){e=d.css("position");if(e==="absolute"||e==="relative"||e==="fixed"){f=parseInt(d.css("zIndex"),10);if(!isNaN(f)&&f!==0)return f}d=d.parent()}}return 0},disableSelection:function(){return this.bind((a.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(a){a.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),a.each(["Width","Height"],function(c,d){function h(b,c,d,f){return a.each(e,function(){c-=parseFloat(a.curCSS(b,"padding"+this,!0))||0,d&&(c-=parseFloat(a.curCSS(b,"border"+this+"Width",!0))||0),f&&(c-=parseFloat(a.curCSS(b,"margin"+this,!0))||0)}),c}var e=d==="Width"?["Left","Right"]:["Top","Bottom"],f=d.toLowerCase(),g={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};a.fn["inner"+d]=function(c){return c===b?g["inner"+d].call(this):this.each(function(){a(this).css(f,h(this,c)+"px")})},a.fn["outer"+d]=function(b,c){return typeof b!="number"?g["outer"+d].call(this,b):this.each(function(){a(this).css(f,h(this,b,!0,c)+"px")})}}),a.extend(a.expr[":"],{data:function(b,c,d){return!!a.data(b,d[3])},focusable:function(b){return c(b,!isNaN(a.attr(b,"tabindex")))},tabbable:function(b){var d=a.attr(b,"tabindex"),e=isNaN(d);return(e||d>=0)&&c(b,!e)}}),a(function(){var b=document.body,c=b.appendChild(c=document.createElement("div"));c.offsetHeight,a.extend(c.style,{minHeight:"100px",height:"auto",padding:0,borderWidth:0}),a.support.minHeight=c.offsetHeight===100,a.support.selectstart="onselectstart"in c,b.removeChild(c).style.display="none"}),a.extend(a.ui,{plugin:{add:function(b,c,d){var e=a.ui[b].prototype;for(var f in d)e.plugins[f]=e.plugins[f]||[],e.plugins[f].push([c,d[f]])},call:function(a,b,c){var d=a.plugins[b];if(!d||!a.element[0].parentNode)return;for(var e=0;e<d.length;e++)a.options[d[e][0]]&&d[e][1].apply(a.element,c)}},contains:function(a,b){return document.compareDocumentPosition?a.compareDocumentPosition(b)&16:a!==b&&a.contains(b)},hasScroll:function(b,c){if(a(b).css("overflow")==="hidden")return!1;var d=c&&c==="left"?"scrollLeft":"scrollTop",e=!1;return b[d]>0?!0:(b[d]=1,e=b[d]>0,b[d]=0,e)},isOverAxis:function(a,b,c){return a>b&&a<b+c},isOver:function(b,c,d,e,f,g){return a.ui.isOverAxis(b,d,f)&&a.ui.isOverAxis(c,e,g)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.widget.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){if(a.cleanData){var c=a.cleanData;a.cleanData=function(b){for(var d=0,e;(e=b[d])!=null;d++)try{a(e).triggerHandler("remove")}catch(f){}c(b)}}else{var d=a.fn.remove;a.fn.remove=function(b,c){return this.each(function(){return c||(!b||a.filter(b,[this]).length)&&a("*",this).add([this]).each(function(){try{a(this).triggerHandler("remove")}catch(b){}}),d.call(a(this),b,c)})}}a.widget=function(b,c,d){var e=b.split(".")[0],f;b=b.split(".")[1],f=e+"-"+b,d||(d=c,c=a.Widget),a.expr[":"][f]=function(c){return!!a.data(c,b)},a[e]=a[e]||{},a[e][b]=function(a,b){arguments.length&&this._createWidget(a,b)};var g=new c;g.options=a.extend(!0,{},g.options),a[e][b].prototype=a.extend(!0,g,{namespace:e,widgetName:b,widgetEventPrefix:a[e][b].prototype.widgetEventPrefix||b,widgetBaseClass:f},d),a.widget.bridge(b,a[e][b])},a.widget.bridge=function(c,d){a.fn[c]=function(e){var f=typeof e=="string",g=Array.prototype.slice.call(arguments,1),h=this;return e=!f&&g.length?a.extend.apply(null,[!0,e].concat(g)):e,f&&e.charAt(0)==="_"?h:(f?this.each(function(){var d=a.data(this,c),f=d&&a.isFunction(d[e])?d[e].apply(d,g):d;if(f!==d&&f!==b)return h=f,!1}):this.each(function(){var b=a.data(this,c);b?b.option(e||{})._init():a.data(this,c,new d(e,this))}),h)}},a.Widget=function(a,b){arguments.length&&this._createWidget(a,b)},a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",options:{disabled:!1},_createWidget:function(b,c){a.data(c,this.widgetName,this),this.element=a(c),this.options=a.extend(!0,{},this.options,this._getCreateOptions(),b);var d=this;this.element.bind("remove."+this.widgetName,function(){d.destroy()}),this._create(),this._trigger("create"),this._init()},_getCreateOptions:function(){return a.metadata&&a.metadata.get(this.element[0])[this.widgetName]},_create:function(){},_init:function(){},destroy:function(){this.element.unbind("."+this.widgetName).removeData(this.widgetName),this.widget().unbind("."+this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass+"-disabled "+"ui-state-disabled")},widget:function(){return this.element},option:function(c,d){var e=c;if(arguments.length===0)return a.extend({},this.options);if(typeof c=="string"){if(d===b)return this.options[c];e={},e[c]=d}return this._setOptions(e),this},_setOptions:function(b){var c=this;return a.each(b,function(a,b){c._setOption(a,b)}),this},_setOption:function(a,b){return this.options[a]=b,a==="disabled"&&this.widget()[b?"addClass":"removeClass"](this.widgetBaseClass+"-disabled"+" "+"ui-state-disabled").attr("aria-disabled",b),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_trigger:function(b,c,d){var e,f,g=this.options[b];d=d||{},c=a.Event(c),c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase(),c.target=this.element[0],f=c.originalEvent;if(f)for(e in f)e in c||(c[e]=f[e]);return this.element.trigger(c,d),!(a.isFunction(g)&&g.call(this.element[0],c,d)===!1||c.isDefaultPrevented())}}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.mouse.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){var c=!1;a(document).mouseup(function(a){c=!1}),a.widget("ui.mouse",{options:{cancel:":input,option",distance:1,delay:0},_mouseInit:function(){var b=this;this.element.bind("mousedown."+this.widgetName,function(a){return b._mouseDown(a)}).bind("click."+this.widgetName,function(c){if(!0===a.data(c.target,b.widgetName+".preventClickEvent"))return a.removeData(c.target,b.widgetName+".preventClickEvent"),c.stopImmediatePropagation(),!1}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(b){if(c)return;this._mouseStarted&&this._mouseUp(b),this._mouseDownEvent=b;var d=this,e=b.which==1,f=typeof this.options.cancel=="string"&&b.target.nodeName?a(b.target).closest(this.options.cancel).length:!1;if(!e||f||!this._mouseCapture(b))return!0;this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){d.mouseDelayMet=!0},this.options.delay));if(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)){this._mouseStarted=this._mouseStart(b)!==!1;if(!this._mouseStarted)return b.preventDefault(),!0}return!0===a.data(b.target,this.widgetName+".preventClickEvent")&&a.removeData(b.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(a){return d._mouseMove(a)},this._mouseUpDelegate=function(a){return d._mouseUp(a)},a(document).bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),b.preventDefault(),c=!0,!0},_mouseMove:function(b){return!a.browser.msie||document.documentMode>=9||!!b.button?this._mouseStarted?(this._mouseDrag(b),b.preventDefault()):(this._mouseDistanceMet(b)&&this._mouseDelayMet(b)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,b)!==!1,this._mouseStarted?this._mouseDrag(b):this._mouseUp(b)),!this._mouseStarted):this._mouseUp(b)},_mouseUp:function(b){return a(document).unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,b.target==this._mouseDownEvent.target&&a.data(b.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(b)),!1},_mouseDistanceMet:function(a){return Math.max(Math.abs(this._mouseDownEvent.pageX-a.pageX),Math.abs(this._mouseDownEvent.pageY-a.pageY))>=this.options.distance},_mouseDelayMet:function(a){return this.mouseDelayMet},_mouseStart:function(a){},_mouseDrag:function(a){},_mouseStop:function(a){},_mouseCapture:function(a){return!0}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.position.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.ui=a.ui||{};var c=/left|center|right/,d=/top|center|bottom/,e="center",f={},g=a.fn.position,h=a.fn.offset;a.fn.position=function(b){if(!b||!b.of)return g.apply(this,arguments);b=a.extend({},b);var h=a(b.of),i=h[0],j=(b.collision||"flip").split(" "),k=b.offset?b.offset.split(" "):[0,0],l,m,n;return i.nodeType===9?(l=h.width(),m=h.height(),n={top:0,left:0}):i.setTimeout?(l=h.width(),m=h.height(),n={top:h.scrollTop(),left:h.scrollLeft()}):i.preventDefault?(b.at="left top",l=m=0,n={top:b.of.pageY,left:b.of.pageX}):(l=h.outerWidth(),m=h.outerHeight(),n=h.offset()),a.each(["my","at"],function(){var a=(b[this]||"").split(" ");a.length===1&&(a=c.test(a[0])?a.concat([e]):d.test(a[0])?[e].concat(a):[e,e]),a[0]=c.test(a[0])?a[0]:e,a[1]=d.test(a[1])?a[1]:e,b[this]=a}),j.length===1&&(j[1]=j[0]),k[0]=parseInt(k[0],10)||0,k.length===1&&(k[1]=k[0]),k[1]=parseInt(k[1],10)||0,b.at[0]==="right"?n.left+=l:b.at[0]===e&&(n.left+=l/2),b.at[1]==="bottom"?n.top+=m:b.at[1]===e&&(n.top+=m/2),n.left+=k[0],n.top+=k[1],this.each(function(){var c=a(this),d=c.outerWidth(),g=c.outerHeight(),h=parseInt(a.curCSS(this,"marginLeft",!0))||0,i=parseInt(a.curCSS(this,"marginTop",!0))||0,o=d+h+(parseInt(a.curCSS(this,"marginRight",!0))||0),p=g+i+(parseInt(a.curCSS(this,"marginBottom",!0))||0),q=a.extend({},n),r;b.my[0]==="right"?q.left-=d:b.my[0]===e&&(q.left-=d/2),b.my[1]==="bottom"?q.top-=g:b.my[1]===e&&(q.top-=g/2),f.fractions||(q.left=Math.round(q.left),q.top=Math.round(q.top)),r={left:q.left-h,top:q.top-i},a.each(["left","top"],function(c,e){a.ui.position[j[c]]&&a.ui.position[j[c]][e](q,{targetWidth:l,targetHeight:m,elemWidth:d,elemHeight:g,collisionPosition:r,collisionWidth:o,collisionHeight:p,offset:k,my:b.my,at:b.at})}),a.fn.bgiframe&&c.bgiframe(),c.offset(a.extend(q,{using:b.using}))})},a.ui.position={fit:{left:function(b,c){var d=a(window),e=c.collisionPosition.left+c.collisionWidth-d.width()-d.scrollLeft();b.left=e>0?b.left-e:Math.max(b.left-c.collisionPosition.left,b.left)},top:function(b,c){var d=a(window),e=c.collisionPosition.top+c.collisionHeight-d.height()-d.scrollTop();b.top=e>0?b.top-e:Math.max(b.top-c.collisionPosition.top,b.top)}},flip:{left:function(b,c){if(c.at[0]===e)return;var d=a(window),f=c.collisionPosition.left+c.collisionWidth-d.width()-d.scrollLeft(),g=c.my[0]==="left"?-c.elemWidth:c.my[0]==="right"?c.elemWidth:0,h=c.at[0]==="left"?c.targetWidth:-c.targetWidth,i=-2*c.offset[0];b.left+=c.collisionPosition.left<0?g+h+i:f>0?g+h+i:0},top:function(b,c){if(c.at[1]===e)return;var d=a(window),f=c.collisionPosition.top+c.collisionHeight-d.height()-d.scrollTop(),g=c.my[1]==="top"?-c.elemHeight:c.my[1]==="bottom"?c.elemHeight:0,h=c.at[1]==="top"?c.targetHeight:-c.targetHeight,i=-2*c.offset[1];b.top+=c.collisionPosition.top<0?g+h+i:f>0?g+h+i:0}}},a.offset.setOffset||(a.offset.setOffset=function(b,c){/static/.test(a.curCSS(b,"position"))&&(b.style.position="relative");var d=a(b),e=d.offset(),f=parseInt(a.curCSS(b,"top",!0),10)||0,g=parseInt(a.curCSS(b,"left",!0),10)||0,h={top:c.top-e.top+f,left:c.left-e.left+g};"using"in c?c.using.call(b,h):d.css(h)},a.fn.offset=function(b){var c=this[0];return!c||!c.ownerDocument?null:b?a.isFunction(b)?this.each(function(c){a(this).offset(b.call(this,c,a(this).offset()))}):this.each(function(){a.offset.setOffset(this,b)}):h.call(this)}),function(){var b=document.getElementsByTagName("body")[0],c=document.createElement("div"),d,e,g,h,i;d=document.createElement(b?"div":"body"),g={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},b&&a.extend(g,{position:"absolute",left:"-1000px",top:"-1000px"});for(var j in g)d.style[j]=g[j];d.appendChild(c),e=b||document.documentElement,e.insertBefore(d,e.firstChild),c.style.cssText="position: absolute; left: 10.7432222px; top: 10.432325px; height: 30px; width: 201px;",h=a(c).offset(function(a,b){return b}).offset(),d.innerHTML="",e.removeChild(d),i=h.top+h.left+(b?2e3:0),f.fractions=i>21&&i<22}()})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.draggable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.draggable",a.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position"))&&(this.element[0].style.position="relative"),this.options.addClasses&&this.element.addClass("ui-draggable"),this.options.disabled&&this.element.addClass("ui-draggable-disabled"),this._mouseInit()},destroy:function(){if(!this.element.data("draggable"))return;return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy(),this},_mouseCapture:function(b){var c=this.options;return this.helper||c.disabled||a(b.target).is(".ui-resizable-handle")?!1:(this.handle=this._getHandle(b),this.handle?(c.iframeFix&&a(c.iframeFix===!0?"iframe":c.iframeFix).each(function(){a('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1e3}).css(a(this).offset()).appendTo("body")}),!0):!1)},_mouseStart:function(b){var c=this.options;return this.helper=this._createHelper(b),this.helper.addClass("ui-draggable-dragging"),this._cacheHelperProportions(),a.ui.ddmanager&&(a.ui.ddmanager.current=this),this._cacheMargins(),this.cssPosition=this.helper.css("position"),this.scrollParent=this.helper.scrollParent(),this.offset=this.positionAbs=this.element.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},a.extend(this.offset,{click:{left:b.pageX-this.offset.left,top:b.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.originalPosition=this.position=this._generatePosition(b),this.originalPageX=b.pageX,this.originalPageY=b.pageY,c.cursorAt&&this._adjustOffsetFromHelper(c.cursorAt),c.containment&&this._setContainment(),this._trigger("start",b)===!1?(this._clear(),!1):(this._cacheHelperProportions(),a.ui.ddmanager&&!c.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,b),this._mouseDrag(b,!0),a.ui.ddmanager&&a.ui.ddmanager.dragStart(this,b),!0)},_mouseDrag:function(b,c){this.position=this._generatePosition(b),this.positionAbs=this._convertPositionTo("absolute");if(!c){var d=this._uiHash();if(this._trigger("drag",b,d)===!1)return this._mouseUp({}),!1;this.position=d.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";return a.ui.ddmanager&&a.ui.ddmanager.drag(this,b),!1},_mouseStop:function(b){var c=!1;a.ui.ddmanager&&!this.options.dropBehaviour&&(c=a.ui.ddmanager.drop(this,b)),this.dropped&&(c=this.dropped,this.dropped=!1);var d=this.element[0],e=!1;while(d&&(d=d.parentNode))d==document&&(e=!0);if(!e&&this.options.helper==="original")return!1;if(this.options.revert=="invalid"&&!c||this.options.revert=="valid"&&c||this.options.revert===!0||a.isFunction(this.options.revert)&&this.options.revert.call(this.element,c)){var f=this;a(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){f._trigger("stop",b)!==!1&&f._clear()})}else this._trigger("stop",b)!==!1&&this._clear();return!1},_mouseUp:function(b){return this.options.iframeFix===!0&&a("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)}),a.ui.ddmanager&&a.ui.ddmanager.dragStop(this,b),a.ui.mouse.prototype._mouseUp.call(this,b)},cancel:function(){return this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear(),this},_getHandle:function(b){var c=!this.options.handle||!a(this.options.handle,this.element).length?!0:!1;return a(this.options.handle,this.element).find("*").andSelf().each(function(){this==b.target&&(c=!0)}),c},_createHelper:function(b){var c=this.options,d=a.isFunction(c.helper)?a(c.helper.apply(this.element[0],[b])):c.helper=="clone"?this.element.clone().removeAttr("id"):this.element;return d.parents("body").length||d.appendTo(c.appendTo=="parent"?this.element[0].parentNode:c.appendTo),d[0]!=this.element[0]&&!/(fixed|absolute)/.test(d.css("position"))&&d.css("position","absolute"),d},_adjustOffsetFromHelper:function(b){typeof b=="string"&&(b=b.split(" ")),a.isArray(b)&&(b={left:+b[0],top:+b[1]||0}),"left"in b&&(this.offset.click.left=b.left+this.margins.left),"right"in b&&(this.offset.click.left=this.helperProportions.width-b.right+this.margins.left),"top"in b&&(this.offset.click.top=b.top+this.margins.top),"bottom"in b&&(this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var b=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(b.left+=this.scrollParent.scrollLeft(),b.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)b={top:0,left:0};return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.element.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var b=this.options;b.containment=="parent"&&(b.containment=this.helper[0].parentNode);if(b.containment=="document"||b.containment=="window")this.containment=[b.containment=="document"?0:a(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,b.containment=="document"?0:a(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(b.containment=="document"?0:a(window).scrollLeft())+a(b.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(b.containment=="document"?0:a(window).scrollTop())+(a(b.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(b.containment)&&b.containment.constructor!=Array){var c=a(b.containment),d=c[0];if(!d)return;var e=c.offset(),f=a(d).css("overflow")!="hidden";this.containment=[(parseInt(a(d).css("borderLeftWidth"),10)||0)+(parseInt(a(d).css("paddingLeft"),10)||0),(parseInt(a(d).css("borderTopWidth"),10)||0)+(parseInt(a(d).css("paddingTop"),10)||0),(f?Math.max(d.scrollWidth,d.offsetWidth):d.offsetWidth)-(parseInt(a(d).css("borderLeftWidth"),10)||0)-(parseInt(a(d).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(f?Math.max(d.scrollHeight,d.offsetHeight):d.offsetHeight)-(parseInt(a(d).css("borderTopWidth"),10)||0)-(parseInt(a(d).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom],this.relative_container=c}else b.containment.constructor==Array&&(this.containment=b.containment)},_convertPositionTo:function(b,c){c||(c=this.position);var d=b=="absolute"?1:-1,e=this.options,f=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=/(html|body)/i.test(f[0].tagName);return{top:c.top+this.offset.relative.top*d+this.offset.parent.top*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():g?0:f.scrollTop())*d),left:c.left+this.offset.relative.left*d+this.offset.parent.left*d-(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:f.scrollLeft())*d)}},_generatePosition:function(b){var c=this.options,d=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(d[0].tagName),f=b.pageX,g=b.pageY;if(this.originalPosition){var h;if(this.containment){if(this.relative_container){var i=this.relative_container.offset();h=[this.containment[0]+i.left,this.containment[1]+i.top,this.containment[2]+i.left,this.containment[3]+i.top]}else h=this.containment;b.pageX-this.offset.click.left<h[0]&&(f=h[0]+this.offset.click.left),b.pageY-this.offset.click.top<h[1]&&(g=h[1]+this.offset.click.top),b.pageX-this.offset.click.left>h[2]&&(f=h[2]+this.offset.click.left),b.pageY-this.offset.click.top>h[3]&&(g=h[3]+this.offset.click.top)}if(c.grid){var j=c.grid[1]?this.originalPageY+Math.round((g-this.originalPageY)/c.grid[1])*c.grid[1]:this.originalPageY;g=h?j-this.offset.click.top<h[1]||j-this.offset.click.top>h[3]?j-this.offset.click.top<h[1]?j+c.grid[1]:j-c.grid[1]:j:j;var k=c.grid[0]?this.originalPageX+Math.round((f-this.originalPageX)/c.grid[0])*c.grid[0]:this.originalPageX;f=h?k-this.offset.click.left<h[0]||k-this.offset.click.left>h[2]?k-this.offset.click.left<h[0]?k+c.grid[0]:k-c.grid[0]:k:k}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:d.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&a.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:d.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging"),this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove(),this.helper=null,this.cancelHelperRemoval=!1},_trigger:function(b,c,d){return d=d||this._uiHash(),a.ui.plugin.call(this,b,[c,d]),b=="drag"&&(this.positionAbs=this._convertPositionTo("absolute")),a.Widget.prototype._trigger.call(this,b,c,d)},plugins:{},_uiHash:function(a){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}}),a.extend(a.ui.draggable,{version:"1.8.21"}),a.ui.plugin.add("draggable","connectToSortable",{start:function(b,c){var d=a(this).data("draggable"),e=d.options,f=a.extend({},c,{item:d.element});d.sortables=[],a(e.connectToSortable).each(function(){var c=a.data(this,"sortable");c&&!c.options.disabled&&(d.sortables.push({instance:c,shouldRevert:c.options.revert}),c.refreshPositions(),c._trigger("activate",b,f))})},stop:function(b,c){var d=a(this).data("draggable"),e=a.extend({},c,{item:d.element});a.each(d.sortables,function(){this.instance.isOver?(this.instance.isOver=0,d.cancelHelperRemoval=!0,this.instance.cancelHelperRemoval=!1,this.shouldRevert&&(this.instance.options.revert=!0),this.instance._mouseStop(b),this.instance.options.helper=this.instance.options._helper,d.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})):(this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",b,e))})},drag:function(b,c){var d=a(this).data("draggable"),e=this,f=function(b){var c=this.offset.click.top,d=this.offset.click.left,e=this.positionAbs.top,f=this.positionAbs.left,g=b.height,h=b.width,i=b.top,j=b.left;return a.ui.isOver(e+c,f+d,i,j,g,h)};a.each(d.sortables,function(f){this.instance.positionAbs=d.positionAbs,this.instance.helperProportions=d.helperProportions,this.instance.offset.click=d.offset.click,this.instance._intersectsWith(this.instance.containerCache)?(this.instance.isOver||(this.instance.isOver=1,this.instance.currentItem=a(e).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,this.instance.options.helper=function(){return c.helper[0]},b.target=this.instance.currentItem[0],this.instance._mouseCapture(b,!0),this.instance._mouseStart(b,!0,!0),this.instance.offset.click.top=d.offset.click.top,this.instance.offset.click.left=d.offset.click.left,this.instance.offset.parent.left-=d.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=d.offset.parent.top-this.instance.offset.parent.top,d._trigger("toSortable",b),d.dropped=this.instance.element,d.currentItem=d.element,this.instance.fromOutside=d),this.instance.currentItem&&this.instance._mouseDrag(b)):this.instance.isOver&&(this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",b,this.instance._uiHash(this.instance)),this.instance._mouseStop(b,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),d._trigger("fromSortable",b),d.dropped=!1)})}}),a.ui.plugin.add("draggable","cursor",{start:function(b,c){var d=a("body"),e=a(this).data("draggable").options;d.css("cursor")&&(e._cursor=d.css("cursor")),d.css("cursor",e.cursor)},stop:function(b,c){var d=a(this).data("draggable").options;d._cursor&&a("body").css("cursor",d._cursor)}}),a.ui.plugin.add("draggable","opacity",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("opacity")&&(e._opacity=d.css("opacity")),d.css("opacity",e.opacity)},stop:function(b,c){var d=a(this).data("draggable").options;d._opacity&&a(c.helper).css("opacity",d._opacity)}}),a.ui.plugin.add("draggable","scroll",{start:function(b,c){var d=a(this).data("draggable");d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"&&(d.overflowOffset=d.scrollParent.offset())},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=!1;if(d.scrollParent[0]!=document&&d.scrollParent[0].tagName!="HTML"){if(!e.axis||e.axis!="x")d.overflowOffset.top+d.scrollParent[0].offsetHeight-b.pageY<e.scrollSensitivity?d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop+e.scrollSpeed:b.pageY-d.overflowOffset.top<e.scrollSensitivity&&(d.scrollParent[0].scrollTop=f=d.scrollParent[0].scrollTop-e.scrollSpeed);if(!e.axis||e.axis!="y")d.overflowOffset.left+d.scrollParent[0].offsetWidth-b.pageX<e.scrollSensitivity?d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft+e.scrollSpeed:b.pageX-d.overflowOffset.left<e.scrollSensitivity&&(d.scrollParent[0].scrollLeft=f=d.scrollParent[0].scrollLeft-e.scrollSpeed)}else{if(!e.axis||e.axis!="x")b.pageY-a(document).scrollTop()<e.scrollSensitivity?f=a(document).scrollTop(a(document).scrollTop()-e.scrollSpeed):a(window).height()-(b.pageY-a(document).scrollTop())<e.scrollSensitivity&&(f=a(document).scrollTop(a(document).scrollTop()+e.scrollSpeed));if(!e.axis||e.axis!="y")b.pageX-a(document).scrollLeft()<e.scrollSensitivity?f=a(document).scrollLeft(a(document).scrollLeft()-e.scrollSpeed):a(window).width()-(b.pageX-a(document).scrollLeft())<e.scrollSensitivity&&(f=a(document).scrollLeft(a(document).scrollLeft()+e.scrollSpeed))}f!==!1&&a.ui.ddmanager&&!e.dropBehaviour&&a.ui.ddmanager.prepareOffsets(d,b)}}),a.ui.plugin.add("draggable","snap",{start:function(b,c){var d=a(this).data("draggable"),e=d.options;d.snapElements=[],a(e.snap.constructor!=String?e.snap.items||":data(draggable)":e.snap).each(function(){var b=a(this),c=b.offset();this!=d.element[0]&&d.snapElements.push({item:this,width:b.outerWidth(),height:b.outerHeight(),top:c.top,left:c.left})})},drag:function(b,c){var d=a(this).data("draggable"),e=d.options,f=e.snapTolerance,g=c.offset.left,h=g+d.helperProportions.width,i=c.offset.top,j=i+d.helperProportions.height;for(var k=d.snapElements.length-1;k>=0;k--){var l=d.snapElements[k].left,m=l+d.snapElements[k].width,n=d.snapElements[k].top,o=n+d.snapElements[k].height;if(!(l-f<g&&g<m+f&&n-f<i&&i<o+f||l-f<g&&g<m+f&&n-f<j&&j<o+f||l-f<h&&h<m+f&&n-f<i&&i<o+f||l-f<h&&h<m+f&&n-f<j&&j<o+f)){d.snapElements[k].snapping&&d.options.snap.release&&d.options.snap.release.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=!1;continue}if(e.snapMode!="inner"){var p=Math.abs(n-j)<=f,q=Math.abs(o-i)<=f,r=Math.abs(l-h)<=f,s=Math.abs(m-g)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n-d.helperProportions.height,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l-d.helperProportions.width}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m}).left-d.margins.left)}var t=p||q||r||s;if(e.snapMode!="outer"){var p=Math.abs(n-i)<=f,q=Math.abs(o-j)<=f,r=Math.abs(l-g)<=f,s=Math.abs(m-h)<=f;p&&(c.position.top=d._convertPositionTo("relative",{top:n,left:0}).top-d.margins.top),q&&(c.position.top=d._convertPositionTo("relative",{top:o-d.helperProportions.height,left:0}).top-d.margins.top),r&&(c.position.left=d._convertPositionTo("relative",{top:0,left:l}).left-d.margins.left),s&&(c.position.left=d._convertPositionTo("relative",{top:0,left:m-d.helperProportions.width}).left-d.margins.left)}!d.snapElements[k].snapping&&(p||q||r||s||t)&&d.options.snap.snap&&d.options.snap.snap.call(d.element,b,a.extend(d._uiHash(),{snapItem:d.snapElements[k].item})),d.snapElements[k].snapping=p||q||r||s||t}}}),a.ui.plugin.add("draggable","stack",{start:function(b,c){var d=a(this).data("draggable").options,e=a.makeArray(a(d.stack)).sort(function(b,c){return(parseInt(a(b).css("zIndex"),10)||0)-(parseInt(a(c).css("zIndex"),10)||0)});if(!e.length)return;var f=parseInt(e[0].style.zIndex)||0;a(e).each(function(a){this.style.zIndex=f+a}),this[0].style.zIndex=f+e.length}}),a.ui.plugin.add("draggable","zIndex",{start:function(b,c){var d=a(c.helper),e=a(this).data("draggable").options;d.css("zIndex")&&(e._zIndex=d.css("zIndex")),d.css("zIndex",e.zIndex)},stop:function(b,c){var d=a(this).data("draggable").options;d._zIndex&&a(c.helper).css("zIndex",d._zIndex)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.droppable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.droppable",{widgetEventPrefix:"drop",options:{accept:"*",activeClass:!1,addClasses:!0,greedy:!1,hoverClass:!1,scope:"default",tolerance:"intersect"},_create:function(){var b=this.options,c=b.accept;this.isover=0,this.isout=1,this.accept=a.isFunction(c)?c:function(a){return a.is(c)},this.proportions={width:this.element[0].offsetWidth,height:this.element[0].offsetHeight},a.ui.ddmanager.droppables[b.scope]=a.ui.ddmanager.droppables[b.scope]||[],a.ui.ddmanager.droppables[b.scope].push(this),b.addClasses&&this.element.addClass("ui-droppable")},destroy:function(){var b=a.ui.ddmanager.droppables[this.options.scope];for(var c=0;c<b.length;c++)b[c]==this&&b.splice(c,1);return this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable"),this},_setOption:function(b,c){b=="accept"&&(this.accept=a.isFunction(c)?c:function(a){return a.is(c)}),a.Widget.prototype._setOption.apply(this,arguments)},_activate:function(b){var c=a.ui.ddmanager.current;this.options.activeClass&&this.element.addClass(this.options.activeClass),c&&this._trigger("activate",b,this.ui(c))},_deactivate:function(b){var c=a.ui.ddmanager.current;this.options.activeClass&&this.element.removeClass(this.options.activeClass),c&&this._trigger("deactivate",b,this.ui(c))},_over:function(b){var c=a.ui.ddmanager.current;if(!c||(c.currentItem||c.element)[0]==this.element[0])return;this.accept.call(this.element[0],c.currentItem||c.element)&&(this.options.hoverClass&&this.element.addClass(this.options.hoverClass),this._trigger("over",b,this.ui(c)))},_out:function(b){var c=a.ui.ddmanager.current;if(!c||(c.currentItem||c.element)[0]==this.element[0])return;this.accept.call(this.element[0],c.currentItem||c.element)&&(this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("out",b,this.ui(c)))},_drop:function(b,c){var d=c||a.ui.ddmanager.current;if(!d||(d.currentItem||d.element)[0]==this.element[0])return!1;var e=!1;return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function(){var b=a.data(this,"droppable");if(b.options.greedy&&!b.options.disabled&&b.options.scope==d.options.scope&&b.accept.call(b.element[0],d.currentItem||d.element)&&a.ui.intersect(d,a.extend(b,{offset:b.element.offset()}),b.options.tolerance))return e=!0,!1}),e?!1:this.accept.call(this.element[0],d.currentItem||d.element)?(this.options.activeClass&&this.element.removeClass(this.options.activeClass),this.options.hoverClass&&this.element.removeClass(this.options.hoverClass),this._trigger("drop",b,this.ui(d)),this.element):!1},ui:function(a){return{draggable:a.currentItem||a.element,helper:a.helper,position:a.position,offset:a.positionAbs}}}),a.extend(a.ui.droppable,{version:"1.8.21"}),a.ui.intersect=function(b,c,d){if(!c.offset)return!1;var e=(b.positionAbs||b.position.absolute).left,f=e+b.helperProportions.width,g=(b.positionAbs||b.position.absolute).top,h=g+b.helperProportions.height,i=c.offset.left,j=i+c.proportions.width,k=c.offset.top,l=k+c.proportions.height;switch(d){case"fit":return i<=e&&f<=j&&k<=g&&h<=l;case"intersect":return i<e+b.helperProportions.width/2&&f-b.helperProportions.width/2<j&&k<g+b.helperProportions.height/2&&h-b.helperProportions.height/2<l;case"pointer":var m=(b.positionAbs||b.position.absolute).left+(b.clickOffset||b.offset.click).left,n=(b.positionAbs||b.position.absolute).top+(b.clickOffset||b.offset.click).top,o=a.ui.isOver(n,m,k,i,c.proportions.height,c.proportions.width);return o;case"touch":return(g>=k&&g<=l||h>=k&&h<=l||g<k&&h>l)&&(e>=i&&e<=j||f>=i&&f<=j||e<i&&f>j);default:return!1}},a.ui.ddmanager={current:null,droppables:{"default":[]},prepareOffsets:function(b,c){var d=a.ui.ddmanager.droppables[b.options.scope]||[],e=c?c.type:null,f=(b.currentItem||b.element).find(":data(droppable)").andSelf();g:for(var h=0;h<d.length;h++){if(d[h].options.disabled||b&&!d[h].accept.call(d[h].element[0],b.currentItem||b.element))continue;for(var i=0;i<f.length;i++)if(f[i]==d[h].element[0]){d[h].proportions.height=0;continue g}d[h].visible=d[h].element.css("display")!="none";if(!d[h].visible)continue;e=="mousedown"&&d[h]._activate.call(d[h],c),d[h].offset=d[h].element.offset(),d[h].proportions={width:d[h].element[0].offsetWidth,height:d[h].element[0].offsetHeight}}},drop:function(b,c){var d=!1;return a.each(a.ui.ddmanager.droppables[b.options.scope]||[],function(){if(!this.options)return;!this.options.disabled&&this.visible&&a.ui.intersect(b,this,this.options.tolerance)&&(d=this._drop.call(this,c)||d),!this.options.disabled&&this.visible&&this.accept.call(this.element[0],b.currentItem||b.element)&&(this.isout=1,this.isover=0,this._deactivate.call(this,c))}),d},dragStart:function(b,c){b.element.parents(":not(body,html)").bind("scroll.droppable",function(){b.options.refreshPositions||a.ui.ddmanager.prepareOffsets(b,c)})},drag:function(b,c){b.options.refreshPositions&&a.ui.ddmanager.prepareOffsets(b,c),a.each(a.ui.ddmanager.droppables[b.options.scope]||[],function(){if(this.options.disabled||this.greedyChild||!this.visible)return;var d=a.ui.intersect(b,this,this.options.tolerance),e=!d&&this.isover==1?"isout":d&&this.isover==0?"isover":null;if(!e)return;var f;if(this.options.greedy){var g=this.element.parents(":data(droppable):eq(0)");g.length&&(f=a.data(g[0],"droppable"),f.greedyChild=e=="isover"?1:0)}f&&e=="isover"&&(f.isover=0,f.isout=1,f._out.call(f,c)),this[e]=1,this[e=="isout"?"isover":"isout"]=0,this[e=="isover"?"_over":"_out"].call(this,c),f&&e=="isout"&&(f.isout=0,f.isover=1,f._over.call(f,c))})},dragStop:function(b,c){b.element.parents(":not(body,html)").unbind("scroll.droppable"),b.options.refreshPositions||a.ui.ddmanager.prepareOffsets(b,c)}}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.resizable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.resizable",a.ui.mouse,{widgetEventPrefix:"resize",options:{alsoResize:!1,animate:!1,animateDuration:"slow",animateEasing:"swing",aspectRatio:!1,autoHide:!1,containment:!1,ghost:!1,grid:!1,handles:"e,s,se",helper:!1,maxHeight:null,maxWidth:null,minHeight:10,minWidth:10,zIndex:1e3},_create:function(){var b=this,c=this.options;this.element.addClass("ui-resizable"),a.extend(this,{_aspectRatio:!!c.aspectRatio,aspectRatio:c.aspectRatio,originalElement:this.element,_proportionallyResizeElements:[],_helper:c.helper||c.ghost||c.animate?c.helper||"ui-resizable-helper":null}),this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)&&(this.element.wrap(a('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position:this.element.css("position"),width:this.element.outerWidth(),height:this.element.outerHeight(),top:this.element.css("top"),left:this.element.css("left")})),this.element=this.element.parent().data("resizable",this.element.data("resizable")),this.elementIsWrapper=!0,this.element.css({marginLeft:this.originalElement.css("marginLeft"),marginTop:this.originalElement.css("marginTop"),marginRight:this.originalElement.css("marginRight"),marginBottom:this.originalElement.css("marginBottom")}),this.originalElement.css({marginLeft:0,marginTop:0,marginRight:0,marginBottom:0}),this.originalResizeStyle=this.originalElement.css("resize"),this.originalElement.css("resize","none"),this._proportionallyResizeElements.push(this.originalElement.css({position:"static",zoom:1,display:"block"})),this.originalElement.css({margin:this.originalElement.css("margin")}),this._proportionallyResize()),this.handles=c.handles||(a(".ui-resizable-handle",this.element).length?{n:".ui-resizable-n",e:".ui-resizable-e",s:".ui-resizable-s",w:".ui-resizable-w",se:".ui-resizable-se",sw:".ui-resizable-sw",ne:".ui-resizable-ne",nw:".ui-resizable-nw"}:"e,s,se");if(this.handles.constructor==String){this.handles=="all"&&(this.handles="n,e,s,w,se,sw,ne,nw");var d=this.handles.split(",");this.handles={};for(var e=0;e<d.length;e++){var f=a.trim(d[e]),g="ui-resizable-"+f,h=a('<div class="ui-resizable-handle '+g+'"></div>');h.css({zIndex:c.zIndex}),"se"==f&&h.addClass("ui-icon ui-icon-gripsmall-diagonal-se"),this.handles[f]=".ui-resizable-"+f,this.element.append(h)}}this._renderAxis=function(b){b=b||this.element;for(var c in this.handles){this.handles[c].constructor==String&&(this.handles[c]=a(this.handles[c],this.element).show());if(this.elementIsWrapper&&this.originalElement[0].nodeName.match(/textarea|input|select|button/i)){var d=a(this.handles[c],this.element),e=0;e=/sw|ne|nw|se|n|s/.test(c)?d.outerHeight():d.outerWidth();var f=["padding",/ne|nw|n/.test(c)?"Top":/se|sw|s/.test(c)?"Bottom":/^e$/.test(c)?"Right":"Left"].join("");b.css(f,e),this._proportionallyResize()}if(!a(this.handles[c]).length)continue}},this._renderAxis(this.element),this._handles=a(".ui-resizable-handle",this.element).disableSelection(),this._handles.mouseover(function(){if(!b.resizing){if(this.className)var a=this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);b.axis=a&&a[1]?a[1]:"se"}}),c.autoHide&&(this._handles.hide(),a(this.element).addClass("ui-resizable-autohide").hover(function(){if(c.disabled)return;a(this).removeClass("ui-resizable-autohide"),b._handles.show()},function(){if(c.disabled)return;b.resizing||(a(this).addClass("ui-resizable-autohide"),b._handles.hide())})),this._mouseInit()},destroy:function(){this._mouseDestroy();var b=function(b){a(b).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()};if(this.elementIsWrapper){b(this.element);var c=this.element;c.after(this.originalElement.css({position:c.css("position"),width:c.outerWidth(),height:c.outerHeight(),top:c.css("top"),left:c.css("left")})).remove()}return this.originalElement.css("resize",this.originalResizeStyle),b(this.originalElement),this},_mouseCapture:function(b){var c=!1;for(var d in this.handles)a(this.handles[d])[0]==b.target&&(c=!0);return!this.options.disabled&&c},_mouseStart:function(b){var d=this.options,e=this.element.position(),f=this.element;this.resizing=!0,this.documentScroll={top:a(document).scrollTop(),left:a(document).scrollLeft()},(f.is(".ui-draggable")||/absolute/.test(f.css("position")))&&f.css({position:"absolute",top:e.top,left:e.left}),this._renderProxy();var g=c(this.helper.css("left")),h=c(this.helper.css("top"));d.containment&&(g+=a(d.containment).scrollLeft()||0,h+=a(d.containment).scrollTop()||0),this.offset=this.helper.offset(),this.position={left:g,top:h},this.size=this._helper?{width:f.outerWidth(),height:f.outerHeight()}:{width:f.width(),height:f.height()},this.originalSize=this._helper?{width:f.outerWidth(),height:f.outerHeight()}:{width:f.width(),height:f.height()},this.originalPosition={left:g,top:h},this.sizeDiff={width:f.outerWidth()-f.width(),height:f.outerHeight()-f.height()},this.originalMousePosition={left:b.pageX,top:b.pageY},this.aspectRatio=typeof d.aspectRatio=="number"?d.aspectRatio:this.originalSize.width/this.originalSize.height||1;var i=a(".ui-resizable-"+this.axis).css("cursor");return a("body").css("cursor",i=="auto"?this.axis+"-resize":i),f.addClass("ui-resizable-resizing"),this._propagate("start",b),!0},_mouseDrag:function(b){var c=this.helper,d=this.options,e={},f=this,g=this.originalMousePosition,h=this.axis,i=b.pageX-g.left||0,j=b.pageY-g.top||0,k=this._change[h];if(!k)return!1;var l=k.apply(this,[b,i,j]),m=a.browser.msie&&a.browser.version<7,n=this.sizeDiff;this._updateVirtualBoundaries(b.shiftKey);if(this._aspectRatio||b.shiftKey)l=this._updateRatio(l,b);return l=this._respectSize(l,b),this._propagate("resize",b),c.css({top:this.position.top+"px",left:this.position.left+"px",width:this.size.width+"px",height:this.size.height+"px"}),!this._helper&&this._proportionallyResizeElements.length&&this._proportionallyResize(),this._updateCache(l),this._trigger("resize",b,this.ui()),!1},_mouseStop:function(b){this.resizing=!1;var c=this.options,d=this;if(this._helper){var e=this._proportionallyResizeElements,f=e.length&&/textarea/i.test(e[0].nodeName),g=f&&a.ui.hasScroll(e[0],"left")?0:d.sizeDiff.height,h=f?0:d.sizeDiff.width,i={width:d.helper.width()-h,height:d.helper.height()-g},j=parseInt(d.element.css("left"),10)+(d.position.left-d.originalPosition.left)||null,k=parseInt(d.element.css("top"),10)+(d.position.top-d.originalPosition.top)||null;c.animate||this.element.css(a.extend(i,{top:k,left:j})),d.helper.height(d.size.height),d.helper.width(d.size.width),this._helper&&!c.animate&&this._proportionallyResize()}return a("body").css("cursor","auto"),this.element.removeClass("ui-resizable-resizing"),this._propagate("stop",b),this._helper&&this.helper.remove(),!1},_updateVirtualBoundaries:function(a){var b=this.options,c,e,f,g,h;h={minWidth:d(b.minWidth)?b.minWidth:0,maxWidth:d(b.maxWidth)?b.maxWidth:Infinity,minHeight:d(b.minHeight)?b.minHeight:0,maxHeight:d(b.maxHeight)?b.maxHeight:Infinity};if(this._aspectRatio||a)c=h.minHeight*this.aspectRatio,f=h.minWidth/this.aspectRatio,e=h.maxHeight*this.aspectRatio,g=h.maxWidth/this.aspectRatio,c>h.minWidth&&(h.minWidth=c),f>h.minHeight&&(h.minHeight=f),e<h.maxWidth&&(h.maxWidth=e),g<h.maxHeight&&(h.maxHeight=g);this._vBoundaries=h},_updateCache:function(a){var b=this.options;this.offset=this.helper.offset(),d(a.left)&&(this.position.left=a.left),d(a.top)&&(this.position.top=a.top),d(a.height)&&(this.size.height=a.height),d(a.width)&&(this.size.width=a.width)},_updateRatio:function(a,b){var c=this.options,e=this.position,f=this.size,g=this.axis;return d(a.height)?a.width=a.height*this.aspectRatio:d(a.width)&&(a.height=a.width/this.aspectRatio),g=="sw"&&(a.left=e.left+(f.width-a.width),a.top=null),g=="nw"&&(a.top=e.top+(f.height-a.height),a.left=e.left+(f.width-a.width)),a},_respectSize:function(a,b){var c=this.helper,e=this._vBoundaries,f=this._aspectRatio||b.shiftKey,g=this.axis,h=d(a.width)&&e.maxWidth&&e.maxWidth<a.width,i=d(a.height)&&e.maxHeight&&e.maxHeight<a.height,j=d(a.width)&&e.minWidth&&e.minWidth>a.width,k=d(a.height)&&e.minHeight&&e.minHeight>a.height;j&&(a.width=e.minWidth),k&&(a.height=e.minHeight),h&&(a.width=e.maxWidth),i&&(a.height=e.maxHeight);var l=this.originalPosition.left+this.originalSize.width,m=this.position.top+this.size.height,n=/sw|nw|w/.test(g),o=/nw|ne|n/.test(g);j&&n&&(a.left=l-e.minWidth),h&&n&&(a.left=l-e.maxWidth),k&&o&&(a.top=m-e.minHeight),i&&o&&(a.top=m-e.maxHeight);var p=!a.width&&!a.height;return p&&!a.left&&a.top?a.top=null:p&&!a.top&&a.left&&(a.left=null),a},_proportionallyResize:function(){var b=this.options;if(!this._proportionallyResizeElements.length)return;var c=this.helper||this.element;for(var d=0;d<this._proportionallyResizeElements.length;d++){var e=this._proportionallyResizeElements[d];if(!this.borderDif){var f=[e.css("borderTopWidth"),e.css("borderRightWidth"),e.css("borderBottomWidth"),e.css("borderLeftWidth")],g=[e.css("paddingTop"),e.css("paddingRight"),e.css("paddingBottom"),e.css("paddingLeft")];this.borderDif=a.map(f,function(a,b){var c=parseInt(a,10)||0,d=parseInt(g[b],10)||0;return c+d})}if(!a.browser.msie||!a(c).is(":hidden")&&!a(c).parents(":hidden").length)e.css({height:c.height()-this.borderDif[0]-this.borderDif[2]||0,width:c.width()-this.borderDif[1]-this.borderDif[3]||0});else continue}},_renderProxy:function(){var b=this.element,c=this.options;this.elementOffset=b.offset();if(this._helper){this.helper=this.helper||a('<div style="overflow:hidden;"></div>');var d=a.browser.msie&&a.browser.version<7,e=d?1:0,f=d?2:-1;this.helper.addClass(this._helper).css({width:this.element.outerWidth()+f,height:this.element.outerHeight()+f,position:"absolute",left:this.elementOffset.left-e+"px",top:this.elementOffset.top-e+"px",zIndex:++c.zIndex}),this.helper.appendTo("body").disableSelection()}else this.helper=this.element},_change:{e:function(a,b,c){return{width:this.originalSize.width+b}},w:function(a,b,c){var d=this.options,e=this.originalSize,f=this.originalPosition;return{left:f.left+b,width:e.width-b}},n:function(a,b,c){var d=this.options,e=this.originalSize,f=this.originalPosition;return{top:f.top+c,height:e.height-c}},s:function(a,b,c){return{height:this.originalSize.height+c}},se:function(b,c,d){return a.extend(this._change.s.apply(this,arguments),this._change.e.apply(this,[b,c,d]))},sw:function(b,c,d){return a.extend(this._change.s.apply(this,arguments),this._change.w.apply(this,[b,c,d]))},ne:function(b,c,d){return a.extend(this._change.n.apply(this,arguments),this._change.e.apply(this,[b,c,d]))},nw:function(b,c,d){return a.extend(this._change.n.apply(this,arguments),this._change.w.apply(this,[b,c,d]))}},_propagate:function(b,c){a.ui.plugin.call(this,b,[c,this.ui()]),b!="resize"&&this._trigger(b,c,this.ui())},plugins:{},ui:function(){return{originalElement:this.originalElement,element:this.element,helper:this.helper,position:this.position,size:this.size,originalSize:this.originalSize,originalPosition:this.originalPosition}}}),a.extend(a.ui.resizable,{version:"1.8.21"}),a.ui.plugin.add("resizable","alsoResize",{start:function(b,c){var d=a(this).data("resizable"),e=d.options,f=function(b){a(b).each(function(){var b=a(this);b.data("resizable-alsoresize",{width:parseInt(b.width(),10),height:parseInt(b.height(),10),left:parseInt(b.css("left"),10),top:parseInt(b.css("top"),10)})})};typeof e.alsoResize=="object"&&!e.alsoResize.parentNode?e.alsoResize.length?(e.alsoResize=e.alsoResize[0],f(e.alsoResize)):a.each(e.alsoResize,function(a){f(a)}):f(e.alsoResize)},resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.originalSize,g=d.originalPosition,h={height:d.size.height-f.height||0,width:d.size.width-f.width||0,top:d.position.top-g.top||0,left:d.position.left-g.left||0},i=function(b,d){a(b).each(function(){var b=a(this),e=a(this).data("resizable-alsoresize"),f={},g=d&&d.length?d:b.parents(c.originalElement[0]).length?["width","height"]:["width","height","top","left"];a.each(g,function(a,b){var c=(e[b]||0)+(h[b]||0);c&&c>=0&&(f[b]=c||null)}),b.css(f)})};typeof e.alsoResize=="object"&&!e.alsoResize.nodeType?a.each(e.alsoResize,function(a,b){i(a,b)}):i(e.alsoResize)},stop:function(b,c){a(this).removeData("resizable-alsoresize")}}),a.ui.plugin.add("resizable","animate",{stop:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d._proportionallyResizeElements,g=f.length&&/textarea/i.test(f[0].nodeName),h=g&&a.ui.hasScroll(f[0],"left")?0:d.sizeDiff.height,i=g?0:d.sizeDiff.width,j={width:d.size.width-i,height:d.size.height-h},k=parseInt(d.element.css("left"),10)+(d.position.left-d.originalPosition.left)||null,l=parseInt(d.element.css("top"),10)+(d.position.top-d.originalPosition.top)||null;d.element.animate(a.extend(j,l&&k?{top:l,left:k}:{}),{duration:e.animateDuration,easing:e.animateEasing,step:function(){var c={width:parseInt(d.element.css("width"),10),height:parseInt(d.element.css("height"),10),top:parseInt(d.element.css("top"),10),left:parseInt(d.element.css("left"),10)};f&&f.length&&a(f[0]).css({width:c.width,height:c.height}),d._updateCache(c),d._propagate("resize",b)}})}}),a.ui.plugin.add("resizable","containment",{start:function(b,d){var e=a(this).data("resizable"),f=e.options,g=e.element,h=f.containment,i=h instanceof a?h.get(0):/parent/.test(h)?g.parent().get(0):h;if(!i)return;e.containerElement=a(i);if(/document/.test(h)||h==document)e.containerOffset={left:0,top:0},e.containerPosition={left:0,top:0},e.parentData={element:a(document),left:0,top:0,width:a(document).width(),height:a(document).height()||document.body.parentNode.scrollHeight};else{var j=a(i),k=[];a(["Top","Right","Left","Bottom"]).each(function(a,b){k[a]=c(j.css("padding"+b))}),e.containerOffset=j.offset(),e.containerPosition=j.position(),e.containerSize={height:j.innerHeight()-k[3],width:j.innerWidth()-k[1]};var l=e.containerOffset,m=e.containerSize.height,n=e.containerSize.width,o=a.ui.hasScroll(i,"left")?i.scrollWidth:n,p=a.ui.hasScroll(i)?i.scrollHeight:m;e.parentData={element:i,left:l.left,top:l.top,width:o,height:p}}},resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.containerSize,g=d.containerOffset,h=d.size,i=d.position,j=d._aspectRatio||b.shiftKey,k={top:0,left:0},l=d.containerElement;l[0]!=document&&/static/.test(l.css("position"))&&(k=g),i.left<(d._helper?g.left:0)&&(d.size.width=d.size.width+(d._helper?d.position.left-g.left:d.position.left-k.left),j&&(d.size.height=d.size.width/d.aspectRatio),d.position.left=e.helper?g.left:0),i.top<(d._helper?g.top:0)&&(d.size.height=d.size.height+(d._helper?d.position.top-g.top:d.position.top),j&&(d.size.width=d.size.height*d.aspectRatio),d.position.top=d._helper?g.top:0),d.offset.left=d.parentData.left+d.position.left,d.offset.top=d.parentData.top+d.position.top;var m=Math.abs((d._helper?d.offset.left-k.left:d.offset.left-k.left)+d.sizeDiff.width),n=Math.abs((d._helper?d.offset.top-k.top:d.offset.top-g.top)+d.sizeDiff.height),o=d.containerElement.get(0)==d.element.parent().get(0),p=/relative|absolute/.test(d.containerElement.css("position"));o&&p&&(m-=d.parentData.left),m+d.size.width>=d.parentData.width&&(d.size.width=d.parentData.width-m,j&&(d.size.height=d.size.width/d.aspectRatio)),n+d.size.height>=d.parentData.height&&(d.size.height=d.parentData.height-n,j&&(d.size.width=d.size.height*d.aspectRatio))},stop:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.position,g=d.containerOffset,h=d.containerPosition,i=d.containerElement,j=a(d.helper),k=j.offset(),l=j.outerWidth()-d.sizeDiff.width,m=j.outerHeight()-d.sizeDiff.height;d._helper&&!e.animate&&/relative/.test(i.css("position"))&&a(this).css({left:k.left-h.left-g.left,width:l,height:m}),d._helper&&!e.animate&&/static/.test(i.css("position"))&&a(this).css({left:k.left-h.left-g.left,width:l,height:m})}}),a.ui.plugin.add("resizable","ghost",{start:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.size;d.ghost=d.originalElement.clone(),d.ghost.css({opacity:.25,display:"block",position:"relative",height:f.height,width:f.width,margin:0,left:0,top:0}).addClass("ui-resizable-ghost").addClass(typeof e.ghost=="string"?e.ghost:""),d.ghost.appendTo(d.helper)},resize:function(b,c){var d=a(this).data("resizable"),e=d.options;d.ghost&&d.ghost.css({position:"relative",height:d.size.height,width:d.size.width})},stop:function(b,c){var d=a(this).data("resizable"),e=d.options;d.ghost&&d.helper&&d.helper.get(0).removeChild(d.ghost.get(0))}}),a.ui.plugin.add("resizable","grid",{resize:function(b,c){var d=a(this).data("resizable"),e=d.options,f=d.size,g=d.originalSize,h=d.originalPosition,i=d.axis,j=e._aspectRatio||b.shiftKey;e.grid=typeof e.grid=="number"?[e.grid,e.grid]:e.grid;var k=Math.round((f.width-g.width)/(e.grid[0]||1))*(e.grid[0]||1),l=Math.round((f.height-g.height)/(e.grid[1]||1))*(e.grid[1]||1);/^(se|s|e)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l):/^(ne)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l,d.position.top=h.top-l):/^(sw)$/.test(i)?(d.size.width=g.width+k,d.size.height=g.height+l,d.position.left=h.left-k):(d.size.width=g.width+k,d.size.height=g.height+l,d.position.top=h.top-l,d.position.left=h.left-k)}});var c=function(a){return parseInt(a,10)||0},d=function(a){return!isNaN(parseInt(a,10))}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.selectable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.selectable",a.ui.mouse,{options:{appendTo:"body",autoRefresh:!0,distance:0,filter:"*",tolerance:"touch"},_create:function(){var b=this;this.element.addClass("ui-selectable"),this.dragged=!1;var c;this.refresh=function(){c=a(b.options.filter,b.element[0]),c.addClass("ui-selectee"),c.each(function(){var b=a(this),c=b.offset();a.data(this,"selectable-item",{element:this,$element:b,left:c.left,top:c.top,right:c.left+b.outerWidth(),bottom:c.top+b.outerHeight(),startselected:!1,selected:b.hasClass("ui-selected"),selecting:b.hasClass("ui-selecting"),unselecting:b.hasClass("ui-unselecting")})})},this.refresh(),this.selectees=c.addClass("ui-selectee"),this._mouseInit(),this.helper=a("<div class='ui-selectable-helper'></div>")},destroy:function(){return this.selectees.removeClass("ui-selectee").removeData("selectable-item"),this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable"),this._mouseDestroy(),this},_mouseStart:function(b){var c=this;this.opos=[b.pageX,b.pageY];if(this.options.disabled)return;var d=this.options;this.selectees=a(d.filter,this.element[0]),this._trigger("start",b),a(d.appendTo).append(this.helper),this.helper.css({left:b.clientX,top:b.clientY,width:0,height:0}),d.autoRefresh&&this.refresh(),this.selectees.filter(".ui-selected").each(function(){var d=a.data(this,"selectable-item");d.startselected=!0,!b.metaKey&&!b.ctrlKey&&(d.$element.removeClass("ui-selected"),d.selected=!1,d.$element.addClass("ui-unselecting"),d.unselecting=!0,c._trigger("unselecting",b,{unselecting:d.element}))}),a(b.target).parents().andSelf().each(function(){var d=a.data(this,"selectable-item");if(d){var e=!b.metaKey&&!b.ctrlKey||!d.$element.hasClass("ui-selected");return d.$element.removeClass(e?"ui-unselecting":"ui-selected").addClass(e?"ui-selecting":"ui-unselecting"),d.unselecting=!e,d.selecting=e,d.selected=e,e?c._trigger("selecting",b,{selecting:d.element}):c._trigger("unselecting",b,{unselecting:d.element}),!1}})},_mouseDrag:function(b){var c=this;this.dragged=!0;if(this.options.disabled)return;var d=this.options,e=this.opos[0],f=this.opos[1],g=b.pageX,h=b.pageY;if(e>g){var i=g;g=e,e=i}if(f>h){var i=h;h=f,f=i}return this.helper.css({left:e,top:f,width:g-e,height:h-f}),this.selectees.each(function(){var i=a.data(this,"selectable-item");if(!i||i.element==c.element[0])return;var j=!1;d.tolerance=="touch"?j=!(i.left>g||i.right<e||i.top>h||i.bottom<f):d.tolerance=="fit"&&(j=i.left>e&&i.right<g&&i.top>f&&i.bottom<h),j?(i.selected&&(i.$element.removeClass("ui-selected"),i.selected=!1),i.unselecting&&(i.$element.removeClass("ui-unselecting"),i.unselecting=!1),i.selecting||(i.$element.addClass("ui-selecting"),i.selecting=!0,c._trigger("selecting",b,{selecting:i.element}))):(i.selecting&&((b.metaKey||b.ctrlKey)&&i.startselected?(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.$element.addClass("ui-selected"),i.selected=!0):(i.$element.removeClass("ui-selecting"),i.selecting=!1,i.startselected&&(i.$element.addClass("ui-unselecting"),i.unselecting=!0),c._trigger("unselecting",b,{unselecting:i.element}))),i.selected&&!b.metaKey&&!b.ctrlKey&&!i.startselected&&(i.$element.removeClass("ui-selected"),i.selected=!1,i.$element.addClass("ui-unselecting"),i.unselecting=!0,c._trigger("unselecting",b,{unselecting:i.element})))}),!1},_mouseStop:function(b){var c=this;this.dragged=!1;var d=this.options;return a(".ui-unselecting",this.element[0]).each(function(){var d=a.data(this,"selectable-item");d.$element.removeClass("ui-unselecting"),d.unselecting=!1,d.startselected=!1,c._trigger("unselected",b,{unselected:d.element})}),a(".ui-selecting",this.element[0]).each(function(){var d=a.data(this,"selectable-item");d.$element.removeClass("ui-selecting").addClass("ui-selected"),d.selecting=!1,d.selected=!0,d.startselected=!0,c._trigger("selected",b,{selected:d.element})}),this._trigger("stop",b),this.helper.remove(),!1}}),a.extend(a.ui.selectable,{version:"1.8.21"})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.sortable.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.sortable",a.ui.mouse,{widgetEventPrefix:"sort",ready:!1,options:{appendTo:"parent",axis:!1,connectWith:!1,containment:!1,cursor:"auto",cursorAt:!1,dropOnEmpty:!0,forcePlaceholderSize:!1,forceHelperSize:!1,grid:!1,handle:!1,helper:"original",items:"> *",opacity:!1,placeholder:!1,revert:!1,scroll:!0,scrollSensitivity:20,scrollSpeed:20,scope:"default",tolerance:"intersect",zIndex:1e3},_create:function(){var a=this.options;this.containerCache={},this.element.addClass("ui-sortable"),this.refresh(),this.floating=this.items.length?a.axis==="x"||/left|right/.test(this.items[0].item.css("float"))||/inline|table-cell/.test(this.items[0].item.css("display")):!1,this.offset=this.element.offset(),this._mouseInit(),this.ready=!0},destroy:function(){a.Widget.prototype.destroy.call(this),this.element.removeClass("ui-sortable ui-sortable-disabled"),this._mouseDestroy();for(var b=this.items.length-1;b>=0;b--)this.items[b].item.removeData(this.widgetName+"-item");return this},_setOption:function(b,c){b==="disabled"?(this.options[b]=c,this.widget()[c?"addClass":"removeClass"]("ui-sortable-disabled")):a.Widget.prototype._setOption.apply(this,arguments)},_mouseCapture:function(b,c){var d=this;if(this.reverting)return!1;if(this.options.disabled||this.options.type=="static")return!1;this._refreshItems(b);var e=null,f=this,g=a(b.target).parents().each(function(){if(a.data(this,d.widgetName+"-item")==f)return e=a(this),!1});a.data(b.target,d.widgetName+"-item")==f&&(e=a(b.target));if(!e)return!1;if(this.options.handle&&!c){var h=!1;a(this.options.handle,e).find("*").andSelf().each(function(){this==b.target&&(h=!0)});if(!h)return!1}return this.currentItem=e,this._removeCurrentsFromItems(),!0},_mouseStart:function(b,c,d){var e=this.options,f=this;this.currentContainer=this,this.refreshPositions(),this.helper=this._createHelper(b),this._cacheHelperProportions(),this._cacheMargins(),this.scrollParent=this.helper.scrollParent(),this.offset=this.currentItem.offset(),this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left},a.extend(this.offset,{click:{left:b.pageX-this.offset.left,top:b.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()}),this.helper.css("position","absolute"),this.cssPosition=this.helper.css("position"),this.originalPosition=this._generatePosition(b),this.originalPageX=b.pageX,this.originalPageY=b.pageY,e.cursorAt&&this._adjustOffsetFromHelper(e.cursorAt),this.domPosition={prev:this.currentItem.prev()[0],parent:this.currentItem.parent()[0]},this.helper[0]!=this.currentItem[0]&&this.currentItem.hide(),this._createPlaceholder(),e.containment&&this._setContainment(),e.cursor&&(a("body").css("cursor")&&(this._storedCursor=a("body").css("cursor")),a("body").css("cursor",e.cursor)),e.opacity&&(this.helper.css("opacity")&&(this._storedOpacity=this.helper.css("opacity")),this.helper.css("opacity",e.opacity)),e.zIndex&&(this.helper.css("zIndex")&&(this._storedZIndex=this.helper.css("zIndex")),this.helper.css("zIndex",e.zIndex)),this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"&&(this.overflowOffset=this.scrollParent.offset()),this._trigger("start",b,this._uiHash()),this._preserveHelperProportions||this._cacheHelperProportions();if(!d)for(var g=this.containers.length-1;g>=0;g--)this.containers[g]._trigger("activate",b,f._uiHash(this));return a.ui.ddmanager&&(a.ui.ddmanager.current=this),a.ui.ddmanager&&!e.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,b),this.dragging=!0,this.helper.addClass("ui-sortable-helper"),this._mouseDrag(b),!0},_mouseDrag:function(b){this.position=this._generatePosition(b),this.positionAbs=this._convertPositionTo("absolute"),this.lastPositionAbs||(this.lastPositionAbs=this.positionAbs);if(this.options.scroll){var c=this.options,d=!1;this.scrollParent[0]!=document&&this.scrollParent[0].tagName!="HTML"?(this.overflowOffset.top+this.scrollParent[0].offsetHeight-b.pageY<c.scrollSensitivity?this.scrollParent[0].scrollTop=d=this.scrollParent[0].scrollTop+c.scrollSpeed:b.pageY-this.overflowOffset.top<c.scrollSensitivity&&(this.scrollParent[0].scrollTop=d=this.scrollParent[0].scrollTop-c.scrollSpeed),this.overflowOffset.left+this.scrollParent[0].offsetWidth-b.pageX<c.scrollSensitivity?this.scrollParent[0].scrollLeft=d=this.scrollParent[0].scrollLeft+c.scrollSpeed:b.pageX-this.overflowOffset.left<c.scrollSensitivity&&(this.scrollParent[0].scrollLeft=d=this.scrollParent[0].scrollLeft-c.scrollSpeed)):(b.pageY-a(document).scrollTop()<c.scrollSensitivity?d=a(document).scrollTop(a(document).scrollTop()-c.scrollSpeed):a(window).height()-(b.pageY-a(document).scrollTop())<c.scrollSensitivity&&(d=a(document).scrollTop(a(document).scrollTop()+c.scrollSpeed)),b.pageX-a(document).scrollLeft()<c.scrollSensitivity?d=a(document).scrollLeft(a(document).scrollLeft()-c.scrollSpeed):a(window).width()-(b.pageX-a(document).scrollLeft())<c.scrollSensitivity&&(d=a(document).scrollLeft(a(document).scrollLeft()+c.scrollSpeed))),d!==!1&&a.ui.ddmanager&&!c.dropBehaviour&&a.ui.ddmanager.prepareOffsets(this,b)}this.positionAbs=this._convertPositionTo("absolute");if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";for(var e=this.items.length-1;e>=0;e--){var f=this.items[e],g=f.item[0],h=this._intersectsWithPointer(f);if(!h)continue;if(g!=this.currentItem[0]&&this.placeholder[h==1?"next":"prev"]()[0]!=g&&!a.ui.contains(this.placeholder[0],g)&&(this.options.type=="semi-dynamic"?!a.ui.contains(this.element[0],g):!0)){this.direction=h==1?"down":"up";if(this.options.tolerance=="pointer"||this._intersectsWithSides(f))this._rearrange(b,f);else break;this._trigger("change",b,this._uiHash());break}}return this._contactContainers(b),a.ui.ddmanager&&a.ui.ddmanager.drag(this,b),this._trigger("sort",b,this._uiHash()),this.lastPositionAbs=this.positionAbs,!1},_mouseStop:function(b,c){if(!b)return;a.ui.ddmanager&&!this.options.dropBehaviour&&a.ui.ddmanager.drop(this,b);if(this.options.revert){var d=this,e=d.placeholder.offset();d.reverting=!0,a(this.helper).animate({left:e.left-this.offset.parent.left-d.margins.left+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollLeft),top:e.top-this.offset.parent.top-d.margins.top+(this.offsetParent[0]==document.body?0:this.offsetParent[0].scrollTop)},parseInt(this.options.revert,10)||500,function(){d._clear(b)})}else this._clear(b,c);return!1},cancel:function(){var b=this;if(this.dragging){this._mouseUp({target:null}),this.options.helper=="original"?this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper"):this.currentItem.show();for(var c=this.containers.length-1;c>=0;c--)this.containers[c]._trigger("deactivate",null,b._uiHash(this)),this.containers[c].containerCache.over&&(this.containers[c]._trigger("out",null,b._uiHash(this)),this.containers[c].containerCache.over=0)}return this.placeholder&&(this.placeholder[0].parentNode&&this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.options.helper!="original"&&this.helper&&this.helper[0].parentNode&&this.helper.remove(),a.extend(this,{helper:null,dragging:!1,reverting:!1,_noFinalSort:null}),this.domPosition.prev?a(this.domPosition.prev).after(this.currentItem):a(this.domPosition.parent).prepend(this.currentItem)),this},serialize:function(b){var c=this._getItemsAsjQuery(b&&b.connected),d=[];return b=b||{},a(c).each(function(){var c=(a(b.item||this).attr(b.attribute||"id")||"").match(b.expression||/(.+)[-=_](.+)/);c&&d.push((b.key||c[1]+"[]")+"="+(b.key&&b.expression?c[1]:c[2]))}),!d.length&&b.key&&d.push(b.key+"="),d.join("&")},toArray:function(b){var c=this._getItemsAsjQuery(b&&b.connected),d=[];return b=b||{},c.each(function(){d.push(a(b.item||this).attr(b.attribute||"id")||"")}),d},_intersectsWith:function(a){var b=this.positionAbs.left,c=b+this.helperProportions.width,d=this.positionAbs.top,e=d+this.helperProportions.height,f=a.left,g=f+a.width,h=a.top,i=h+a.height,j=this.offset.click.top,k=this.offset.click.left,l=d+j>h&&d+j<i&&b+k>f&&b+k<g;return this.options.tolerance=="pointer"||this.options.forcePointerForContainers||this.options.tolerance!="pointer"&&this.helperProportions[this.floating?"width":"height"]>a[this.floating?"width":"height"]?l:f<b+this.helperProportions.width/2&&c-this.helperProportions.width/2<g&&h<d+this.helperProportions.height/2&&e-this.helperProportions.height/2<i},_intersectsWithPointer:function(b){var c=this.options.axis==="x"||a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,b.top,b.height),d=this.options.axis==="y"||a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,b.left,b.width),e=c&&d,f=this._getDragVerticalDirection(),g=this._getDragHorizontalDirection();return e?this.floating?g&&g=="right"||f=="down"?2:1:f&&(f=="down"?2:1):!1},_intersectsWithSides:function(b){var c=a.ui.isOverAxis(this.positionAbs.top+this.offset.click.top,b.top+b.height/2,b.height),d=a.ui.isOverAxis(this.positionAbs.left+this.offset.click.left,b.left+b.width/2,b.width),e=this._getDragVerticalDirection(),f=this._getDragHorizontalDirection();return this.floating&&f?f=="right"&&d||f=="left"&&!d:e&&(e=="down"&&c||e=="up"&&!c)},_getDragVerticalDirection:function(){var a=this.positionAbs.top-this.lastPositionAbs.top;return a!=0&&(a>0?"down":"up")},_getDragHorizontalDirection:function(){var a=this.positionAbs.left-this.lastPositionAbs.left;return a!=0&&(a>0?"right":"left")},refresh:function(a){return this._refreshItems(a),this.refreshPositions(),this},_connectWith:function(){var a=this.options;return a.connectWith.constructor==String?[a.connectWith]:a.connectWith},_getItemsAsjQuery:function(b){var c=this,d=[],e=[],f=this._connectWith();if(f&&b)for(var g=f.length-1;g>=0;g--){var h=a(f[g]);for(var i=h.length-1;i>=0;i--){var j=a.data(h[i],this.widgetName);j&&j!=this&&!j.options.disabled&&e.push([a.isFunction(j.options.items)?j.options.items.call(j.element):a(j.options.items,j.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),j])}}e.push([a.isFunction(this.options.items)?this.options.items.call(this.element,null,{options:this.options,item:this.currentItem}):a(this.options.items,this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),this]);for(var g=e.length-1;g>=0;g--)e[g][0].each(function(){d.push(this)});return a(d)},_removeCurrentsFromItems:function(){var a=this.currentItem.find(":data("+this.widgetName+"-item)");for(var b=0;b<this.items.length;b++)for(var c=0;c<a.length;c++)a[c]==this.items[b].item[0]&&this.items.splice(b,1)},_refreshItems:function(b){this.items=[],this.containers=[this];var c=this.items,d=this,e=[[a.isFunction(this.options.items)?this.options.items.call(this.element[0],b,{item:this.currentItem}):a(this.options.items,this.element),this]],f=this._connectWith();if(f&&this.ready)for(var g=f.length-1;g>=0;g--){var h=a(f[g]);for(var i=h.length-1;i>=0;i--){var j=a.data(h[i],this.widgetName);j&&j!=this&&!j.options.disabled&&(e.push([a.isFunction(j.options.items)?j.options.items.call(j.element[0],b,{item:this.currentItem}):a(j.options.items,j.element),j]),this.containers.push(j))}}for(var g=e.length-1;g>=0;g--){var k=e[g][1],l=e[g][0];for(var i=0,m=l.length;i<m;i++){var n=a(l[i]);n.data(this.widgetName+"-item",k),c.push({item:n,instance:k,width:0,height:0,left:0,top:0})}}},refreshPositions:function(b){this.offsetParent&&this.helper&&(this.offset.parent=this._getParentOffset());for(var c=this.items.length-1;c>=0;c--){var d=this.items[c];if(d.instance!=this.currentContainer&&this.currentContainer&&d.item[0]!=this.currentItem[0])continue;var e=this.options.toleranceElement?a(this.options.toleranceElement,d.item):d.item;b||(d.width=e.outerWidth(),d.height=e.outerHeight());var f=e.offset();d.left=f.left,d.top=f.top}if(this.options.custom&&this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this);else for(var c=this.containers.length-1;c>=0;c--){var f=this.containers[c].element.offset();this.containers[c].containerCache.left=f.left,this.containers[c].containerCache.top=f.top,this.containers[c].containerCache.width=this.containers[c].element.outerWidth(),this.containers[c].containerCache.height=this.containers[c].element.outerHeight()}return this},_createPlaceholder:function(b){var c=b||this,d=c.options;if(!d.placeholder||d.placeholder.constructor==String){var e=d.placeholder;d.placeholder={element:function(){var b=a(document.createElement(c.currentItem[0].nodeName)).addClass(e||c.currentItem[0].className+" ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];return e||(b.style.visibility="hidden"),b},update:function(a,b){if(e&&!d.forcePlaceholderSize)return;b.height()||b.height(c.currentItem.innerHeight()-parseInt(c.currentItem.css("paddingTop")||0,10)-parseInt(c.currentItem.css("paddingBottom")||0,10)),b.width()||b.width(c.currentItem.innerWidth()-parseInt(c.currentItem.css("paddingLeft")||0,10)-parseInt(c.currentItem.css("paddingRight")||0,10))}}}c.placeholder=a(d.placeholder.element.call(c.element,c.currentItem)),c.currentItem.after(c.placeholder),d.placeholder.update(c,c.placeholder)},_contactContainers:function(b){var c=null,d=null;for(var e=this.containers.length-1;e>=0;e--){if(a.ui.contains(this.currentItem[0],this.containers[e].element[0]))continue;if(this._intersectsWith(this.containers[e].containerCache)){if(c&&a.ui.contains(this.containers[e].element[0],c.element[0]))continue;c=this.containers[e],d=e}else this.containers[e].containerCache.over&&(this.containers[e]._trigger("out",b,this._uiHash(this)),this.containers[e].containerCache.over=0)}if(!c)return;if(this.containers.length===1)this.containers[d]._trigger("over",b,this._uiHash(this)),this.containers[d].containerCache.over=1;else if(this.currentContainer!=this.containers[d]){var f=1e4,g=null,h=this.positionAbs[this.containers[d].floating?"left":"top"];for(var i=this.items.length-1;i>=0;i--){if(!a.ui.contains(this.containers[d].element[0],this.items[i].item[0]))continue;var j=this.containers[d].floating?this.items[i].item.offset().left:this.items[i].item.offset().top;Math.abs(j-h)<f&&(f=Math.abs(j-h),g=this.items[i],this.direction=j-h>0?"down":"up")}if(!g&&!this.options.dropOnEmpty)return;this.currentContainer=this.containers[d],g?this._rearrange(b,g,null,!0):this._rearrange(b,null,this.containers[d].element,!0),this._trigger("change",b,this._uiHash()),this.containers[d]._trigger("change",b,this._uiHash(this)),this.options.placeholder.update(this.currentContainer,this.placeholder),this.containers[d]._trigger("over",b,this._uiHash(this)),this.containers[d].containerCache.over=1}},_createHelper:function(b){var c=this.options,d=a.isFunction(c.helper)?a(c.helper.apply(this.element[0],[b,this.currentItem])):c.helper=="clone"?this.currentItem.clone():this.currentItem;return d.parents("body").length||a(c.appendTo!="parent"?c.appendTo:this.currentItem[0].parentNode)[0].appendChild(d[0]),d[0]==this.currentItem[0]&&(this._storedCSS={width:this.currentItem[0].style.width,height:this.currentItem[0].style.height,position:this.currentItem.css("position"),top:this.currentItem.css("top"),left:this.currentItem.css("left")}),(d[0].style.width==""||c.forceHelperSize)&&d.width(this.currentItem.width()),(d[0].style.height==""||c.forceHelperSize)&&d.height(this.currentItem.height()),d},_adjustOffsetFromHelper:function(b){typeof b=="string"&&(b=b.split(" ")),a.isArray(b)&&(b={left:+b[0],top:+b[1]||0}),"left"in b&&(this.offset.click.left=b.left+this.margins.left),"right"in b&&(this.offset.click.left=this.helperProportions.width-b.right+this.margins.left),"top"in b&&(this.offset.click.top=b.top+this.margins.top),"bottom"in b&&(this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top)},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var b=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&a.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(b.left+=this.scrollParent.scrollLeft(),b.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&a.browser.msie)b={top:0,left:0};return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=this.currentItem.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.currentItem.css("marginLeft"),10)||0,top:parseInt(this.currentItem.css("marginTop"),10)||0}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var b=this.options;b.containment=="parent"&&(b.containment=this.helper[0].parentNode);if(b.containment=="document"||b.containment=="window")this.containment=[0-this.offset.relative.left-this.offset.parent.left,0-this.offset.relative.top-this.offset.parent.top,a(b.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a(b.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(b.containment)){var c=a(b.containment)[0],d=a(b.containment).offset(),e=a(c).css("overflow")!="hidden";this.containment=[d.left+(parseInt(a(c).css("borderLeftWidth"),10)||0)+(parseInt(a(c).css("paddingLeft"),10)||0)-this.margins.left,d.top+(parseInt(a(c).css("borderTopWidth"),10)||0)+(parseInt(a(c).css("paddingTop"),10)||0)-this.margins.top,d.left+(e?Math.max(c.scrollWidth,c.offsetWidth):c.offsetWidth)-(parseInt(a(c).css("borderLeftWidth"),10)||0)-(parseInt(a(c).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left,d.top+(e?Math.max(c.scrollHeight,c.offsetHeight):c.offsetHeight)-(parseInt(a(c).css("borderTopWidth"),10)||0)-(parseInt(a(c).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top]}},_convertPositionTo:function(b,c){c||(c=this.position);var d=b=="absolute"?1:-1,e=this.options,f=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,g=/(html|body)/i.test(f[0].tagName);return{top:c.top+this.offset.relative.top*d+this.offset.parent.top*d-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():g?0:f.scrollTop())*d),left:c.left+this.offset.relative.left*d+this.offset.parent.left*d-(a.browser.safari&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():g?0:f.scrollLeft())*d)}},_generatePosition:function(b){var c=this.options,d=this.cssPosition=="absolute"&&(this.scrollParent[0]==document||!a.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(d[0].tagName);this.cssPosition=="relative"&&(this.scrollParent[0]==document||this.scrollParent[0]==this.offsetParent[0])&&(this.offset.relative=this._getRelativeOffset());var f=b.pageX,g=b.pageY;if(this.originalPosition){this.containment&&(b.pageX-this.offset.click.left<this.containment[0]&&(f=this.containment[0]+this.offset.click.left),b.pageY-this.offset.click.top<this.containment[1]&&(g=this.containment[1]+this.offset.click.top),b.pageX-this.offset.click.left>this.containment[2]&&(f=this.containment[2]+this.offset.click.left),b.pageY-this.offset.click.top>this.containment[3]&&(g=this.containment[3]+this.offset.click.top));if(c.grid){var h=this.originalPageY+Math.round((g-this.originalPageY)/c.grid[1])*c.grid[1];g=this.containment?h-this.offset.click.top<this.containment[1]||h-this.offset.click.top>this.containment[3]?h-this.offset.click.top<this.containment[1]?h+c.grid[1]:h-c.grid[1]:h:h;var i=this.originalPageX+Math.round((f-this.originalPageX)/c.grid[0])*c.grid[0];f=this.containment?i-this.offset.click.left<this.containment[0]||i-this.offset.click.left>this.containment[2]?i-this.offset.click.left<this.containment[0]?i+c.grid[0]:i-c.grid[0]:i:i}}return{top:g-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(a.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:d.scrollTop()),left:f-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(a.browser.safari&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:d.scrollLeft())}},_rearrange:function(a,b,c,d){c?c[0].appendChild(this.placeholder[0]):b.item[0].parentNode.insertBefore(this.placeholder[0],this.direction=="down"?b.item[0]:b.item[0].nextSibling),this.counter=this.counter?++this.counter:1;var e=this,f=this.counter;window.setTimeout(function(){f==e.counter&&e.refreshPositions(!d)},0)},_clear:function(b,c){this.reverting=!1;var d=[],e=this;!this._noFinalSort&&this.currentItem.parent().length&&this.placeholder.before(this.currentItem),this._noFinalSort=null;if(this.helper[0]==this.currentItem[0]){for(var f in this._storedCSS)if(this._storedCSS[f]=="auto"||this._storedCSS[f]=="static")this._storedCSS[f]="";this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")}else this.currentItem.show();this.fromOutside&&!c&&d.push(function(a){this._trigger("receive",a,this._uiHash(this.fromOutside))}),(this.fromOutside||this.domPosition.prev!=this.currentItem.prev().not(".ui-sortable-helper")[0]||this.domPosition.parent!=this.currentItem.parent()[0])&&!c&&d.push(function(a){this._trigger("update",a,this._uiHash())});if(!a.ui.contains(this.element[0],this.currentItem[0])){c||d.push(function(a){this._trigger("remove",a,this._uiHash())});for(var f=this.containers.length-1;f>=0;f--)a.ui.contains(this.containers[f].element[0],this.currentItem[0])&&!c&&(d.push(function(a){return function(b){a._trigger("receive",b,this._uiHash(this))}}.call(this,this.containers[f])),d.push(function(a){return function(b){a._trigger("update",b,this._uiHash(this))}}.call(this,this.containers[f])))}for(var f=this.containers.length-1;f>=0;f--)c||d.push(function(a){return function(b){a._trigger("deactivate",b,this._uiHash(this))}}.call(this,this.containers[f])),this.containers[f].containerCache.over&&(d.push(function(a){return function(b){a._trigger("out",b,this._uiHash(this))}}.call(this,this.containers[f])),this.containers[f].containerCache.over=0);this._storedCursor&&a("body").css("cursor",this._storedCursor),this._storedOpacity&&this.helper.css("opacity",this._storedOpacity),this._storedZIndex&&this.helper.css("zIndex",this._storedZIndex=="auto"?"":this._storedZIndex),this.dragging=!1;if(this.cancelHelperRemoval){if(!c){this._trigger("beforeStop",b,this._uiHash());for(var f=0;f<d.length;f++)d[f].call(this,b);this._trigger("stop",b,this._uiHash())}return!1}c||this._trigger("beforeStop",b,this._uiHash()),this.placeholder[0].parentNode.removeChild(this.placeholder[0]),this.helper[0]!=this.currentItem[0]&&this.helper.remove(),this.helper=null;if(!c){for(var f=0;f<d.length;f++)d[f].call(this,b);this._trigger("stop",b,this._uiHash())}return this.fromOutside=!1,!0},_trigger:function(){a.Widget.prototype._trigger.apply(this,arguments)===!1&&this.cancel()},_uiHash:function(b){var c=b||this;return{helper:c.helper,placeholder:c.placeholder||a([]),position:c.position,originalPosition:c.originalPosition,offset:c.positionAbs,item:c.currentItem,sender:b?b.element:null}}}),a.extend(a.ui.sortable,{version:"1.8.21"})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.accordion.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.accordion",{options:{active:0,animated:"slide",autoHeight:!0,clearStyle:!1,collapsible:!1,event:"click",fillSpace:!1,header:"> li > :first-child,> :not(li):even",icons:{header:"ui-icon-triangle-1-e",headerSelected:"ui-icon-triangle-1-s"},navigation:!1,navigationFilter:function(){return this.href.toLowerCase()===location.href.toLowerCase()}},_create:function(){var b=this,c=b.options;b.running=0,b.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix"),b.headers=b.element.find(c.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function(){if(c.disabled)return;a(this).addClass("ui-state-hover")}).bind("mouseleave.accordion",function(){if(c.disabled)return;a(this).removeClass("ui-state-hover")}).bind("focus.accordion",function(){if(c.disabled)return;a(this).addClass("ui-state-focus")}).bind("blur.accordion",function(){if(c.disabled)return;a(this).removeClass("ui-state-focus")}),b.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");if(c.navigation){var d=b.element.find("a").filter(c.navigationFilter).eq(0);if(d.length){var e=d.closest(".ui-accordion-header");e.length?b.active=e:b.active=d.closest(".ui-accordion-content").prev()}}b.active=b._findActive(b.active||c.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top"),b.active.next().addClass("ui-accordion-content-active"),b._createIcons(),b.resize(),b.element.attr("role","tablist"),b.headers.attr("role","tab").bind("keydown.accordion",function(a){return b._keydown(a)}).next().attr("role","tabpanel"),b.headers.not(b.active||"").attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).next().hide(),b.active.length?b.active.attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}):b.headers.eq(0).attr("tabIndex",0),a.browser.safari||b.headers.find("a").attr("tabIndex",-1),c.event&&b.headers.bind(c.event.split(" ").join(".accordion ")+".accordion",function(a){b._clickHandler.call(b,a,this),a.preventDefault()})},_createIcons:function(){var b=this.options;b.icons&&(a("<span></span>").addClass("ui-icon "+b.icons.header).prependTo(this.headers),this.active.children(".ui-icon").toggleClass(b.icons.header).toggleClass(b.icons.headerSelected),this.element.addClass("ui-accordion-icons"))},_destroyIcons:function(){this.headers.children(".ui-icon").remove(),this.element.removeClass("ui-accordion-icons")},destroy:function(){var b=this.options;this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"),this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex"),this.headers.find("a").removeAttr("tabIndex"),this._destroyIcons();var c=this.headers.next().css("display","").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");return(b.autoHeight||b.fillHeight)&&c.css("height",""),a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments),b=="active"&&this.activate(c),b=="icons"&&(this._destroyIcons(),c&&this._createIcons()),b=="disabled"&&this.headers.add(this.headers.next())[c?"addClass":"removeClass"]("ui-accordion-disabled ui-state-disabled")},_keydown:function(b){if(this.options.disabled||b.altKey||b.ctrlKey)return;var c=a.ui.keyCode,d=this.headers.length,e=this.headers.index(b.target),f=!1;switch(b.keyCode){case c.RIGHT:case c.DOWN:f=this.headers[(e+1)%d];break;case c.LEFT:case c.UP:f=this.headers[(e-1+d)%d];break;case c.SPACE:case c.ENTER:this._clickHandler({target:b.target},b.target),b.preventDefault()}return f?(a(b.target).attr("tabIndex",-1),a(f).attr("tabIndex",0),f.focus(),!1):!0},resize:function(){var b=this.options,c;if(b.fillSpace){if(a.browser.msie){var d=this.element.parent().css("overflow");this.element.parent().css("overflow","hidden")}c=this.element.parent().height(),a.browser.msie&&this.element.parent().css("overflow",d),this.headers.each(function(){c-=a(this).outerHeight(!0)}),this.headers.next().each(function(){a(this).height(Math.max(0,c-a(this).innerHeight()+a(this).height()))}).css("overflow","auto")}else b.autoHeight&&(c=0,this.headers.next().each(function(){c=Math.max(c,a(this).height("").height())}).height(c));return this},activate:function(a){this.options.active=a;var b=this._findActive(a)[0];return this._clickHandler({target:b},b),this},_findActive:function(b){return b?typeof b=="number"?this.headers.filter(":eq("+b+")"):this.headers.not(this.headers.not(b)):b===!1?a([]):this.headers.filter(":eq(0)")},_clickHandler:function(b,c){var d=this.options;if(d.disabled)return;if(!b.target){if(!d.collapsible)return;this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header),this.active.next().addClass("ui-accordion-content-active");var e=this.active.next(),f={options:d,newHeader:a([]),oldHeader:d.active,newContent:a([]),oldContent:e},g=this.active=a([]);this._toggle(g,e,f);return}var h=a(b.currentTarget||c),i=h[0]===this.active[0];d.active=d.collapsible&&i?!1:this.headers.index(h);if(this.running||!d.collapsible&&i)return;var j=this.active,g=h.next(),e=this.active.next(),f={options:d,newHeader:i&&d.collapsible?a([]):h,oldHeader:this.active,newContent:i&&d.collapsible?a([]):g,oldContent:e},k=this.headers.index(this.active[0])>this.headers.index(h[0]);this.active=i?a([]):h,this._toggle(g,e,f,i,k),j.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(d.icons.headerSelected).addClass(d.icons.header),i||(h.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(d.icons.header).addClass(d.icons.headerSelected),h.next().addClass("ui-accordion-content-active"));return},_toggle:function(b,c,d,e,f){var g=this,h=g.options;g.toShow=b,g.toHide=c,g.data=d;var i=function(){if(!g)return;return g._completed.apply(g,arguments)};g._trigger("changestart",null,g.data),g.running=c.size()===0?b.size():c.size();if(h.animated){var j={};h.collapsible&&e?j={toShow:a([]),toHide:c,complete:i,down:f,autoHeight:h.autoHeight||h.fillSpace}:j={toShow:b,toHide:c,complete:i,down:f,autoHeight:h.autoHeight||h.fillSpace},h.proxied||(h.proxied=h.animated),h.proxiedDuration||(h.proxiedDuration=h.duration),h.animated=a.isFunction(h.proxied)?h.proxied(j):h.proxied,h.duration=a.isFunction(h.proxiedDuration)?h.proxiedDuration(j):h.proxiedDuration;var k=a.ui.accordion.animations,l=h.duration,m=h.animated;m&&!k[m]&&!a.easing[m]&&(m="slide"),k[m]||(k[m]=function(a){this.slide(a,{easing:m,duration:l||700})}),k[m](j)}else h.collapsible&&e?b.toggle():(c.hide(),b.show()),i(!0);c.prev().attr({"aria-expanded":"false","aria-selected":"false",tabIndex:-1}).blur(),b.prev().attr({"aria-expanded":"true","aria-selected":"true",tabIndex:0}).focus()},_completed:function(a){this.running=a?0:--this.running;if(this.running)return;this.options.clearStyle&&this.toShow.add(this.toHide).css({height:"",overflow:""}),this.toHide.removeClass("ui-accordion-content-active"),this.toHide.length&&(this.toHide.parent()[0].className=this.toHide.parent()[0].className),this._trigger("change",null,this.data)}}),a.extend(a.ui.accordion,{version:"1.8.21",animations:{slide:function(b,c){b=a.extend({easing:"swing",duration:300},b,c);if(!b.toHide.size()){b.toShow.animate({height:"show",paddingTop:"show",paddingBottom:"show"},b);return}if(!b.toShow.size()){b.toHide.animate({height:"hide",paddingTop:"hide",paddingBottom:"hide"},b);return}var d=b.toShow.css("overflow"),e=0,f={},g={},h=["height","paddingTop","paddingBottom"],i,j=b.toShow;i=j[0].style.width,j.width(j.parent().width()-parseFloat(j.css("paddingLeft"))-parseFloat(j.css("paddingRight"))-(parseFloat(j.css("borderLeftWidth"))||0)-(parseFloat(j.css("borderRightWidth"))||0)),a.each(h,function(c,d){g[d]="hide";var e=(""+a.css(b.toShow[0],d)).match(/^([\d+-.]+)(.*)$/);f[d]={value:e[1],unit:e[2]||"px"}}),b.toShow.css({height:0,overflow:"hidden"}).show(),b.toHide.filter(":hidden").each(b.complete).end().filter(":visible").animate(g,{step:function(a,c){c.prop=="height"&&(e=c.end-c.start===0?0:(c.now-c.start)/(c.end-c.start)),b.toShow[0].style[c.prop]=e*f[c.prop].value+f[c.prop].unit},duration:b.duration,easing:b.easing,complete:function(){b.autoHeight||b.toShow.css("height",""),b.toShow.css({width:i,overflow:d}),b.complete()}})},bounceslide:function(a){this.slide(a,{easing:a.down?"easeOutBounce":"swing",duration:a.down?1e3:200})}}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.autocomplete.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){var c=0;a.widget("ui.autocomplete",{options:{appendTo:"body",autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null},pending:0,_create:function(){var b=this,c=this.element[0].ownerDocument,d;this.isMultiLine=this.element.is("textarea"),this.element.addClass("ui-autocomplete-input").attr("autocomplete","off").attr({role:"textbox","aria-autocomplete":"list","aria-haspopup":"true"}).bind("keydown.autocomplete",function(c){if(b.options.disabled||b.element.propAttr("readOnly"))return;d=!1;var e=a.ui.keyCode;switch(c.keyCode){case e.PAGE_UP:b._move("previousPage",c);break;case e.PAGE_DOWN:b._move("nextPage",c);break;case e.UP:b._keyEvent("previous",c);break;case e.DOWN:b._keyEvent("next",c);break;case e.ENTER:case e.NUMPAD_ENTER:b.menu.active&&(d=!0,c.preventDefault());case e.TAB:if(!b.menu.active)return;b.menu.select(c);break;case e.ESCAPE:b.element.val(b.term),b.close(c);break;default:clearTimeout(b.searching),b.searching=setTimeout(function(){b.term!=b.element.val()&&(b.selectedItem=null,b.search(null,c))},b.options.delay)}}).bind("keypress.autocomplete",function(a){d&&(d=!1,a.preventDefault())}).bind("focus.autocomplete",function(){if(b.options.disabled)return;b.selectedItem=null,b.previous=b.element.val()}).bind("blur.autocomplete",function(a){if(b.options.disabled)return;clearTimeout(b.searching),b.closing=setTimeout(function(){b.close(a),b._change(a)},150)}),this._initSource(),this.menu=a("<ul></ul>").addClass("ui-autocomplete").appendTo(a(this.options.appendTo||"body",c)[0]).mousedown(function(c){var d=b.menu.element[0];a(c.target).closest(".ui-menu-item").length||setTimeout(function(){a(document).one("mousedown",function(c){c.target!==b.element[0]&&c.target!==d&&!a.ui.contains(d,c.target)&&b.close()})},1),setTimeout(function(){clearTimeout(b.closing)},13)}).menu({focus:function(a,c){var d=c.item.data("item.autocomplete");!1!==b._trigger("focus",a,{item:d})&&/^key/.test(a.originalEvent.type)&&b.element.val(d.value)},selected:function(a,d){var e=d.item.data("item.autocomplete"),f=b.previous;b.element[0]!==c.activeElement&&(b.element.focus(),b.previous=f,setTimeout(function(){b.previous=f,b.selectedItem=e},1)),!1!==b._trigger("select",a,{item:e})&&b.element.val(e.value),b.term=b.element.val(),b.close(a),b.selectedItem=e},blur:function(a,c){b.menu.element.is(":visible")&&b.element.val()!==b.term&&b.element.val(b.term)}}).zIndex(this.element.zIndex()+1).css({top:0,left:0}).hide().data("menu"),a.fn.bgiframe&&this.menu.element.bgiframe(),b.beforeunloadHandler=function(){b.element.removeAttr("autocomplete")},a(window).bind("beforeunload",b.beforeunloadHandler)},destroy:function(){this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup"),this.menu.element.remove(),a(window).unbind("beforeunload",this.beforeunloadHandler),a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments),b==="source"&&this._initSource(),b==="appendTo"&&this.menu.element.appendTo(a(c||"body",this.element[0].ownerDocument)[0]),b==="disabled"&&c&&this.xhr&&this.xhr.abort()},_initSource:function(){var b=this,c,d;a.isArray(this.options.source)?(c=this.options.source,this.source=function(b,d){d(a.ui.autocomplete.filter(c,b.term))}):typeof this.options.source=="string"?(d=this.options.source,this.source=function(c,e){b.xhr&&b.xhr.abort(),b.xhr=a.ajax({url:d,data:c,dataType:"json",success:function(a,b){e(a)},error:function(){e([])}})}):this.source=this.options.source},search:function(a,b){a=a!=null?a:this.element.val(),this.term=this.element.val();if(a.length<this.options.minLength)return this.close(b);clearTimeout(this.closing);if(this._trigger("search",b)===!1)return;return this._search(a)},_search:function(a){this.pending++,this.element.addClass("ui-autocomplete-loading"),this.source({term:a},this._response())},_response:function(){var a=this,b=++c;return function(d){b===c&&a.__response(d),a.pending--,a.pending||a.element.removeClass("ui-autocomplete-loading")}},__response:function(a){!this.options.disabled&&a&&a.length?(a=this._normalize(a),this._suggest(a),this._trigger("open")):this.close()},close:function(a){clearTimeout(this.closing),this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.deactivate(),this._trigger("close",a))},_change:function(a){this.previous!==this.element.val()&&this._trigger("change",a,{item:this.selectedItem})},_normalize:function(b){return b.length&&b[0].label&&b[0].value?b:a.map(b,function(b){return typeof b=="string"?{label:b,value:b}:a.extend({label:b.label||b.value,value:b.value||b.label},b)})},_suggest:function(b){var c=this.menu.element.empty().zIndex(this.element.zIndex()+1);this._renderMenu(c,b),this.menu.deactivate(),this.menu.refresh(),c.show(),this._resizeMenu(),c.position(a.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next(new a.Event("mouseover"))},_resizeMenu:function(){var a=this.menu.element;a.outerWidth(Math.max(a.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(b,c){var d=this;a.each(c,function(a,c){d._renderItem(b,c)})},_renderItem:function(b,c){return a("<li></li>").data("item.autocomplete",c).append(a("<a></a>").text(c.label)).appendTo(b)},_move:function(a,b){if(!this.menu.element.is(":visible")){this.search(null,b);return}if(this.menu.first()&&/^previous/.test(a)||this.menu.last()&&/^next/.test(a)){this.element.val(this.term),this.menu.deactivate();return}this.menu[a](b)},widget:function(){return this.menu.element},_keyEvent:function(a,b){if(!this.isMultiLine||this.menu.element.is(":visible"))this._move(a,b),b.preventDefault()}}),a.extend(a.ui.autocomplete,{escapeRegex:function(a){return a.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")},filter:function(b,c){var d=new RegExp(a.ui.autocomplete.escapeRegex(c),"i");return a.grep(b,function(a){return d.test(a.label||a.value||a)})}})})(jQuery),function(a){a.widget("ui.menu",{_create:function(){var b=this;this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role:"listbox","aria-activedescendant":"ui-active-menuitem"}).click(function(c){if(!a(c.target).closest(".ui-menu-item a").length)return;c.preventDefault(),b.select(c)}),this.refresh()},refresh:function(){var b=this,c=this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","menuitem");c.children("a").addClass("ui-corner-all").attr("tabindex",-1).mouseenter(function(c){b.activate(c,a(this).parent())}).mouseleave(function(){b.deactivate()})},activate:function(a,b){this.deactivate();if(this.hasScroll()){var c=b.offset().top-this.element.offset().top,d=this.element.scrollTop(),e=this.element.height();c<0?this.element.scrollTop(d+c):c>=e&&this.element.scrollTop(d+c-e+b.height())}this.active=b.eq(0).children("a").addClass("ui-state-hover").attr("id","ui-active-menuitem").end(),this._trigger("focus",a,{item:b})},deactivate:function(){if(!this.active)return;this.active.children("a").removeClass("ui-state-hover").removeAttr("id"),this._trigger("blur"),this.active=null},next:function(a){this.move("next",".ui-menu-item:first",a)},previous:function(a){this.move("prev",".ui-menu-item:last",a)},first:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},last:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},move:function(a,b,c){if(!this.active){this.activate(c,this.element.children(b));return}var d=this.active[a+"All"](".ui-menu-item").eq(0);d.length?this.activate(c,d):this.activate(c,this.element.children(b))},nextPage:function(b){if(this.hasScroll()){if(!this.active||this.last()){this.activate(b,this.element.children(".ui-menu-item:first"));return}var c=this.active.offset().top,d=this.element.height(),e=this.element.children(".ui-menu-item").filter(function(){var b=a(this).offset().top-c-d+a(this).height();return b<10&&b>-10});e.length||(e=this.element.children(".ui-menu-item:last")),this.activate(b,e)}else this.activate(b,this.element.children(".ui-menu-item").filter(!this.active||this.last()?":first":":last"))},previousPage:function(b){if(this.hasScroll()){if(!this.active||this.first()){this.activate(b,this.element.children(".ui-menu-item:last"));return}var c=this.active.offset().top,d=this.element.height(),e=this.element.children(".ui-menu-item").filter(function(){var b=a(this).offset().top-c+d-a(this).height();return b<10&&b>-10});e.length||(e=this.element.children(".ui-menu-item:first")),this.activate(b,e)}else this.activate(b,this.element.children(".ui-menu-item").filter(!this.active||this.first()?":last":":first"))},hasScroll:function(){return this.element.height()<this.element[a.fn.prop?"prop":"attr"]("scrollHeight")},select:function(a){this._trigger("selected",a,{item:this.active})}})}(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.button.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){var c,d,e,f,g="ui-button ui-widget ui-state-default ui-corner-all",h="ui-state-hover ui-state-active ",i="ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",j=function(){var b=a(this).find(":ui-button");setTimeout(function(){b.button("refresh")},1)},k=function(b){var c=b.name,d=b.form,e=a([]);return c&&(d?e=a(d).find("[name='"+c+"']"):e=a("[name='"+c+"']",b.ownerDocument).filter(function(){return!this.form})),e};a.widget("ui.button",{options:{disabled:null,text:!0,label:null,icons:{primary:null,secondary:null}},_create:function(){this.element.closest("form").unbind("reset.button").bind("reset.button",j),typeof this.options.disabled!="boolean"?this.options.disabled=!!this.element.propAttr("disabled"):this.element.propAttr("disabled",this.options.disabled),this._determineButtonType(),this.hasTitle=!!this.buttonElement.attr("title");var b=this,h=this.options,i=this.type==="checkbox"||this.type==="radio",l="ui-state-hover"+(i?"":" ui-state-active"),m="ui-state-focus";h.label===null&&(h.label=this.buttonElement.html()),this.buttonElement.addClass(g).attr("role","button").bind("mouseenter.button",function(){if(h.disabled)return;a(this).addClass("ui-state-hover"),this===c&&a(this).addClass("ui-state-active")}).bind("mouseleave.button",function(){if(h.disabled)return;a(this).removeClass(l)}).bind("click.button",function(a){h.disabled&&(a.preventDefault(),a.stopImmediatePropagation())}),this.element.bind("focus.button",function(){b.buttonElement.addClass(m)}).bind("blur.button",function(){b.buttonElement.removeClass(m)}),i&&(this.element.bind("change.button",function(){if(f)return;b.refresh()}),this.buttonElement.bind("mousedown.button",function(a){if(h.disabled)return;f=!1,d=a.pageX,e=a.pageY}).bind("mouseup.button",function(a){if(h.disabled)return;if(d!==a.pageX||e!==a.pageY)f=!0})),this.type==="checkbox"?this.buttonElement.bind("click.button",function(){if(h.disabled||f)return!1;a(this).toggleClass("ui-state-active"),b.buttonElement.attr("aria-pressed",b.element[0].checked)}):this.type==="radio"?this.buttonElement.bind("click.button",function(){if(h.disabled||f)return!1;a(this).addClass("ui-state-active"),b.buttonElement.attr("aria-pressed","true");var c=b.element[0];k(c).not(c).map(function(){return a(this).button("widget")[0]}).removeClass("ui-state-active").attr("aria-pressed","false")}):(this.buttonElement.bind("mousedown.button",function(){if(h.disabled)return!1;a(this).addClass("ui-state-active"),c=this,a(document).one("mouseup",function(){c=null})}).bind("mouseup.button",function(){if(h.disabled)return!1;a(this).removeClass("ui-state-active")}).bind("keydown.button",function(b){if(h.disabled)return!1;(b.keyCode==a.ui.keyCode.SPACE||b.keyCode==a.ui.keyCode.ENTER)&&a(this).addClass("ui-state-active")}).bind("keyup.button",function(){a(this).removeClass("ui-state-active")}),this.buttonElement.is("a")&&this.buttonElement.keyup(function(b){b.keyCode===a.ui.keyCode.SPACE&&a(this).click()})),this._setOption("disabled",h.disabled),this._resetButton()},_determineButtonType:function(){this.element.is(":checkbox")?this.type="checkbox":this.element.is(":radio")?this.type="radio":this.element.is("input")?this.type="input":this.type="button";if(this.type==="checkbox"||this.type==="radio"){var a=this.element.parents().filter(":last"),b="label[for='"+this.element.attr("id")+"']";this.buttonElement=a.find(b),this.buttonElement.length||(a=a.length?a.siblings():this.element.siblings(),this.buttonElement=a.filter(b),this.buttonElement.length||(this.buttonElement=a.find(b))),this.element.addClass("ui-helper-hidden-accessible");var c=this.element.is(":checked");c&&this.buttonElement.addClass("ui-state-active"),this.buttonElement.attr("aria-pressed",c)}else this.buttonElement=this.element},widget:function(){return this.buttonElement},destroy:function(){this.element.removeClass("ui-helper-hidden-accessible"),this.buttonElement.removeClass(g+" "+h+" "+i).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()),this.hasTitle||this.buttonElement.removeAttr("title"),a.Widget.prototype.destroy.call(this)},_setOption:function(b,c){a.Widget.prototype._setOption.apply(this,arguments);if(b==="disabled"){c?this.element.propAttr("disabled",!0):this.element.propAttr("disabled",!1);return}this._resetButton()},refresh:function(){var b=this.element.is(":disabled");b!==this.options.disabled&&this._setOption("disabled",b),this.type==="radio"?k(this.element[0]).each(function(){a(this).is(":checked")?a(this).button("widget").addClass("ui-state-active").attr("aria-pressed","true"):a(this).button("widget").removeClass("ui-state-active").attr("aria-pressed","false")}):this.type==="checkbox"&&(this.element.is(":checked")?this.buttonElement.addClass("ui-state-active").attr("aria-pressed","true"):this.buttonElement.removeClass("ui-state-active").attr("aria-pressed","false"))},_resetButton:function(){if(this.type==="input"){this.options.label&&this.element.val(this.options.label);return}var b=this.buttonElement.removeClass(i),c=a("<span></span>",this.element[0].ownerDocument).addClass("ui-button-text").html(this.options.label).appendTo(b.empty()).text(),d=this.options.icons,e=d.primary&&d.secondary,f=[];d.primary||d.secondary?(this.options.text&&f.push("ui-button-text-icon"+(e?"s":d.primary?"-primary":"-secondary")),d.primary&&b.prepend("<span class='ui-button-icon-primary ui-icon "+d.primary+"'></span>"),d.secondary&&b.append("<span class='ui-button-icon-secondary ui-icon "+d.secondary+"'></span>"),this.options.text||(f.push(e?"ui-button-icons-only":"ui-button-icon-only"),this.hasTitle||b.attr("title",c))):f.push("ui-button-text-only"),b.addClass(f.join(" "))}}),a.widget("ui.buttonset",{options:{items:":button, :submit, :reset, :checkbox, :radio, a, :data(button)"},_create:function(){this.element.addClass("ui-buttonset")},_init:function(){this.refresh()},_setOption:function(b,c){b==="disabled"&&this.buttons.button("option",b,c),a.Widget.prototype._setOption.apply(this,arguments)},refresh:function(){var b=this.element.css("direction")==="rtl";this.buttons=this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(b?"ui-corner-right":"ui-corner-left").end().filter(":last").addClass(b?"ui-corner-left":"ui-corner-right").end().end()},destroy:function(){this.element.removeClass("ui-buttonset"),this.buttons.map(function(){return a(this).button("widget")[0]}).removeClass("ui-corner-left ui-corner-right").end().button("destroy"),a.Widget.prototype.destroy.call(this)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.dialog.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){var c="ui-dialog ui-widget ui-widget-content ui-corner-all ",d={buttons:!0,height:!0,maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0,width:!0},e={maxHeight:!0,maxWidth:!0,minHeight:!0,minWidth:!0},f=a.attrFn||{val:!0,css:!0,html:!0,text:!0,data:!0,width:!0,height:!0,offset:!0,click:!0};a.widget("ui.dialog",{options:{autoOpen:!0,buttons:{},closeOnEscape:!0,closeText:"close",dialogClass:"",draggable:!0,hide:null,height:"auto",maxHeight:!1,maxWidth:!1,minHeight:150,minWidth:150,modal:!1,position:{my:"center",at:"center",collision:"fit",using:function(b){var c=a(this).css(b).offset().top;c<0&&a(this).css("top",b.top-c)}},resizable:!0,show:null,stack:!0,title:"",width:300,zIndex:1e3},_create:function(){this.originalTitle=this.element.attr("title"),typeof this.originalTitle!="string"&&(this.originalTitle=""),this.options.title=this.options.title||this.originalTitle;var b=this,d=b.options,e=d.title||"&#160;",f=a.ui.dialog.getTitleId(b.element),g=(b.uiDialog=a("<div></div>")).appendTo(document.body).hide().addClass(c+d.dialogClass).css({zIndex:d.zIndex}).attr("tabIndex",-1).css("outline",0).keydown(function(c){d.closeOnEscape&&!c.isDefaultPrevented()&&c.keyCode&&c.keyCode===a.ui.keyCode.ESCAPE&&(b.close(c),c.preventDefault())}).attr({role:"dialog","aria-labelledby":f}).mousedown(function(a){b.moveToTop(!1,a)}),h=b.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(g),i=(b.uiDialogTitlebar=a("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(g),j=a('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role","button").hover(function(){j.addClass("ui-state-hover")},function(){j.removeClass("ui-state-hover")}).focus(function(){j.addClass("ui-state-focus")}).blur(function(){j.removeClass("ui-state-focus")}).click(function(a){return b.close(a),!1}).appendTo(i),k=(b.uiDialogTitlebarCloseText=a("<span></span>")).addClass("ui-icon ui-icon-closethick").text(d.closeText).appendTo(j),l=a("<span></span>").addClass("ui-dialog-title").attr("id",f).html(e).prependTo(i);a.isFunction(d.beforeclose)&&!a.isFunction(d.beforeClose)&&(d.beforeClose=d.beforeclose),i.find("*").add(i).disableSelection(),d.draggable&&a.fn.draggable&&b._makeDraggable(),d.resizable&&a.fn.resizable&&b._makeResizable(),b._createButtons(d.buttons),b._isOpen=!1,a.fn.bgiframe&&g.bgiframe()},_init:function(){this.options.autoOpen&&this.open()},destroy:function(){var a=this;return a.overlay&&a.overlay.destroy(),a.uiDialog.hide(),a.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"),a.uiDialog.remove(),a.originalTitle&&a.element.attr("title",a.originalTitle),a},widget:function(){return this.uiDialog},close:function(b){var c=this,d,e;if(!1===c._trigger("beforeClose",b))return;return c.overlay&&c.overlay.destroy(),c.uiDialog.unbind("keypress.ui-dialog"),c._isOpen=!1,c.options.hide?c.uiDialog.hide(c.options.hide,function(){c._trigger("close",b)}):(c.uiDialog.hide(),c._trigger("close",b)),a.ui.dialog.overlay.resize(),c.options.modal&&(d=0,a(".ui-dialog").each(function(){this!==c.uiDialog[0]&&(e=a(this).css("z-index"),isNaN(e)||(d=Math.max(d,e)))}),a.ui.dialog.maxZ=d),c},isOpen:function(){return this._isOpen},moveToTop:function(b,c){var d=this,e=d.options,f;return e.modal&&!b||!e.stack&&!e.modal?d._trigger("focus",c):(e.zIndex>a.ui.dialog.maxZ&&(a.ui.dialog.maxZ=e.zIndex),d.overlay&&(a.ui.dialog.maxZ+=1,d.overlay.$el.css("z-index",a.ui.dialog.overlay.maxZ=a.ui.dialog.maxZ)),f={scrollTop:d.element.scrollTop(),scrollLeft:d.element.scrollLeft()},a.ui.dialog.maxZ+=1,d.uiDialog.css("z-index",a.ui.dialog.maxZ),d.element.attr(f),d._trigger("focus",c),d)},open:function(){if(this._isOpen)return;var b=this,c=b.options,d=b.uiDialog;return b.overlay=c.modal?new a.ui.dialog.overlay(b):null,b._size(),b._position(c.position),d.show(c.show),b.moveToTop(!0),c.modal&&d.bind("keydown.ui-dialog",function(b){if(b.keyCode!==a.ui.keyCode.TAB)return;var c=a(":tabbable",this),d=c.filter(":first"),e=c.filter(":last");if(b.target===e[0]&&!b.shiftKey)return d.focus(1),!1;if(b.target===d[0]&&b.shiftKey)return e.focus(1),!1}),a(b.element.find(":tabbable").get().concat(d.find(".ui-dialog-buttonpane :tabbable").get().concat(d.get()))).eq(0).focus(),b._isOpen=!0,b._trigger("open"),b},_createButtons:function(b){var c=this,d=!1,e=a("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"),g=a("<div></div>").addClass("ui-dialog-buttonset").appendTo(e);c.uiDialog.find(".ui-dialog-buttonpane").remove(),typeof b=="object"&&b!==null&&a.each(b,function(){return!(d=!0)}),d&&(a.each(b,function(b,d){d=a.isFunction(d)?{click:d,text:b}:d;var e=a('<button type="button"></button>').click(function(){d.click.apply(c.element[0],arguments)}).appendTo(g);a.each(d,function(a,b){if(a==="click")return;a in f?e[a](b):e.attr(a,b)}),a.fn.button&&e.button()}),e.appendTo(c.uiDialog))},_makeDraggable:function(){function f(a){return{position:a.position,offset:a.offset}}var b=this,c=b.options,d=a(document),e;b.uiDialog.draggable({cancel:".ui-dialog-content, .ui-dialog-titlebar-close",handle:".ui-dialog-titlebar",containment:"document",start:function(d,g){e=c.height==="auto"?"auto":a(this).height(),a(this).height(a(this).height()).addClass("ui-dialog-dragging"),b._trigger("dragStart",d,f(g))},drag:function(a,c){b._trigger("drag",a,f(c))},stop:function(g,h){c.position=[h.position.left-d.scrollLeft(),h.position.top-d.scrollTop()],a(this).removeClass("ui-dialog-dragging").height(e),b._trigger("dragStop",g,f(h)),a.ui.dialog.overlay.resize()}})},_makeResizable:function(c){function h(a){return{originalPosition:a.originalPosition,originalSize:a.originalSize,position:a.position,size:a.size}}c=c===b?this.options.resizable:c;var d=this,e=d.options,f=d.uiDialog.css("position"),g=typeof c=="string"?c:"n,e,s,w,se,sw,ne,nw";d.uiDialog.resizable({cancel:".ui-dialog-content",containment:"document",alsoResize:d.element,maxWidth:e.maxWidth,maxHeight:e.maxHeight,minWidth:e.minWidth,minHeight:d._minHeight(),handles:g,start:function(b,c){a(this).addClass("ui-dialog-resizing"),d._trigger("resizeStart",b,h(c))},resize:function(a,b){d._trigger("resize",a,h(b))},stop:function(b,c){a(this).removeClass("ui-dialog-resizing"),e.height=a(this).height(),e.width=a(this).width(),d._trigger("resizeStop",b,h(c)),a.ui.dialog.overlay.resize()}}).css("position",f).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")},_minHeight:function(){var a=this.options;return a.height==="auto"?a.minHeight:Math.min(a.minHeight,a.height)},_position:function(b){var c=[],d=[0,0],e;if(b){if(typeof b=="string"||typeof b=="object"&&"0"in b)c=b.split?b.split(" "):[b[0],b[1]],c.length===1&&(c[1]=c[0]),a.each(["left","top"],function(a,b){+c[a]===c[a]&&(d[a]=c[a],c[a]=b)}),b={my:c.join(" "),at:c.join(" "),offset:d.join(" ")};b=a.extend({},a.ui.dialog.prototype.options.position,b)}else b=a.ui.dialog.prototype.options.position;e=this.uiDialog.is(":visible"),e||this.uiDialog.show(),this.uiDialog.css({top:0,left:0}).position(a.extend({of:window},b)),e||this.uiDialog.hide()},_setOptions:function(b){var c=this,f={},g=!1;a.each(b,function(a,b){c._setOption(a,b),a in d&&(g=!0),a in e&&(f[a]=b)}),g&&this._size(),this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option",f)},_setOption:function(b,d){var e=this,f=e.uiDialog;switch(b){case"beforeclose":b="beforeClose";break;case"buttons":e._createButtons(d);break;case"closeText":e.uiDialogTitlebarCloseText.text(""+d);break;case"dialogClass":f.removeClass(e.options.dialogClass).addClass(c+d);break;case"disabled":d?f.addClass("ui-dialog-disabled"):f.removeClass("ui-dialog-disabled");break;case"draggable":var g=f.is(":data(draggable)");g&&!d&&f.draggable("destroy"),!g&&d&&e._makeDraggable();break;case"position":e._position(d);break;case"resizable":var h=f.is(":data(resizable)");h&&!d&&f.resizable("destroy"),h&&typeof d=="string"&&f.resizable("option","handles",d),!h&&d!==!1&&e._makeResizable(d);break;case"title":a(".ui-dialog-title",e.uiDialogTitlebar).html(""+(d||"&#160;"))}a.Widget.prototype._setOption.apply(e,arguments)},_size:function(){var b=this.options,c,d,e=this.uiDialog.is(":visible");this.element.show().css({width:"auto",minHeight:0,height:0}),b.minWidth>b.width&&(b.width=b.minWidth),c=this.uiDialog.css({height:"auto",width:b.width}).height(),d=Math.max(0,b.minHeight-c);if(b.height==="auto")if(a.support.minHeight)this.element.css({minHeight:d,height:"auto"});else{this.uiDialog.show();var f=this.element.css("height","auto").height();e||this.uiDialog.hide(),this.element.height(Math.max(f,d))}else this.element.height(Math.max(b.height-c,0));this.uiDialog.is(":data(resizable)")&&this.uiDialog.resizable("option","minHeight",this._minHeight())}}),a.extend(a.ui.dialog,{version:"1.8.21",uuid:0,maxZ:0,getTitleId:function(a){var b=a.attr("id");return b||(this.uuid+=1,b=this.uuid),"ui-dialog-title-"+b},overlay:function(b){this.$el=a.ui.dialog.overlay.create(b)}}),a.extend(a.ui.dialog.overlay,{instances:[],oldInstances:[],maxZ:0,events:a.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function(a){return a+".dialog-overlay"}).join(" "),create:function(b){this.instances.length===0&&(setTimeout(function(){a.ui.dialog.overlay.instances.length&&a(document).bind(a.ui.dialog.overlay.events,function(b){if(a(b.target).zIndex()<a.ui.dialog.overlay.maxZ)return!1})},1),a(document).bind("keydown.dialog-overlay",function(c){b.options.closeOnEscape&&!c.isDefaultPrevented()&&c.keyCode&&c.keyCode===a.ui.keyCode.ESCAPE&&(b.close(c),c.preventDefault())}),a(window).bind("resize.dialog-overlay",a.ui.dialog.overlay.resize));var c=(this.oldInstances.pop()||a("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width:this.width(),height:this.height()});return a.fn.bgiframe&&c.bgiframe(),this.instances.push(c),c},destroy:function(b){var c=a.inArray(b,this.instances);c!=-1&&this.oldInstances.push(this.instances.splice(c,1)[0]),this.instances.length===0&&a([document,window]).unbind(".dialog-overlay"),b.remove();var d=0;a.each(this.instances,function(){d=Math.max(d,this.css("z-index"))}),this.maxZ=d},height:function(){var b,c;return a.browser.msie&&a.browser.version<7?(b=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight),c=Math.max(document.documentElement.offsetHeight,document.body.offsetHeight),b<c?a(window).height()+"px":b+"px"):a(document).height()+"px"},width:function(){var b,c;return a.browser.msie?(b=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),c=Math.max(document.documentElement.offsetWidth,document.body.offsetWidth),b<c?a(window).width()+"px":b+"px"):a(document).width()+"px"},resize:function(){var b=a([]);a.each(a.ui.dialog.overlay.instances,function(){b=b.add(this)}),b.css({width:0,height:0}).css({width:a.ui.dialog.overlay.width(),height:a.ui.dialog.overlay.height()})}}),a.extend(a.ui.dialog.overlay.prototype,{destroy:function(){a.ui.dialog.overlay.destroy(this.$el)}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.slider.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){var c=5;a.widget("ui.slider",a.ui.mouse,{widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null},_create:function(){var b=this,d=this.options,e=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),f="<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",g=d.values&&d.values.length||1,h=[];this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"+(d.disabled?" ui-slider-disabled ui-disabled":"")),this.range=a([]),d.range&&(d.range===!0&&(d.values||(d.values=[this._valueMin(),this._valueMin()]),d.values.length&&d.values.length!==2&&(d.values=[d.values[0],d.values[0]])),this.range=a("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header"+(d.range==="min"||d.range==="max"?" ui-slider-range-"+d.range:"")));for(var i=e.length;i<g;i+=1)h.push(f);this.handles=e.add(a(h.join("")).appendTo(b.element)),this.handle=this.handles.eq(0),this.handles.add(this.range).filter("a").click(function(a){a.preventDefault()}).hover(function(){d.disabled||a(this).addClass("ui-state-hover")},function(){a(this).removeClass("ui-state-hover")}).focus(function(){d.disabled?a(this).blur():(a(".ui-slider .ui-state-focus").removeClass("ui-state-focus"),a(this).addClass("ui-state-focus"))}).blur(function(){a(this).removeClass("ui-state-focus")}),this.handles.each(function(b){a(this).data("index.ui-slider-handle",b)}),this.handles.keydown(function(d){var e=a(this).data("index.ui-slider-handle"),f,g,h,i;if(b.options.disabled)return;switch(d.keyCode){case a.ui.keyCode.HOME:case a.ui.keyCode.END:case a.ui.keyCode.PAGE_UP:case a.ui.keyCode.PAGE_DOWN:case a.ui.keyCode.UP:case a.ui.keyCode.RIGHT:case a.ui.keyCode.DOWN:case a.ui.keyCode.LEFT:d.preventDefault();if(!b._keySliding){b._keySliding=!0,a(this).addClass("ui-state-active"),f=b._start(d,e);if(f===!1)return}}i=b.options.step,b.options.values&&b.options.values.length?g=h=b.values(e):g=h=b.value();switch(d.keyCode){case a.ui.keyCode.HOME:h=b._valueMin();break;case a.ui.keyCode.END:h=b._valueMax();break;case a.ui.keyCode.PAGE_UP:h=b._trimAlignValue(g+(b._valueMax()-b._valueMin())/c);break;case a.ui.keyCode.PAGE_DOWN:h=b._trimAlignValue(g-(b._valueMax()-b._valueMin())/c);break;case a.ui.keyCode.UP:case a.ui.keyCode.RIGHT:if(g===b._valueMax())return;h=b._trimAlignValue(g+i);break;case a.ui.keyCode.DOWN:case a.ui.keyCode.LEFT:if(g===b._valueMin())return;h=b._trimAlignValue(g-i)}b._slide(d,e,h)}).keyup(function(c){var d=a(this).data("index.ui-slider-handle");b._keySliding&&(b._keySliding=!1,b._stop(c,d),b._change(c,d),a(this).removeClass("ui-state-active"))}),this._refreshValue(),this._animateOff=!1},destroy:function(){return this.handles.remove(),this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider"),this._mouseDestroy(),this},_mouseCapture:function(b){var c=this.options,d,e,f,g,h,i,j,k,l;return c.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),d={x:b.pageX,y:b.pageY},e=this._normValueFromMouse(d),f=this._valueMax()-this._valueMin()+1,h=this,this.handles.each(function(b){var c=Math.abs(e-h.values(b));f>c&&(f=c,g=a(this),i=b)}),c.range===!0&&this.values(1)===c.min&&(i+=1,g=a(this.handles[i])),j=this._start(b,i),j===!1?!1:(this._mouseSliding=!0,h._handleIndex=i,g.addClass("ui-state-active").focus(),k=g.offset(),l=!a(b.target).parents().andSelf().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:b.pageX-k.left-g.width()/2,top:b.pageY-k.top-g.height()/2-(parseInt(g.css("borderTopWidth"),10)||0)-(parseInt(g.css("borderBottomWidth"),10)||0)+(parseInt(g.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(b,i,e),this._animateOff=!0,!0))},_mouseStart:function(a){return!0},_mouseDrag:function(a){var b={x:a.pageX,y:a.pageY},c=this._normValueFromMouse(b);return this._slide(a,this._handleIndex,c),!1},_mouseStop:function(a){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(a,this._handleIndex),this._change(a,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation=this.options.orientation==="vertical"?"vertical":"horizontal"},_normValueFromMouse:function(a){var b,c,d,e,f;return this.orientation==="horizontal"?(b=this.elementSize.width,c=a.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(b=this.elementSize.height,c=a.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),d=c/b,d>1&&(d=1),d<0&&(d=0),this.orientation==="vertical"&&(d=1-d),e=this._valueMax()-this._valueMin(),f=this._valueMin()+d*e,this._trimAlignValue(f)},_start:function(a,b){var c={handle:this.handles[b],value:this.value()};return this.options.values&&this.options.values.length&&(c.value=this.values(b),c.values=this.values()),this._trigger("start",a,c)},_slide:function(a,b,c){var d,e,f;this.options.values&&this.options.values.length?(d=this.values(b?0:1),this.options.values.length===2&&this.options.range===!0&&(b===0&&c>d||b===1&&c<d)&&(c=d),c!==this.values(b)&&(e=this.values(),e[b]=c,f=this._trigger("slide",a,{handle:this.handles[b],value:c,values:e}),d=this.values(b?0:1),f!==!1&&this.values(b,c,!0))):c!==this.value()&&(f=this._trigger("slide",a,{handle:this.handles[b],value:c}),f!==!1&&this.value(c))},_stop:function(a,b){var c={handle:this.handles[b],value:this.value()};this.options.values&&this.options.values.length&&(c.value=this.values(b),c.values=this.values()),this._trigger("stop",a,c)},_change:function(a,b){if(!this._keySliding&&!this._mouseSliding){var c={handle:this.handles[b],value:this.value()};this.options.values&&this.options.values.length&&(c.value=this.values(b),c.values=this.values()),this._trigger("change",a,c)}},value:function(a){if(arguments.length){this.options.value=this._trimAlignValue(a),this._refreshValue(),this._change(null,0);return}return this._value()},values:function(b,c){var d,e,f;if(arguments.length>1){this.options.values[b]=this._trimAlignValue(c),this._refreshValue(),this._change(null,b);return}if(!arguments.length)return this._values();if(!a.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(b):this.value();d=this.options.values,e=arguments[0];for(f=0;f<d.length;f+=1)d[f]=this._trimAlignValue(e[f]),this._change(null,f);this._refreshValue()},_setOption:function(b,c){var d,e=0;a.isArray(this.options.values)&&(e=this.options.values.length),a.Widget.prototype._setOption.apply(this,arguments);switch(b){case"disabled":c?(this.handles.filter(".ui-state-focus").blur(),this.handles.removeClass("ui-state-hover"),this.handles.propAttr("disabled",!0),this.element.addClass("ui-disabled")):(this.handles.propAttr("disabled",!1),this.element.removeClass("ui-disabled"));break;case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue();break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":this._animateOff=!0,this._refreshValue();for(d=0;d<e;d+=1)this._change(null,d);this._animateOff=!1}},_value:function(){var a=this.options.value;return a=this._trimAlignValue(a),a},_values:function(a){var b,c,d;if(arguments.length)return b=this.options.values[a],b=this._trimAlignValue(b),b;c=this.options.values.slice();for(d=0;d<c.length;d+=1)c[d]=this._trimAlignValue(c[d]);return c},_trimAlignValue:function(a){if(a<=this._valueMin())return this._valueMin();if(a>=this._valueMax())return this._valueMax();var b=this.options.step>0?this.options.step:1,c=(a-this._valueMin())%b,d=a-c;return Math.abs(c)*2>=b&&(d+=c>0?b:-b),parseFloat(d.toFixed(5))},_valueMin:function(){return this.options.min},_valueMax:function(){return this.options.max},_refreshValue:function(){var b=this.options.range,c=this.options,d=this,e=this._animateOff?!1:c.animate,f,g={},h,i,j,k;this.options.values&&this.options.values.length?this.handles.each(function(b,i){f=(d.values(b)-d._valueMin())/(d._valueMax()-d._valueMin())*100,g[d.orientation==="horizontal"?"left":"bottom"]=f+"%",a(this).stop(1,1)[e?"animate":"css"](g,c.animate),d.options.range===!0&&(d.orientation==="horizontal"?(b===0&&d.range.stop(1,1)[e?"animate":"css"]({left:f+"%"},c.animate),b===1&&d.range[e?"animate":"css"]({width:f-h+"%"},{queue:!1,duration:c.animate})):(b===0&&d.range.stop(1,1)[e?"animate":"css"]({bottom:f+"%"},c.animate),b===1&&d.range[e?"animate":"css"]({height:f-h+"%"},{queue:!1,duration:c.animate}))),h=f}):(i=this.value(),j=this._valueMin(),k=this._valueMax(),f=k!==j?(i-j)/(k-j)*100:0,g[d.orientation==="horizontal"?"left":"bottom"]=f+"%",this.handle.stop(1,1)[e?"animate":"css"](g,c.animate),b==="min"&&this.orientation==="horizontal"&&this.range.stop(1,1)[e?"animate":"css"]({width:f+"%"},c.animate),b==="max"&&this.orientation==="horizontal"&&this.range[e?"animate":"css"]({width:100-f+"%"},{queue:!1,duration:c.animate}),b==="min"&&this.orientation==="vertical"&&this.range.stop(1,1)[e?"animate":"css"]({height:f+"%"},c.animate),b==="max"&&this.orientation==="vertical"&&this.range[e?"animate":"css"]({height:100-f+"%"},{queue:!1,duration:c.animate}))}}),a.extend(a.ui.slider,{version:"1.8.21"})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.tabs.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){function e(){return++c}function f(){return++d}var c=0,d=0;a.widget("ui.tabs",{options:{add:null,ajaxOptions:null,cache:!1,cookie:null,collapsible:!1,disable:null,disabled:[],enable:null,event:"click",fx:null,idPrefix:"ui-tabs-",load:null,panelTemplate:"<div></div>",remove:null,select:null,show:null,spinner:"<em>Loading&#8230;</em>",tabTemplate:"<li><a href='#{href}'><span>#{label}</span></a></li>"},_create:function(){this._tabify(!0)},_setOption:function(a,b){if(a=="selected"){if(this.options.collapsible&&b==this.options.selected)return;this.select(b)}else this.options[a]=b,this._tabify()},_tabId:function(a){return a.title&&a.title.replace(/\s/g,"_").replace(/[^\w\u00c0-\uFFFF-]/g,"")||this.options.idPrefix+e()},_sanitizeSelector:function(a){return a.replace(/:/g,"\\:")},_cookie:function(){var b=this.cookie||(this.cookie=this.options.cookie.name||"ui-tabs-"+f());return a.cookie.apply(null,[b].concat(a.makeArray(arguments)))},_ui:function(a,b){return{tab:a,panel:b,index:this.anchors.index(a)}},_cleanup:function(){this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function(){var b=a(this);b.html(b.data("label.tabs")).removeData("label.tabs")})},_tabify:function(c){function m(b,c){b.css("display",""),!a.support.opacity&&c.opacity&&b[0].style.removeAttribute("filter")}var d=this,e=this.options,f=/^#.+/;this.list=this.element.find("ol,ul").eq(0),this.lis=a(" > li:has(a[href])",this.list),this.anchors=this.lis.map(function(){return a("a",this)[0]}),this.panels=a([]),this.anchors.each(function(b,c){var g=a(c).attr("href"),h=g.split("#")[0],i;h&&(h===location.toString().split("#")[0]||(i=a("base")[0])&&h===i.href)&&(g=c.hash,c.href=g);if(f.test(g))d.panels=d.panels.add(d.element.find(d._sanitizeSelector(g)));else if(g&&g!=="#"){a.data(c,"href.tabs",g),a.data(c,"load.tabs",g.replace(/#.*$/,""));var j=d._tabId(c);c.href="#"+j;var k=d.element.find("#"+j);k.length||(k=a(e.panelTemplate).attr("id",j).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(d.panels[b-1]||d.list),k.data("destroy.tabs",!0)),d.panels=d.panels.add(k)}else e.disabled.push(b)}),c?(this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all"),this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"),this.lis.addClass("ui-state-default ui-corner-top"),this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom"),e.selected===b?(location.hash&&this.anchors.each(function(a,b){if(b.hash==location.hash)return e.selected=a,!1}),typeof e.selected!="number"&&e.cookie&&(e.selected=parseInt(d._cookie(),10)),typeof e.selected!="number"&&this.lis.filter(".ui-tabs-selected").length&&(e.selected=this.lis.index(this.lis.filter(".ui-tabs-selected"))),e.selected=e.selected||(this.lis.length?0:-1)):e.selected===null&&(e.selected=-1),e.selected=e.selected>=0&&this.anchors[e.selected]||e.selected<0?e.selected:0,e.disabled=a.unique(e.disabled.concat(a.map(this.lis.filter(".ui-state-disabled"),function(a,b){return d.lis.index(a)}))).sort(),a.inArray(e.selected,e.disabled)!=-1&&e.disabled.splice(a.inArray(e.selected,e.disabled),1),this.panels.addClass("ui-tabs-hide"),this.lis.removeClass("ui-tabs-selected ui-state-active"),e.selected>=0&&this.anchors.length&&(d.element.find(d._sanitizeSelector(d.anchors[e.selected].hash)).removeClass("ui-tabs-hide"),this.lis.eq(e.selected).addClass("ui-tabs-selected ui-state-active"),d.element.queue("tabs",function(){d._trigger("show",null,d._ui(d.anchors[e.selected],d.element.find(d._sanitizeSelector(d.anchors[e.selected].hash))[0]))}),this.load(e.selected)),a(window).bind("unload",function(){d.lis.add(d.anchors).unbind(".tabs"),d.lis=d.anchors=d.panels=null})):e.selected=this.lis.index(this.lis.filter(".ui-tabs-selected")),this.element[e.collapsible?"addClass":"removeClass"]("ui-tabs-collapsible"),e.cookie&&this._cookie(e.selected,e.cookie);for(var g=0,h;h=this.lis[g];g++)a(h)[a.inArray(g,e.disabled)!=-1&&!a(h).hasClass("ui-tabs-selected")?"addClass":"removeClass"]("ui-state-disabled");e.cache===!1&&this.anchors.removeData("cache.tabs"),this.lis.add(this.anchors).unbind(".tabs");if(e.event!=="mouseover"){var i=function(a,b){b.is(":not(.ui-state-disabled)")&&b.addClass("ui-state-"+a)},j=function(a,b){b.removeClass("ui-state-"+a)};this.lis.bind("mouseover.tabs",function(){i("hover",a(this))}),this.lis.bind("mouseout.tabs",function(){j("hover",a(this))}),this.anchors.bind("focus.tabs",function(){i("focus",a(this).closest("li"))}),this.anchors.bind("blur.tabs",function(){j("focus",a(this).closest("li"))})}var k,l;e.fx&&(a.isArray(e.fx)?(k=e.fx[0],l=e.fx[1]):k=l=e.fx);var n=l?function(b,c){a(b).closest("li").addClass("ui-tabs-selected ui-state-active"),c.hide().removeClass("ui-tabs-hide").animate(l,l.duration||"normal",function(){m(c,l),d._trigger("show",null,d._ui(b,c[0]))})}:function(b,c){a(b).closest("li").addClass("ui-tabs-selected ui-state-active"),c.removeClass("ui-tabs-hide"),d._trigger("show",null,d._ui(b,c[0]))},o=k?function(a,b){b.animate(k,k.duration||"normal",function(){d.lis.removeClass("ui-tabs-selected ui-state-active"),b.addClass("ui-tabs-hide"),m(b,k),d.element.dequeue("tabs")})}:function(a,b,c){d.lis.removeClass("ui-tabs-selected ui-state-active"),b.addClass("ui-tabs-hide"),d.element.dequeue("tabs")};this.anchors.bind(e.event+".tabs",function(){var b=this,c=a(b).closest("li"),f=d.panels.filter(":not(.ui-tabs-hide)"),g=d.element.find(d._sanitizeSelector(b.hash));if(c.hasClass("ui-tabs-selected")&&!e.collapsible||c.hasClass("ui-state-disabled")||c.hasClass("ui-state-processing")||d.panels.filter(":animated").length||d._trigger("select",null,d._ui(this,g[0]))===!1)return this.blur(),!1;e.selected=d.anchors.index(this),d.abort();if(e.collapsible){if(c.hasClass("ui-tabs-selected"))return e.selected=-1,e.cookie&&d._cookie(e.selected,e.cookie),d.element.queue("tabs",function(){o(b,f)}).dequeue("tabs"),this.blur(),!1;if(!f.length)return e.cookie&&d._cookie(e.selected,e.cookie),d.element.queue("tabs",function(){n(b,g)}),d.load(d.anchors.index(this)),this.blur(),!1}e.cookie&&d._cookie(e.selected,e.cookie);if(g.length)f.length&&d.element.queue("tabs",function(){o(b,f)}),d.element.queue("tabs",function(){n(b,g)}),d.load(d.anchors.index(this));else throw"jQuery UI Tabs: Mismatching fragment identifier.";a.browser.msie&&this.blur()}),this.anchors.bind("click.tabs",function(){return!1})},_getIndex:function(a){return typeof a=="string"&&(a=this.anchors.index(this.anchors.filter("[href$='"+a+"']"))),a},destroy:function(){var b=this.options;return this.abort(),this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs"),this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"),this.anchors.each(function(){var b=a.data(this,"href.tabs");b&&(this.href=b);var c=a(this).unbind(".tabs");a.each(["href","load","cache"],function(a,b){c.removeData(b+".tabs")})}),this.lis.unbind(".tabs").add(this.panels).each(function(){a.data(this,"destroy.tabs")?a(this).remove():a(this).removeClass(["ui-state-default","ui-corner-top","ui-tabs-selected","ui-state-active","ui-state-hover","ui-state-focus","ui-state-disabled","ui-tabs-panel","ui-widget-content","ui-corner-bottom","ui-tabs-hide"].join(" "))}),b.cookie&&this._cookie(null,b.cookie),this},add:function(c,d,e){e===b&&(e=this.anchors.length);var f=this,g=this.options,h=a(g.tabTemplate.replace(/#\{href\}/g,c).replace(/#\{label\}/g,d)),i=c.indexOf("#")?this._tabId(a("a",h)[0]):c.replace("#","");h.addClass("ui-state-default ui-corner-top").data("destroy.tabs",!0);var j=f.element.find("#"+i);return j.length||(j=a(g.panelTemplate).attr("id",i).data("destroy.tabs",!0)),j.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"),e>=this.lis.length?(h.appendTo(this.list),j.appendTo(this.list[0].parentNode)):(h.insertBefore(this.lis[e]),j.insertBefore(this.panels[e])),g.disabled=a.map(g.disabled,function(a,b){return a>=e?++a:a}),this._tabify(),this.anchors.length==1&&(g.selected=0,h.addClass("ui-tabs-selected ui-state-active"),j.removeClass("ui-tabs-hide"),this.element.queue("tabs",function(){f._trigger("show",null,f._ui(f.anchors[0],f.panels[0]))}),this.load(0)),this._trigger("add",null,this._ui(this.anchors[e],this.panels[e])),this},remove:function(b){b=this._getIndex(b);var c=this.options,d=this.lis.eq(b).remove(),e=this.panels.eq(b).remove();return d.hasClass("ui-tabs-selected")&&this.anchors.length>1&&this.select(b+(b+1<this.anchors.length?1:-1)),c.disabled=a.map(a.grep(c.disabled,function(a,c){return a!=b}),function(a,c){return a>=b?--a:a}),this._tabify(),this._trigger("remove",null,this._ui(d.find("a")[0],e[0])),this},enable:function(b){b=this._getIndex(b);var c=this.options;if(a.inArray(b,c.disabled)==-1)return;return this.lis.eq(b).removeClass("ui-state-disabled"),c.disabled=a.grep(c.disabled,function(a,c){return a!=b}),this._trigger("enable",null,this._ui(this.anchors[b],this.panels[b])),this},disable:function(a){a=this._getIndex(a);var b=this,c=this.options;return a!=c.selected&&(this.lis.eq(a).addClass("ui-state-disabled"),c.disabled.push(a),c.disabled.sort(),this._trigger("disable",null,this._ui(this.anchors[a],this.panels[a]))),this},select:function(a){a=this._getIndex(a);if(a==-1)if(this.options.collapsible&&this.options.selected!=-1)a=this.options.selected;else return this;return this.anchors.eq(a).trigger(this.options.event+".tabs"),this},load:function(b){b=this._getIndex(b);var c=this,d=this.options,e=this.anchors.eq(b)[0],f=a.data(e,"load.tabs");this.abort();if(!f||this.element.queue("tabs").length!==0&&a.data(e,"cache.tabs")){this.element.dequeue("tabs");return}this.lis.eq(b).addClass("ui-state-processing");if(d.spinner){var g=a("span",e);g.data("label.tabs",g.html()).html(d.spinner)}return this.xhr=a.ajax(a.extend({},d.ajaxOptions,{url:f,success:function(f,g){c.element.find(c._sanitizeSelector(e.hash)).html(f),c._cleanup(),d.cache&&a.data(e,"cache.tabs",!0),c._trigger("load",null,c._ui(c.anchors[b],c.panels[b]));try{d.ajaxOptions.success(f,g)}catch(h){}},error:function(a,f,g){c._cleanup(),c._trigger("load",null,c._ui(c.anchors[b],c.panels[b]));try{d.ajaxOptions.error(a,f,b,e)}catch(g){}}})),c.element.dequeue("tabs"),this},abort:function(){return this.element.queue([]),this.panels.stop(!1,!0),this.element.queue("tabs",this.element.queue("tabs").splice(-2,2)),this.xhr&&(this.xhr.abort(),delete this.xhr),this._cleanup(),this},url:function(a,b){return this.anchors.eq(a).removeData("cache.tabs").data("load.tabs",b),this},length:function(){return this.anchors.length}}),a.extend(a.ui.tabs,{version:"1.8.21"}),a.extend(a.ui.tabs.prototype,{rotation:null,rotate:function(a,b){var c=this,d=this.options,e=c._rotate||(c._rotate=function(b){clearTimeout(c.rotation),c.rotation=setTimeout(function(){var a=d.selected;c.select(++a<c.anchors.length?a:0)},a),b&&b.stopPropagation()}),f=c._unrotate||(c._unrotate=b?function(a){e()}:function(a){a.clientX&&c.rotate(null)});return a?(this.element.bind("tabsshow",e),this.anchors.bind(d.event+".tabs",f),e()):(clearTimeout(c.rotation),this.element.unbind("tabsshow",e),this.anchors.unbind(d.event+".tabs",f),delete this._rotate,delete this._unrotate),this}})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.datepicker.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function($,undefined){function Datepicker(){this.debug=!1,this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},$.extend(this._defaults,this.regional[""]),this.dpDiv=bindHover($('<div id="'+this._mainDivId+'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))}function bindHover(a){var b="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return a.bind("mouseout",function(a){var c=$(a.target).closest(b);if(!c.length)return;c.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")}).bind("mouseover",function(c){var d=$(c.target).closest(b);if($.datepicker._isDisabledDatepicker(instActive.inline?a.parent()[0]:instActive.input[0])||!d.length)return;d.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),d.addClass("ui-state-hover"),d.hasClass("ui-datepicker-prev")&&d.addClass("ui-datepicker-prev-hover"),d.hasClass("ui-datepicker-next")&&d.addClass("ui-datepicker-next-hover")})}function extendRemove(a,b){$.extend(a,b);for(var c in b)if(b[c]==null||b[c]==undefined)a[c]=b[c];return a}function isArray(a){return a&&($.browser.safari&&typeof a=="object"&&a.length||a.constructor&&a.constructor.toString().match(/\Array\(\)/))}$.extend($.ui,{datepicker:{version:"1.8.21"}});var PROP_NAME="datepicker",dpuuid=(new Date).getTime(),instActive;$.extend(Datepicker.prototype,{markerClassName:"hasDatepicker",maxRows:4,log:function(){this.debug&&console.log.apply("",arguments)},_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(a){return extendRemove(this._defaults,a||{}),this},_attachDatepicker:function(target,settings){var inlineSettings=null;for(var attrName in this._defaults){var attrValue=target.getAttribute("date:"+attrName);if(attrValue){inlineSettings=inlineSettings||{};try{inlineSettings[attrName]=eval(attrValue)}catch(err){inlineSettings[attrName]=attrValue}}}var nodeName=target.nodeName.toLowerCase(),inline=nodeName=="div"||nodeName=="span";target.id||(this.uuid+=1,target.id="dp"+this.uuid);var inst=this._newInst($(target),inline);inst.settings=$.extend({},settings||{},inlineSettings||{}),nodeName=="input"?this._connectDatepicker(target,inst):inline&&this._inlineDatepicker(target,inst)},_newInst:function(a,b){var c=a[0].id.replace(/([^A-Za-z0-9_-])/g,"\\\\$1");return{id:c,input:a,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:b,dpDiv:b?bindHover($('<div class="'+this._inlineClass+' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')):this.dpDiv}},_connectDatepicker:function(a,b){var c=$(a);b.append=$([]),b.trigger=$([]);if(c.hasClass(this.markerClassName))return;this._attachments(c,b),c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function(a,c,d){b.settings[c]=d}).bind("getData.datepicker",function(a,c){return this._get(b,c)}),this._autoSize(b),$.data(a,PROP_NAME,b),b.settings.disabled&&this._disableDatepicker(a)},_attachments:function(a,b){var c=this._get(b,"appendText"),d=this._get(b,"isRTL");b.append&&b.append.remove(),c&&(b.append=$('<span class="'+this._appendClass+'">'+c+"</span>"),a[d?"before":"after"](b.append)),a.unbind("focus",this._showDatepicker),b.trigger&&b.trigger.remove();var e=this._get(b,"showOn");(e=="focus"||e=="both")&&a.focus(this._showDatepicker);if(e=="button"||e=="both"){var f=this._get(b,"buttonText"),g=this._get(b,"buttonImage");b.trigger=$(this._get(b,"buttonImageOnly")?$("<img/>").addClass(this._triggerClass).attr({src:g,alt:f,title:f}):$('<button type="button"></button>').addClass(this._triggerClass).html(g==""?f:$("<img/>").attr({src:g,alt:f,title:f}))),a[d?"before":"after"](b.trigger),b.trigger.click(function(){return $.datepicker._datepickerShowing&&$.datepicker._lastInput==a[0]?$.datepicker._hideDatepicker():$.datepicker._datepickerShowing&&$.datepicker._lastInput!=a[0]?($.datepicker._hideDatepicker(),$.datepicker._showDatepicker(a[0])):$.datepicker._showDatepicker(a[0]),!1})}},_autoSize:function(a){if(this._get(a,"autoSize")&&!a.inline){var b=new Date(2009,11,20),c=this._get(a,"dateFormat");if(c.match(/[DM]/)){var d=function(a){var b=0,c=0;for(var d=0;d<a.length;d++)a[d].length>b&&(b=a[d].length,c=d);return c};b.setMonth(d(this._get(a,c.match(/MM/)?"monthNames":"monthNamesShort"))),b.setDate(d(this._get(a,c.match(/DD/)?"dayNames":"dayNamesShort"))+20-b.getDay())}a.input.attr("size",this._formatDate(a,b).length)}},_inlineDatepicker:function(a,b){var c=$(a);if(c.hasClass(this.markerClassName))return;c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker",function(a,c,d){b.settings[c]=d}).bind("getData.datepicker",function(a,c){return this._get(b,c)}),$.data(a,PROP_NAME,b),this._setDate(b,this._getDefaultDate(b),!0),this._updateDatepicker(b),this._updateAlternate(b),b.settings.disabled&&this._disableDatepicker(a),b.dpDiv.css("display","block")},_dialogDatepicker:function(a,b,c,d,e){var f=this._dialogInst;if(!f){this.uuid+=1;var g="dp"+this.uuid;this._dialogInput=$('<input type="text" id="'+g+'" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>'),this._dialogInput.keydown(this._doKeyDown),$("body").append(this._dialogInput),f=this._dialogInst=this._newInst(this._dialogInput,!1),f.settings={},$.data(this._dialogInput[0],PROP_NAME,f)}extendRemove(f.settings,d||{}),b=b&&b.constructor==Date?this._formatDate(f,b):b,this._dialogInput.val(b),this._pos=e?e.length?e:[e.pageX,e.pageY]:null;if(!this._pos){var h=document.documentElement.clientWidth,i=document.documentElement.clientHeight,j=document.documentElement.scrollLeft||document.body.scrollLeft,k=document.documentElement.scrollTop||document.body.scrollTop;this._pos=[h/2-100+j,i/2-150+k]}return this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),f.settings.onSelect=c,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),$.blockUI&&$.blockUI(this.dpDiv),$.data(this._dialogInput[0],PROP_NAME,f),this},_destroyDatepicker:function(a){var b=$(a),c=$.data(a,PROP_NAME);if(!b.hasClass(this.markerClassName))return;var d=a.nodeName.toLowerCase();$.removeData(a,PROP_NAME),d=="input"?(c.append.remove(),c.trigger.remove(),b.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):(d=="div"||d=="span")&&b.removeClass(this.markerClassName).empty()},_enableDatepicker:function(a){var b=$(a),c=$.data(a,PROP_NAME);if(!b.hasClass(this.markerClassName))return;var d=a.nodeName.toLowerCase();if(d=="input")a.disabled=!1,c.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""});else if(d=="div"||d=="span"){var e=b.children("."+this._inlineClass);e.children().removeClass("ui-state-disabled"),e.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")}this._disabledInputs=$.map(this._disabledInputs,function(b){return b==a?null:b})},_disableDatepicker:function(a){var b=$(a),c=$.data(a,PROP_NAME);if(!b.hasClass(this.markerClassName))return;var d=a.nodeName.toLowerCase();if(d=="input")a.disabled=!0,c.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"});else if(d=="div"||d=="span"){var e=b.children("."+this._inlineClass);e.children().addClass("ui-state-disabled"),e.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled","disabled")}this._disabledInputs=$.map(this._disabledInputs,function(b){return b==a?null:b}),this._disabledInputs[this._disabledInputs.length]=a},_isDisabledDatepicker:function(a){if(!a)return!1;for(var b=0;b<this._disabledInputs.length;b++)if(this._disabledInputs[b]==a)return!0;return!1},_getInst:function(a){try{return $.data(a,PROP_NAME)}catch(b){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(a,b,c){var d=this._getInst(a);if(arguments.length==2&&typeof b=="string")return b=="defaults"?$.extend({},$.datepicker._defaults):d?b=="all"?$.extend({},d.settings):this._get(d,b):null;var e=b||{};typeof b=="string"&&(e={},e[b]=c);if(d){this._curInst==d&&this._hideDatepicker();var f=this._getDateDatepicker(a,!0),g=this._getMinMaxDate(d,"min"),h=this._getMinMaxDate(d,"max");extendRemove(d.settings,e),g!==null&&e.dateFormat!==undefined&&e.minDate===undefined&&(d.settings.minDate=this._formatDate(d,g)),h!==null&&e.dateFormat!==undefined&&e.maxDate===undefined&&(d.settings.maxDate=this._formatDate(d,h)),this._attachments($(a),d),this._autoSize(d),this._setDate(d,f),this._updateAlternate(d),this._updateDatepicker(d)}},_changeDatepicker:function(a,b,c){this._optionDatepicker(a,b,c)},_refreshDatepicker:function(a){var b=this._getInst(a);b&&this._updateDatepicker(b)},_setDateDatepicker:function(a,b){var c=this._getInst(a);c&&(this._setDate(c,b),this._updateDatepicker(c),this._updateAlternate(c))},_getDateDatepicker:function(a,b){var c=this._getInst(a);return c&&!c.inline&&this._setDateFromField(c,b),c?this._getDate(c):null},_doKeyDown:function(a){var b=$.datepicker._getInst(a.target),c=!0,d=b.dpDiv.is(".ui-datepicker-rtl");b._keyEvent=!0;if($.datepicker._datepickerShowing)switch(a.keyCode){case 9:$.datepicker._hideDatepicker(),c=!1;break;case 13:var e=$("td."+$.datepicker._dayOverClass+":not(."+$.datepicker._currentClass+")",b.dpDiv);e[0]&&$.datepicker._selectDay(a.target,b.selectedMonth,b.selectedYear,e[0]);var f=$.datepicker._get(b,"onSelect");if(f){var g=$.datepicker._formatDate(b);f.apply(b.input?b.input[0]:null,[g,b])}else $.datepicker._hideDatepicker();return!1;case 27:$.datepicker._hideDatepicker();break;case 33:$.datepicker._adjustDate(a.target,a.ctrlKey?-$.datepicker._get(b,"stepBigMonths"):-$.datepicker._get(b,"stepMonths"),"M");break;case 34:$.datepicker._adjustDate(a.target,a.ctrlKey?+$.datepicker._get(b,"stepBigMonths"):+$.datepicker._get(b,"stepMonths"),"M");break;case 35:(a.ctrlKey||a.metaKey)&&$.datepicker._clearDate(a.target),c=a.ctrlKey||a.metaKey;break;case 36:(a.ctrlKey||a.metaKey)&&$.datepicker._gotoToday(a.target),c=a.ctrlKey||a.metaKey;break;case 37:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,d?1:-1,"D"),c=a.ctrlKey||a.metaKey,a.originalEvent.altKey&&$.datepicker._adjustDate(a.target,a.ctrlKey?-$.datepicker._get(b,"stepBigMonths"):-$.datepicker._get(b,"stepMonths"),"M");break;case 38:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,-7,"D"),c=a.ctrlKey||a.metaKey;break;case 39:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,d?-1:1,"D"),c=a.ctrlKey||a.metaKey,a.originalEvent.altKey&&$.datepicker._adjustDate(a.target,a.ctrlKey?+$.datepicker._get(b,"stepBigMonths"):+$.datepicker._get(b,"stepMonths"),"M");break;case 40:(a.ctrlKey||a.metaKey)&&$.datepicker._adjustDate(a.target,7,"D"),c=a.ctrlKey||a.metaKey;break;default:c=!1}else a.keyCode==36&&a.ctrlKey?$.datepicker._showDatepicker(this):c=!1;c&&(a.preventDefault(),a.stopPropagation())},_doKeyPress:function(a){var b=$.datepicker._getInst(a.target);if($.datepicker._get(b,"constrainInput")){var c=$.datepicker._possibleChars($.datepicker._get(b,"dateFormat")),d=String.fromCharCode(a.charCode==undefined?a.keyCode:a.charCode);return a.ctrlKey||a.metaKey||d<" "||!c||c.indexOf(d)>-1}},_doKeyUp:function(a){var b=$.datepicker._getInst(a.target);if(b.input.val()!=b.lastVal)try{var c=$.datepicker.parseDate($.datepicker._get(b,"dateFormat"),b.input?b.input.val():null,$.datepicker._getFormatConfig(b));c&&($.datepicker._setDateFromField(b),$.datepicker._updateAlternate(b),$.datepicker._updateDatepicker(b))}catch(d){$.datepicker.log(d)}return!0},_showDatepicker:function(a){a=a.target||a,a.nodeName.toLowerCase()!="input"&&(a=$("input",a.parentNode)[0]);if($.datepicker._isDisabledDatepicker(a)||$.datepicker._lastInput==a)return;var b=$.datepicker._getInst(a);$.datepicker._curInst&&$.datepicker._curInst!=b&&($.datepicker._curInst.dpDiv.stop(!0,!0),b&&$.datepicker._datepickerShowing&&$.datepicker._hideDatepicker($.datepicker._curInst.input[0]));var c=$.datepicker._get(b,"beforeShow"),d=c?c.apply(a,[a,b]):{};if(d===!1)return;extendRemove(b.settings,d),b.lastVal=null,$.datepicker._lastInput=a,$.datepicker._setDateFromField(b),$.datepicker._inDialog&&(a.value=""),$.datepicker._pos||($.datepicker._pos=$.datepicker._findPos(a),$.datepicker._pos[1]+=a.offsetHeight);var e=!1;$(a).parents().each(function(){return e|=$(this).css("position")=="fixed",!e}),e&&$.browser.opera&&($.datepicker._pos[0]-=document.documentElement.scrollLeft,$.datepicker._pos[1]-=document.documentElement.scrollTop);var f={left:$.datepicker._pos[0],top:$.datepicker._pos[1]};$.datepicker._pos=null,b.dpDiv.empty(),b.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),$.datepicker._updateDatepicker(b),f=$.datepicker._checkOffset(b,f,e),b.dpDiv.css({position:$.datepicker._inDialog&&$.blockUI?"static":e?"fixed":"absolute",display:"none",left:f.left+"px",top:f.top+"px"});if(!b.inline){var g=$.datepicker._get(b,"showAnim"),h=$.datepicker._get(b,"duration"),i=function(){var a=b.dpDiv.find("iframe.ui-datepicker-cover");if(!!a.length){var c=$.datepicker._getBorders(b.dpDiv);a.css({left:-c[0],top:-c[1],width:b.dpDiv.outerWidth(),height:b.dpDiv.outerHeight()})}};b.dpDiv.zIndex($(a).zIndex()+1),$.datepicker._datepickerShowing=!0,$.effects&&$.effects[g]?b.dpDiv.show(g,$.datepicker._get(b,"showOptions"),h,i):b.dpDiv[g||"show"](g?h:null,i),(!g||!h)&&i(),b.input.is(":visible")&&!b.input.is(":disabled")&&b.input.focus(),$.datepicker._curInst=b}},_updateDatepicker:function(a){var b=this;b.maxRows=4;var c=$.datepicker._getBorders(a.dpDiv);instActive=a,a.dpDiv.empty().append(this._generateHTML(a));var d=a.dpDiv.find("iframe.ui-datepicker-cover");!d.length||d.css({left:-c[0],top:-c[1],width:a.dpDiv.outerWidth(),height:a.dpDiv.outerHeight()}),a.dpDiv.find("."+this._dayOverClass+" a").mouseover();var e=this._getNumberOfMonths(a),f=e[1],g=17;a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),f>1&&a.dpDiv.addClass("ui-datepicker-multi-"+f).css("width",g*f+"em"),a.dpDiv[(e[0]!=1||e[1]!=1?"add":"remove")+"Class"]("ui-datepicker-multi"),a.dpDiv[(this._get(a,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),a==$.datepicker._curInst&&$.datepicker._datepickerShowing&&a.input&&a.input.is(":visible")&&!a.input.is(":disabled")&&a.input[0]!=document.activeElement&&a.input.focus();if(a.yearshtml){var h=a.yearshtml;setTimeout(function(){h===a.yearshtml&&a.yearshtml&&a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml),h=a.yearshtml=null},0)}},_getBorders:function(a){var b=function(a){return{thin:1,medium:2,thick:3}[a]||a};return[parseFloat(b(a.css("border-left-width"))),parseFloat(b(a.css("border-top-width")))]},_checkOffset:function(a,b,c){var d=a.dpDiv.outerWidth(),e=a.dpDiv.outerHeight(),f=a.input?a.input.outerWidth():0,g=a.input?a.input.outerHeight():0,h=document.documentElement.clientWidth+$(document).scrollLeft(),i=document.documentElement.clientHeight+$(document).scrollTop();return b.left-=this._get(a,"isRTL")?d-f:0,b.left-=c&&b.left==a.input.offset().left?$(document).scrollLeft():0,b.top-=c&&b.top==a.input.offset().top+g?$(document).scrollTop():0,b.left-=Math.min(b.left,b.left+d>h&&h>d?Math.abs(b.left+d-h):0),b.top-=Math.min(b.top,b.top+e>i&&i>e?Math.abs(e+g):0),b},_findPos:function(a){var b=this._getInst(a),c=this._get(b,"isRTL");while(a&&(a.type=="hidden"||a.nodeType!=1||$.expr.filters.hidden(a)))a=a[c?"previousSibling":"nextSibling"];var d=$(a).offset();return[d.left,d.top]},_hideDatepicker:function(a){var b=this._curInst;if(!b||a&&b!=$.data(a,PROP_NAME))return;if(this._datepickerShowing){var c=this._get(b,"showAnim"),d=this._get(b,"duration"),e=function(){$.datepicker._tidyDialog(b)};$.effects&&$.effects[c]?b.dpDiv.hide(c,$.datepicker._get(b,"showOptions"),d,e):b.dpDiv[c=="slideDown"?"slideUp":c=="fadeIn"?"fadeOut":"hide"](c?d:null,e),c||e(),this._datepickerShowing=!1;var f=this._get(b,"onClose");f&&f.apply(b.input?b.input[0]:null,[b.input?b.input.val():"",b]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),$.blockUI&&($.unblockUI(),$("body").append(this.dpDiv))),this._inDialog=!1}},_tidyDialog:function(a){a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(a){if(!$.datepicker._curInst)return;var b=$(a.target),c=$.datepicker._getInst(b[0]);(b[0].id!=$.datepicker._mainDivId&&b.parents("#"+$.datepicker._mainDivId).length==0&&!b.hasClass($.datepicker.markerClassName)&&!b.closest("."+$.datepicker._triggerClass).length&&$.datepicker._datepickerShowing&&(!$.datepicker._inDialog||!$.blockUI)||b.hasClass($.datepicker.markerClassName)&&$.datepicker._curInst!=c)&&$.datepicker._hideDatepicker()},_adjustDate:function(a,b,c){var d=$(a),e=this._getInst(d[0]);if(this._isDisabledDatepicker(d[0]))return;this._adjustInstDate(e,b+(c=="M"?this._get(e,"showCurrentAtPos"):0),c),this._updateDatepicker(e)},_gotoToday:function(a){var b=$(a),c=this._getInst(b[0]);if(this._get(c,"gotoCurrent")&&c.currentDay)c.selectedDay=c.currentDay,c.drawMonth=c.selectedMonth=c.currentMonth,c.drawYear=c.selectedYear=c.currentYear;else{var d=new Date;c.selectedDay=d.getDate(),c.drawMonth=c.selectedMonth=d.getMonth(),c.drawYear=c.selectedYear=d.getFullYear()}this._notifyChange(c),this._adjustDate(b)},_selectMonthYear:function(a,b,c){var d=$(a),e=this._getInst(d[0]);e["selected"+(c=="M"?"Month":"Year")]=e["draw"+(c=="M"?"Month":"Year")]=parseInt(b.options[b.selectedIndex].value,10),this._notifyChange(e),this._adjustDate(d)},_selectDay:function(a,b,c,d){var e=$(a);if($(d).hasClass(this._unselectableClass)||this._isDisabledDatepicker(e[0]))return;var f=this._getInst(e[0]);f.selectedDay=f.currentDay=$("a",d).html(),f.selectedMonth=f.currentMonth=b,f.selectedYear=f.currentYear=c,this._selectDate(a,this._formatDate(f,f.currentDay,f.currentMonth,f.currentYear))},_clearDate:function(a){var b=$(a),c=this._getInst(b[0]);this._selectDate(b,"")},_selectDate:function(a,b){var c=$(a),d=this._getInst(c[0]);b=b!=null?b:this._formatDate(d),d.input&&d.input.val(b),this._updateAlternate(d);var e=this._get(d,"onSelect");e?e.apply(d.input?d.input[0]:null,[b,d]):d.input&&d.input.trigger("change"),d.inline?this._updateDatepicker(d):(this._hideDatepicker(),this._lastInput=d.input[0],typeof d.input[0]!="object"&&d.input.focus(),this._lastInput=null)},_updateAlternate:function(a){var b=this._get(a,"altField");if(b){var c=this._get(a,"altFormat")||this._get(a,"dateFormat"),d=this._getDate(a),e=this.formatDate(c,d,this._getFormatConfig(a));$(b).each(function(){$(this).val(e)})}},noWeekends:function(a){var b=a.getDay();return[b>0&&b<6,""]},iso8601Week:function(a){var b=new Date(a.getTime());b.setDate(b.getDate()+4-(b.getDay()||7));var c=b.getTime();return b.setMonth(0),b.setDate(1),Math.floor(Math.round((c-b)/864e5)/7)+1},parseDate:function(a,b,c){if(a==null||b==null)throw"Invalid arguments";b=typeof b=="object"?b.toString():b+"";if(b=="")return null;var d=(c?c.shortYearCutoff:null)||this._defaults.shortYearCutoff;d=typeof d!="string"?d:(new Date).getFullYear()%100+parseInt(d,10);var e=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,f=(c?c.dayNames:null)||this._defaults.dayNames,g=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,h=(c?c.monthNames:null)||this._defaults.monthNames,i=-1,j=-1,k=-1,l=-1,m=!1,n=function(b){var c=s+1<a.length&&a.charAt(s+1)==b;return c&&s++,c},o=function(a){var c=n(a),d=a=="@"?14:a=="!"?20:a=="y"&&c?4:a=="o"?3:2,e=new RegExp("^\\d{1,"+d+"}"),f=b.substring(r).match(e);if(!f)throw"Missing number at position "+r;return r+=f[0].length,parseInt(f[0],10)},p=function(a,c,d){var e=$.map(n(a)?d:c,function(a,b){return[[b,a]]}).sort(function(a,b){return-(a[1].length-b[1].length)}),f=-1;$.each(e,function(a,c){var d=c[1];if(b.substr(r,d.length).toLowerCase()==d.toLowerCase())return f=c[0],r+=d.length,!1});if(f!=-1)return f+1;throw"Unknown name at position "+r},q=function(){if(b.charAt(r)!=a.charAt(s))throw"Unexpected literal at position "+r;r++},r=0;for(var s=0;s<a.length;s++)if(m)a.charAt(s)=="'"&&!n("'")?m=!1:q();else switch(a.charAt(s)){case"d":k=o("d");break;case"D":p("D",e,f);break;case"o":l=o("o");break;case"m":j=o("m");break;case"M":j=p("M",g,h);break;case"y":i=o("y");break;case"@":var t=new Date(o("@"));i=t.getFullYear(),j=t.getMonth()+1,k=t.getDate();break;case"!":var t=new Date((o("!")-this._ticksTo1970)/1e4);i=t.getFullYear(),j=t.getMonth()+1,k=t.getDate();break;case"'":n("'")?q():m=!0;break;default:q()}if(r<b.length)throw"Extra/unparsed characters found in date: "+b.substring(r);i==-1?i=(new Date).getFullYear():i<100&&(i+=(new Date).getFullYear()-(new Date).getFullYear()%100+(i<=d?0:-100));if(l>-1){j=1,k=l;do{var u=this._getDaysInMonth(i,j-1);if(k<=u)break;j++,k-=u}while(!0)}var t=this._daylightSavingAdjust(new Date(i,j-1,k));if(t.getFullYear()!=i||t.getMonth()+1!=j||t.getDate()!=k)throw"Invalid date";return t},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925))*24*60*60*1e7,formatDate:function(a,b,c){if(!b)return"";var d=(c?c.dayNamesShort:null)||this._defaults.dayNamesShort,e=(c?c.dayNames:null)||this._defaults.dayNames,f=(c?c.monthNamesShort:null)||this._defaults.monthNamesShort,g=(c?c.monthNames:null)||this._defaults.monthNames,h=function(b){var c=m+1<a.length&&a.charAt(m+1)==b;return c&&m++,c},i=function(a,b,c){var d=""+b;if(h(a))while(d.length<c)d="0"+d;return d},j=function(a,b,c,d){return h(a)?d[b]:c[b]},k="",l=!1;if(b)for(var m=0;m<a.length;m++)if(l)a.charAt(m)=="'"&&!h("'")?l=!1:k+=a.charAt(m);else switch(a.charAt(m)){case"d":k+=i("d",b.getDate(),2);break;case"D":k+=j("D",b.getDay(),d,e);break;case"o":k+=i("o",Math.round(((new Date(b.getFullYear(),b.getMonth(),b.getDate())).getTime()-(new Date(b.getFullYear(),0,0)).getTime())/864e5),3);break;case"m":k+=i("m",b.getMonth()+1,2);break;case"M":k+=j("M",b.getMonth(),f,g);break;case"y":k+=h("y")?b.getFullYear():(b.getYear()%100<10?"0":"")+b.getYear()%100;break;case"@":k+=b.getTime();break;case"!":k+=b.getTime()*1e4+this._ticksTo1970;break;case"'":h("'")?k+="'":l=!0;break;default:k+=a.charAt(m)}return k},_possibleChars:function(a){var b="",c=!1,d=function(b){var c=e+1<a.length&&a.charAt(e+1)==b;return c&&e++,c};for(var e=0;e<a.length;e++)if(c)a.charAt(e)=="'"&&!d("'")?c=!1:b+=a.charAt(e);else switch(a.charAt(e)){case"d":case"m":case"y":case"@":b+="0123456789";break;case"D":case"M":return null;case"'":d("'")?b+="'":c=!0;break;default:b+=a.charAt(e)}return b},_get:function(a,b){return a.settings[b]!==undefined?a.settings[b]:this._defaults[b]},_setDateFromField:function(a,b){if(a.input.val()==a.lastVal)return;var c=this._get(a,"dateFormat"),d=a.lastVal=a.input?a.input.val():null,e,f;e=f=this._getDefaultDate(a);var g=this._getFormatConfig(a);try{e=this.parseDate(c,d,g)||f}catch(h){this.log(h),d=b?"":d}a.selectedDay=e.getDate(),a.drawMonth=a.selectedMonth=e.getMonth(),a.drawYear=a.selectedYear=e.getFullYear(),a.currentDay=d?e.getDate():0,a.currentMonth=d?e.getMonth():0,a.currentYear=d?e.getFullYear():0,this._adjustInstDate(a)},_getDefaultDate:function(a){return this._restrictMinMax(a,this._determineDate(a,this._get(a,"defaultDate"),new Date))},_determineDate:function(a,b,c){var d=function(a){var b=new Date;return b.setDate(b.getDate()+a),b},e=function(b){try{return $.datepicker.parseDate($.datepicker._get(a,"dateFormat"),b,$.datepicker._getFormatConfig(a))}catch(c){}var d=(b.toLowerCase().match(/^c/)?$.datepicker._getDate(a):null)||new Date,e=d.getFullYear(),f=d.getMonth(),g=d.getDate(),h=/([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,i=h.exec(b);while(i){switch(i[2]||"d"){case"d":case"D":g+=parseInt(i[1],10);break;case"w":case"W":g+=parseInt(i[1],10)*7;break;case"m":case"M":f+=parseInt(i[1],10),g=Math.min(g,$.datepicker._getDaysInMonth(e,f));break;case"y":case"Y":e+=parseInt(i[1],10),g=Math.min(g,$.datepicker._getDaysInMonth(e,f))}i=h.exec(b)}return new Date(e,f,g)},f=b==null||b===""?c:typeof b=="string"?e(b):typeof b=="number"?isNaN(b)?c:d(b):new Date(b.getTime());return f=f&&f.toString()=="Invalid Date"?c:f,f&&(f.setHours(0),f.setMinutes(0),f.setSeconds(0),f.setMilliseconds(0)),this._daylightSavingAdjust(f)},_daylightSavingAdjust:function(a){return a?(a.setHours(a.getHours()>12?a.getHours()+2:0),a):null},_setDate:function(a,b,c){var d=!b,e=a.selectedMonth,f=a.selectedYear,g=this._restrictMinMax(a,this._determineDate(a,b,new Date));a.selectedDay=a.currentDay=g.getDate(),a.drawMonth=a.selectedMonth=a.currentMonth=g.getMonth(),a.drawYear=a.selectedYear=a.currentYear=g.getFullYear(),(e!=a.selectedMonth||f!=a.selectedYear)&&!c&&this._notifyChange(a),this._adjustInstDate(a),a.input&&a.input.val(d?"":this._formatDate(a))},_getDate:function(a){var b=!a.currentYear||a.input&&a.input.val()==""?null:this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));return b},_generateHTML:function(a){var b=new Date;b=this._daylightSavingAdjust(new Date(b.getFullYear(),b.getMonth(),b.getDate()));var c=this._get(a,"isRTL"),d=this._get(a,"showButtonPanel"),e=this._get(a,"hideIfNoPrevNext"),f=this._get(a,"navigationAsDateFormat"),g=this._getNumberOfMonths(a),h=this._get(a,"showCurrentAtPos"),i=this._get(a,"stepMonths"),j=g[0]!=1||g[1]!=1,k=this._daylightSavingAdjust(a.currentDay?new Date(a.currentYear,a.currentMonth,a.currentDay):new Date(9999,9,9)),l=this._getMinMaxDate(a,"min"),m=this._getMinMaxDate(a,"max"),n=a.drawMonth-h,o=a.drawYear;n<0&&(n+=12,o--);if(m){var p=this._daylightSavingAdjust(new Date(m.getFullYear(),m.getMonth()-g[0]*g[1]+1,m.getDate()));p=l&&p<l?l:p;while(this._daylightSavingAdjust(new Date(o,n,1))>p)n--,n<0&&(n=11,o--)}a.drawMonth=n,a.drawYear=o;var q=this._get(a,"prevText");q=f?this.formatDate(q,this._daylightSavingAdjust(new Date(o,n-i,1)),this._getFormatConfig(a)):q;var r=this._canAdjustMonth(a,-1,o,n)?'<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_'+dpuuid+".datepicker._adjustDate('#"+a.id+"', -"+i+", 'M');\""+' title="'+q+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+q+"</span></a>":e?"":'<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="'+q+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"e":"w")+'">'+q+"</span></a>",s=this._get(a,"nextText");s=f?this.formatDate(s,this._daylightSavingAdjust(new Date(o,n+i,1)),this._getFormatConfig(a)):s;var t=this._canAdjustMonth(a,1,o,n)?'<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_'+dpuuid+".datepicker._adjustDate('#"+a.id+"', +"+i+", 'M');\""+' title="'+s+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+s+"</span></a>":e?"":'<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="'+s+'"><span class="ui-icon ui-icon-circle-triangle-'+(c?"w":"e")+'">'+s+"</span></a>",u=this._get(a,"currentText"),v=this._get(a,"gotoCurrent")&&a.currentDay?k:b;u=f?this.formatDate(u,v,this._getFormatConfig(a)):u;var w=a.inline?"":'<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_'+dpuuid+'.datepicker._hideDatepicker();">'+this._get(a,"closeText")+"</button>",x=d?'<div class="ui-datepicker-buttonpane ui-widget-content">'+(c?w:"")+(this._isInRange(a,v)?'<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_'+dpuuid+".datepicker._gotoToday('#"+a.id+"');\""+">"+u+"</button>":"")+(c?"":w)+"</div>":"",y=parseInt(this._get(a,"firstDay"),10);y=isNaN(y)?0:y;var z=this._get(a,"showWeek"),A=this._get(a,"dayNames"),B=this._get(a,"dayNamesShort"),C=this._get(a,"dayNamesMin"),D=this._get(a,"monthNames"),E=this._get(a,"monthNamesShort"),F=this._get(a,"beforeShowDay"),G=this._get(a,"showOtherMonths"),H=this._get(a,"selectOtherMonths"),I=this._get(a,"calculateWeek")||this.iso8601Week,J=this._getDefaultDate(a),K="";for(var L=0;L<g[0];L++){var M="";this.maxRows=4;for(var N=0;N<g[1];N++){var O=this._daylightSavingAdjust(new Date(o,n,a.selectedDay)),P=" ui-corner-all",Q="";if(j){Q+='<div class="ui-datepicker-group';if(g[1]>1)switch(N){case 0:Q+=" ui-datepicker-group-first",P=" ui-corner-"+(c?"right":"left");break;case g[1]-1:Q+=" ui-datepicker-group-last",P=" ui-corner-"+(c?"left":"right");break;default:Q+=" ui-datepicker-group-middle",P=""}Q+='">'}Q+='<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix'+P+'">'+(/all|left/.test(P)&&L==0?c?t:r:"")+(/all|right/.test(P)&&L==0?c?r:t:"")+this._generateMonthYearHeader(a,n,o,l,m,L>0||N>0,D,E)+'</div><table class="ui-datepicker-calendar"><thead>'+"<tr>";var R=z?'<th class="ui-datepicker-week-col">'+this._get(a,"weekHeader")+"</th>":"";for(var S=0;S<7;S++){var T=(S+y)%7;R+="<th"+((S+y+6)%7>=5?' class="ui-datepicker-week-end"':"")+">"+'<span title="'+A[T]+'">'+C[T]+"</span></th>"}Q+=R+"</tr></thead><tbody>";var U=this._getDaysInMonth(o,n);o==a.selectedYear&&n==a.selectedMonth&&(a.selectedDay=Math.min(a.selectedDay,U));var V=(this._getFirstDayOfMonth(o,n)-y+7)%7,W=Math.ceil((V+U)/7),X=j?this.maxRows>W?this.maxRows:W:W;this.maxRows=X;var Y=this._daylightSavingAdjust(new Date(o,n,1-V));for(var Z=0;Z<X;Z++){Q+="<tr>";var _=z?'<td class="ui-datepicker-week-col">'+this._get(a,"calculateWeek")(Y)+"</td>":"";for(var S=0;S<7;S++){var ba=F?F.apply(a.input?a.input[0]:null,[Y]):[!0,""],bb=Y.getMonth()!=n,bc=bb&&!H||!ba[0]||l&&Y<l||m&&Y>m;_+='<td class="'+((S+y+6)%7>=5?" ui-datepicker-week-end":"")+(bb?" ui-datepicker-other-month":"")+(Y.getTime()==O.getTime()&&n==a.selectedMonth&&a._keyEvent||J.getTime()==Y.getTime()&&J.getTime()==O.getTime()?" "+this._dayOverClass:"")+(bc?" "+this._unselectableClass+" ui-state-disabled":"")+(bb&&!G?"":" "+ba[1]+(Y.getTime()==k.getTime()?" "+this._currentClass:"")+(Y.getTime()==b.getTime()?" ui-datepicker-today":""))+'"'+((!bb||G)&&ba[2]?' title="'+ba[2]+'"':"")+(bc?"":' onclick="DP_jQuery_'+dpuuid+".datepicker._selectDay('#"+a.id+"',"+Y.getMonth()+","+Y.getFullYear()+', this);return false;"')+">"+(bb&&!G?"&#xa0;":bc?'<span class="ui-state-default">'+Y.getDate()+"</span>":'<a class="ui-state-default'+(Y.getTime()==b.getTime()?" ui-state-highlight":"")+(Y.getTime()==k.getTime()?" ui-state-active":"")+(bb?" ui-priority-secondary":"")+'" href="#">'+Y.getDate()+"</a>")+"</td>",Y.setDate(Y.getDate()+1),Y=this._daylightSavingAdjust(Y)}Q+=_+"</tr>"}n++,n>11&&(n=0,o++),Q+="</tbody></table>"+(j?"</div>"+(g[0]>0&&N==g[1]-1?'<div class="ui-datepicker-row-break"></div>':""):""),M+=Q}K+=M}return K+=x+($.browser.msie&&parseInt($.browser.version,10)<7&&!a.inline?'<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>':""),a._keyEvent=!1,K},_generateMonthYearHeader:function(a,b,c,d,e,f,g,h){var i=this._get(a,"changeMonth"),j=this._get(a,"changeYear"),k=this._get(a,"showMonthAfterYear"),l='<div class="ui-datepicker-title">',m="";if(f||!i)m+='<span class="ui-datepicker-month">'+g[b]+"</span>";else{var n=d&&d.getFullYear()==c,o=e&&e.getFullYear()==c;m+='<select class="ui-datepicker-month" onchange="DP_jQuery_'+dpuuid+".datepicker._selectMonthYear('#"+a.id+"', this, 'M');\" "+">";for(var p=0;p<12;p++)(!n||p>=d.getMonth())&&(!o||p<=e.getMonth())&&(m+='<option value="'+p+'"'+(p==b?' selected="selected"':"")+">"+h[p]+"</option>");m+="</select>"}k||(l+=m+(f||!i||!j?"&#xa0;":""));if(!a.yearshtml){a.yearshtml="";if(f||!j)l+='<span class="ui-datepicker-year">'+c+"</span>";else{var q=this._get(a,"yearRange").split(":"),r=(new Date).getFullYear(),s=function(a){var b=a.match(/c[+-].*/)?c+parseInt(a.substring(1),10):a.match(/[+-].*/)?r+parseInt(a,10):parseInt(a,10);return isNaN(b)?r:b},t=s(q[0]),u=Math.max(t,s(q[1]||""));t=d?Math.max(t,d.getFullYear()):t,u=e?Math.min(u,e.getFullYear()):u,a.yearshtml+='<select class="ui-datepicker-year" onchange="DP_jQuery_'+dpuuid+".datepicker._selectMonthYear('#"+a.id+"', this, 'Y');\" "+">";for(;t<=u;t++)a.yearshtml+='<option value="'+t+'"'+(t==c?' selected="selected"':"")+">"+t+"</option>";a.yearshtml+="</select>",l+=a.yearshtml,a.yearshtml=null}}return l+=this._get(a,"yearSuffix"),k&&(l+=(f||!i||!j?"&#xa0;":"")+m),l+="</div>",l},_adjustInstDate:function(a,b,c){var d=a.drawYear+(c=="Y"?b:0),e=a.drawMonth+(c=="M"?b:0),f=Math.min(a.selectedDay,this._getDaysInMonth(d,e))+(c=="D"?b:0),g=this._restrictMinMax(a,this._daylightSavingAdjust(new Date(d,e,f)));a.selectedDay=g.getDate(),a.drawMonth=a.selectedMonth=g.getMonth(),a.drawYear=a.selectedYear=g.getFullYear(),(c=="M"||c=="Y")&&this._notifyChange(a)},_restrictMinMax:function(a,b){var c=this._getMinMaxDate(a,"min"),d=this._getMinMaxDate(a,"max"),e=c&&b<c?c:b;return e=d&&e>d?d:e,e},_notifyChange:function(a){var b=this._get(a,"onChangeMonthYear");b&&b.apply(a.input?a.input[0]:null,[a.selectedYear,a.selectedMonth+1,a])},_getNumberOfMonths:function(a){var b=this._get(a,"numberOfMonths");return b==null?[1,1]:typeof b=="number"?[1,b]:b},_getMinMaxDate:function(a,b){return this._determineDate(a,this._get(a,b+"Date"),null)},_getDaysInMonth:function(a,b){return 32-this._daylightSavingAdjust(new Date(a,b,32)).getDate()},_getFirstDayOfMonth:function(a,b){return(new Date(a,b,1)).getDay()},_canAdjustMonth:function(a,b,c,d){var e=this._getNumberOfMonths(a),f=this._daylightSavingAdjust(new Date(c,d+(b<0?b:e[0]*e[1]),1));return b<0&&f.setDate(this._getDaysInMonth(f.getFullYear(),f.getMonth())),this._isInRange(a,f)},_isInRange:function(a,b){var c=this._getMinMaxDate(a,"min"),d=this._getMinMaxDate(a,"max");return(!c||b.getTime()>=c.getTime())&&(!d||b.getTime()<=d.getTime())},_getFormatConfig:function(a){var b=this._get(a,"shortYearCutoff");return b=typeof b!="string"?b:(new Date).getFullYear()%100+parseInt(b,10),{shortYearCutoff:b,dayNamesShort:this._get(a,"dayNamesShort"),dayNames:this._get(a,"dayNames"),monthNamesShort:this._get(a,"monthNamesShort"),monthNames:this._get(a,"monthNames")}},_formatDate:function(a,b,c,d){b||(a.currentDay=a.selectedDay,a.currentMonth=a.selectedMonth,a.currentYear=a.selectedYear);var e=b?typeof b=="object"?b:this._daylightSavingAdjust(new Date(d,c,b)):this._daylightSavingAdjust(new Date(a.currentYear,a.currentMonth,a.currentDay));return this.formatDate(this._get(a,"dateFormat"),e,this._getFormatConfig(a))}}),$.fn.datepicker=function(a){if(!this.length)return this;$.datepicker.initialized||($(document).mousedown($.datepicker._checkExternalClick).find("body").append($.datepicker.dpDiv),$.datepicker.initialized=!0);var b=Array.prototype.slice.call(arguments,1);return typeof a!="string"||a!="isDisabled"&&a!="getDate"&&a!="widget"?a=="option"&&arguments.length==2&&typeof arguments[1]=="string"?$.datepicker["_"+a+"Datepicker"].apply($.datepicker,[this[0]].concat(b)):this.each(function(){typeof a=="string"?$.datepicker["_"+a+"Datepicker"].apply($.datepicker,[this].concat(b)):$.datepicker._attachDatepicker(this,a)}):$.datepicker["_"+a+"Datepicker"].apply($.datepicker,[this[0]].concat(b))},$.datepicker=new Datepicker,$.datepicker.initialized=!1,$.datepicker.uuid=(new Date).getTime(),$.datepicker.version="1.8.21",window["DP_jQuery_"+dpuuid]=$})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.ui.progressbar.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.widget("ui.progressbar",{options:{value:0,max:100},min:0,_create:function(){this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role:"progressbar","aria-valuemin":this.min,"aria-valuemax":this.options.max,"aria-valuenow":this._value()}),this.valueDiv=a("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element),this.oldValue=this._value(),this._refreshValue()},destroy:function(){this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.valueDiv.remove(),a.Widget.prototype.destroy.apply(this,arguments)},value:function(a){return a===b?this._value():(this._setOption("value",a),this)},_setOption:function(b,c){b==="value"&&(this.options.value=c,this._refreshValue(),this._value()===this.options.max&&this._trigger("complete")),a.Widget.prototype._setOption.apply(this,arguments)},_value:function(){var a=this.options.value;return typeof a!="number"&&(a=0),Math.min(this.options.max,Math.max(this.min,a))},_percentage:function(){return 100*this._value()/this.options.max},_refreshValue:function(){var a=this.value(),b=this._percentage();this.oldValue!==a&&(this.oldValue=a,this._trigger("change")),this.valueDiv.toggle(a>this.min).toggleClass("ui-corner-right",a===this.options.max).width(b.toFixed(0)+"%"),this.element.attr("aria-valuenow",a)}}),a.extend(a.ui.progressbar,{version:"1.8.21"})})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.core.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
jQuery.effects||function(a,b){function c(b){var c;return b&&b.constructor==Array&&b.length==3?b:(c=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b))?[parseInt(c[1],10),parseInt(c[2],10),parseInt(c[3],10)]:(c=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b))?[parseFloat(c[1])*2.55,parseFloat(c[2])*2.55,parseFloat(c[3])*2.55]:(c=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b))?[parseInt(c[1],16),parseInt(c[2],16),parseInt(c[3],16)]:(c=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b))?[parseInt(c[1]+c[1],16),parseInt(c[2]+c[2],16),parseInt(c[3]+c[3],16)]:(c=/rgba\(0, 0, 0, 0\)/.exec(b))?e.transparent:e[a.trim(b).toLowerCase()]}function d(b,d){var e;do{e=a.curCSS(b,d);if(e!=""&&e!="transparent"||a.nodeName(b,"body"))break;d="backgroundColor"}while(b=b.parentNode);return c(e)}function h(){var a=document.defaultView?document.defaultView.getComputedStyle(this,null):this.currentStyle,b={},c,d;if(a&&a.length&&a[0]&&a[a[0]]){var e=a.length;while(e--)c=a[e],typeof a[c]=="string"&&(d=c.replace(/\-(\w)/g,function(a,b){return b.toUpperCase()}),b[d]=a[c])}else for(c in a)typeof a[c]=="string"&&(b[c]=a[c]);return b}function i(b){var c,d;for(c in b)d=b[c],(d==null||a.isFunction(d)||c in g||/scrollbar/.test(c)||!/color/i.test(c)&&isNaN(parseFloat(d)))&&delete b[c];return b}function j(a,b){var c={_:0},d;for(d in b)a[d]!=b[d]&&(c[d]=b[d]);return c}function k(b,c,d,e){typeof b=="object"&&(e=c,d=null,c=b,b=c.effect),a.isFunction(c)&&(e=c,d=null,c={});if(typeof c=="number"||a.fx.speeds[c])e=d,d=c,c={};return a.isFunction(d)&&(e=d,d=null),c=c||{},d=d||c.duration,d=a.fx.off?0:typeof d=="number"?d:d in a.fx.speeds?a.fx.speeds[d]:a.fx.speeds._default,e=e||c.complete,[b,c,d,e]}function l(b){return!b||typeof b=="number"||a.fx.speeds[b]?!0:typeof b=="string"&&!a.effects[b]?!0:!1}a.effects={},a.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","borderColor","color","outlineColor"],function(b,e){a.fx.step[e]=function(a){a.colorInit||(a.start=d(a.elem,e),a.end=c(a.end),a.colorInit=!0),a.elem.style[e]="rgb("+Math.max(Math.min(parseInt(a.pos*(a.end[0]-a.start[0])+a.start[0],10),255),0)+","+Math.max(Math.min(parseInt(a.pos*(a.end[1]-a.start[1])+a.start[1],10),255),0)+","+Math.max(Math.min(parseInt(a.pos*(a.end[2]-a.start[2])+a.start[2],10),255),0)+")"}});var e={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]},f=["add","remove","toggle"],g={border:1,borderBottom:1,borderColor:1,borderLeft:1,borderRight:1,borderTop:1,borderWidth:1,margin:1,padding:1};a.effects.animateClass=function(b,c,d,e){return a.isFunction(d)&&(e=d,d=null),this.queue(function(){var g=a(this),k=g.attr("style")||" ",l=i(h.call(this)),m,n=g.attr("class")||"";a.each(f,function(a,c){b[c]&&g[c+"Class"](b[c])}),m=i(h.call(this)),g.attr("class",n),g.animate(j(l,m),{queue:!1,duration:c,easing:d,complete:function(){a.each(f,function(a,c){b[c]&&g[c+"Class"](b[c])}),typeof g.attr("style")=="object"?(g.attr("style").cssText="",g.attr("style").cssText=k):g.attr("style",k),e&&e.apply(this,arguments),a.dequeue(this)}})})},a.fn.extend({_addClass:a.fn.addClass,addClass:function(b,c,d,e){return c?a.effects.animateClass.apply(this,[{add:b},c,d,e]):this._addClass(b)},_removeClass:a.fn.removeClass,removeClass:function(b,c,d,e){return c?a.effects.animateClass.apply(this,[{remove:b},c,d,e]):this._removeClass(b)},_toggleClass:a.fn.toggleClass,toggleClass:function(c,d,e,f,g){return typeof d=="boolean"||d===b?e?a.effects.animateClass.apply(this,[d?{add:c}:{remove:c},e,f,g]):this._toggleClass(c,d):a.effects.animateClass.apply(this,[{toggle:c},d,e,f])},switchClass:function(b,c,d,e,f){return a.effects.animateClass.apply(this,[{add:c,remove:b},d,e,f])}}),a.extend(a.effects,{version:"1.8.21",save:function(a,b){for(var c=0;c<b.length;c++)b[c]!==null&&a.data("ec.storage."+b[c],a[0].style[b[c]])},restore:function(a,b){for(var c=0;c<b.length;c++)b[c]!==null&&a.css(b[c],a.data("ec.storage."+b[c]))},setMode:function(a,b){return b=="toggle"&&(b=a.is(":hidden")?"show":"hide"),b},getBaseline:function(a,b){var c,d;switch(a[0]){case"top":c=0;break;case"middle":c=.5;break;case"bottom":c=1;break;default:c=a[0]/b.height}switch(a[1]){case"left":d=0;break;case"center":d=.5;break;case"right":d=1;break;default:d=a[1]/b.width}return{x:d,y:c}},createWrapper:function(b){if(b.parent().is(".ui-effects-wrapper"))return b.parent();var c={width:b.outerWidth(!0),height:b.outerHeight(!0),"float":b.css("float")},d=a("<div></div>").addClass("ui-effects-wrapper").css({fontSize:"100%",background:"transparent",border:"none",margin:0,padding:0}),e=document.activeElement;try{e.id}catch(f){e=document.body}return b.wrap(d),(b[0]===e||a.contains(b[0],e))&&a(e).focus(),d=b.parent(),b.css("position")=="static"?(d.css({position:"relative"}),b.css({position:"relative"})):(a.extend(c,{position:b.css("position"),zIndex:b.css("z-index")}),a.each(["top","left","bottom","right"],function(a,d){c[d]=b.css(d),isNaN(parseInt(c[d],10))&&(c[d]="auto")}),b.css({position:"relative",top:0,left:0,right:"auto",bottom:"auto"})),d.css(c).show()},removeWrapper:function(b){var c,d=document.activeElement;return b.parent().is(".ui-effects-wrapper")?(c=b.parent().replaceWith(b),(b[0]===d||a.contains(b[0],d))&&a(d).focus(),c):b},setTransition:function(b,c,d,e){return e=e||{},a.each(c,function(a,c){var f=b.cssUnit(c);f[0]>0&&(e[c]=f[0]*d+f[1])}),e}}),a.fn.extend({effect:function(b,c,d,e){var f=k.apply(this,arguments),g={options:f[1],duration:f[2],callback:f[3]},h=g.options.mode,i=a.effects[b];return a.fx.off||!i?h?this[h](g.duration,g.callback):this.each(function(){g.callback&&g.callback.call(this)}):i.call(this,g)},_show:a.fn.show,show:function(a){if(l(a))return this._show.apply(this,arguments);var b=k.apply(this,arguments);return b[1].mode="show",this.effect.apply(this,b)},_hide:a.fn.hide,hide:function(a){if(l(a))return this._hide.apply(this,arguments);var b=k.apply(this,arguments);return b[1].mode="hide",this.effect.apply(this,b)},__toggle:a.fn.toggle,toggle:function(b){if(l(b)||typeof b=="boolean"||a.isFunction(b))return this.__toggle.apply(this,arguments);var c=k.apply(this,arguments);return c[1].mode="toggle",this.effect.apply(this,c)},cssUnit:function(b){var c=this.css(b),d=[];return a.each(["em","px","%","pt"],function(a,b){c.indexOf(b)>0&&(d=[parseFloat(c),b])}),d}}),a.easing.jswing=a.easing.swing,a.extend(a.easing,{def:"easeOutQuad",swing:function(b,c,d,e,f){return a.easing[a.easing.def](b,c,d,e,f)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b+c:-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b+c:d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b+c:-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){return(b/=e/2)<1?d/2*b*b*b*b*b+c:d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){return b==0?c:b==e?c+d:(b/=e/2)<1?d/2*Math.pow(2,10*(b-1))+c:d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){return(b/=e/2)<1?-d/2*(Math.sqrt(1-b*b)-1)+c:d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e)==1)return c+d;g||(g=e*.3);if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e)==1)return c+d;g||(g=e*.3);if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158,g=0,h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;g||(g=e*.3*1.5);if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return b<1?-0.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c:h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,c,d,e,f,g){return g==b&&(g=1.70158),e*(c/=f)*c*((g+1)*c-g)+d},easeOutBack:function(a,c,d,e,f,g){return g==b&&(g=1.70158),e*((c=c/f-1)*c*((g+1)*c+g)+1)+d},easeInOutBack:function(a,c,d,e,f,g){return g==b&&(g=1.70158),(c/=f/2)<1?e/2*c*c*(((g*=1.525)+1)*c-g)+d:e/2*((c-=2)*c*(((g*=1.525)+1)*c+g)+2)+d},easeInBounce:function(b,c,d,e,f){return e-a.easing.easeOutBounce(b,f-c,0,e,f)+d},easeOutBounce:function(a,b,c,d,e){return(b/=e)<1/2.75?d*7.5625*b*b+c:b<2/2.75?d*(7.5625*(b-=1.5/2.75)*b+.75)+c:b<2.5/2.75?d*(7.5625*(b-=2.25/2.75)*b+.9375)+c:d*(7.5625*(b-=2.625/2.75)*b+.984375)+c},easeInOutBounce:function(b,c,d,e,f){return c<f/2?a.easing.easeInBounce(b,c*2,0,e,f)*.5+d:a.easing.easeOutBounce(b,c*2-f,0,e,f)*.5+e*.5+d}})}(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.blind.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.blind=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.direction||"vertical";a.effects.save(c,d),c.show();var g=a.effects.createWrapper(c).css({overflow:"hidden"}),h=f=="vertical"?"height":"width",i=f=="vertical"?g.height():g.width();e=="show"&&g.css(h,0);var j={};j[h]=e=="show"?i:0,g.animate(j,b.duration,b.options.easing,function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(c[0],arguments),c.dequeue()})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.bounce.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.bounce=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"effect"),f=b.options.direction||"up",g=b.options.distance||20,h=b.options.times||5,i=b.duration||250;/show|hide/.test(e)&&d.push("opacity"),a.effects.save(c,d),c.show(),a.effects.createWrapper(c);var j=f=="up"||f=="down"?"top":"left",k=f=="up"||f=="left"?"pos":"neg",g=b.options.distance||(j=="top"?c.outerHeight({margin:!0})/3:c.outerWidth({margin:!0})/3);e=="show"&&c.css("opacity",0).css(j,k=="pos"?-g:g),e=="hide"&&(g=g/(h*2)),e!="hide"&&h--;if(e=="show"){var l={opacity:1};l[j]=(k=="pos"?"+=":"-=")+g,c.animate(l,i/2,b.options.easing),g=g/2,h--}for(var m=0;m<h;m++){var n={},p={};n[j]=(k=="pos"?"-=":"+=")+g,p[j]=(k=="pos"?"+=":"-=")+g,c.animate(n,i/2,b.options.easing).animate(p,i/2,b.options.easing),g=e=="hide"?g*2:g/2}if(e=="hide"){var l={opacity:0};l[j]=(k=="pos"?"-=":"+=")+g,c.animate(l,i/2,b.options.easing,function(){c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments)})}else{var n={},p={};n[j]=(k=="pos"?"-=":"+=")+g,p[j]=(k=="pos"?"+=":"-=")+g,c.animate(n,i/2,b.options.easing).animate(p,i/2,b.options.easing,function(){a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments)})}c.queue("fx",function(){c.dequeue()}),c.dequeue()})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.clip.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.clip=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right","height","width"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.direction||"vertical";a.effects.save(c,d),c.show();var g=a.effects.createWrapper(c).css({overflow:"hidden"}),h=c[0].tagName=="IMG"?g:c,i={size:f=="vertical"?"height":"width",position:f=="vertical"?"top":"left"},j=f=="vertical"?h.height():h.width();e=="show"&&(h.css(i.size,0),h.css(i.position,j/2));var k={};k[i.size]=e=="show"?j:0,k[i.position]=e=="show"?0:j/2,h.animate(k,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(c[0],arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.drop.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.drop=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right","opacity"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.direction||"left";a.effects.save(c,d),c.show(),a.effects.createWrapper(c);var g=f=="up"||f=="down"?"top":"left",h=f=="up"||f=="left"?"pos":"neg",i=b.options.distance||(g=="top"?c.outerHeight({margin:!0})/2:c.outerWidth({margin:!0})/2);e=="show"&&c.css("opacity",0).css(g,h=="pos"?-i:i);var j={opacity:e=="show"?1:0};j[g]=(e=="show"?h=="pos"?"+=":"-=":h=="pos"?"-=":"+=")+i,c.animate(j,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.explode.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.explode=function(b){return this.queue(function(){var c=b.options.pieces?Math.round(Math.sqrt(b.options.pieces)):3,d=b.options.pieces?Math.round(Math.sqrt(b.options.pieces)):3;b.options.mode=b.options.mode=="toggle"?a(this).is(":visible")?"hide":"show":b.options.mode;var e=a(this).show().css("visibility","hidden"),f=e.offset();f.top-=parseInt(e.css("marginTop"),10)||0,f.left-=parseInt(e.css("marginLeft"),10)||0;var g=e.outerWidth(!0),h=e.outerHeight(!0);for(var i=0;i<c;i++)for(var j=0;j<d;j++)e.clone().appendTo("body").wrap("<div></div>").css({position:"absolute",visibility:"visible",left:-j*(g/d),top:-i*(h/c)}).parent().addClass("ui-effects-explode").css({position:"absolute",overflow:"hidden",width:g/d,height:h/c,left:f.left+j*(g/d)+(b.options.mode=="show"?(j-Math.floor(d/2))*(g/d):0),top:f.top+i*(h/c)+(b.options.mode=="show"?(i-Math.floor(c/2))*(h/c):0),opacity:b.options.mode=="show"?0:1}).animate({left:f.left+j*(g/d)+(b.options.mode=="show"?0:(j-Math.floor(d/2))*(g/d)),top:f.top+i*(h/c)+(b.options.mode=="show"?0:(i-Math.floor(c/2))*(h/c)),opacity:b.options.mode=="show"?1:0},b.duration||500);setTimeout(function(){b.options.mode=="show"?e.css({visibility:"visible"}):e.css({visibility:"visible"}).hide(),b.callback&&b.callback.apply(e[0]),e.dequeue(),a("div.ui-effects-explode").remove()},b.duration||500)})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.fade.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.fade=function(b){return this.queue(function(){var c=a(this),d=a.effects.setMode(c,b.options.mode||"hide");c.animate({opacity:d},{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.fold.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.fold=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"hide"),f=b.options.size||15,g=!!b.options.horizFirst,h=b.duration?b.duration/2:a.fx.speeds._default/2;a.effects.save(c,d),c.show();var i=a.effects.createWrapper(c).css({overflow:"hidden"}),j=e=="show"!=g,k=j?["width","height"]:["height","width"],l=j?[i.width(),i.height()]:[i.height(),i.width()],m=/([0-9]+)%/.exec(f);m&&(f=parseInt(m[1],10)/100*l[e=="hide"?0:1]),e=="show"&&i.css(g?{height:0,width:f}:{height:f,width:0});var n={},p={};n[k[0]]=e=="show"?l[0]:f,p[k[1]]=e=="show"?l[1]:0,i.animate(n,h,b.options.easing).animate(p,h,b.options.easing,function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(c[0],arguments),c.dequeue()})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.highlight.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.highlight=function(b){return this.queue(function(){var c=a(this),d=["backgroundImage","backgroundColor","opacity"],e=a.effects.setMode(c,b.options.mode||"show"),f={backgroundColor:c.css("backgroundColor")};e=="hide"&&(f.opacity=0),a.effects.save(c,d),c.show().css({backgroundImage:"none",backgroundColor:b.options.color||"#ffff99"}).animate(f,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){e=="hide"&&c.hide(),a.effects.restore(c,d),e=="show"&&!a.support.opacity&&this.style.removeAttribute("filter"),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.pulsate.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.pulsate=function(b){return this.queue(function(){var c=a(this),d=a.effects.setMode(c,b.options.mode||"show"),e=(b.options.times||5)*2-1,f=b.duration?b.duration/2:a.fx.speeds._default/2,g=c.is(":visible"),h=0;g||(c.css("opacity",0).show(),h=1),(d=="hide"&&g||d=="show"&&!g)&&e--;for(var i=0;i<e;i++)c.animate({opacity:h},f,b.options.easing),h=(h+1)%2;c.animate({opacity:h},f,b.options.easing,function(){h==0&&c.hide(),b.callback&&b.callback.apply(this,arguments)}),c.queue("fx",function(){c.dequeue()}).dequeue()})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.scale.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.puff=function(b){return this.queue(function(){var c=a(this),d=a.effects.setMode(c,b.options.mode||"hide"),e=parseInt(b.options.percent,10)||150,f=e/100,g={height:c.height(),width:c.width()};a.extend(b.options,{fade:!0,mode:d,percent:d=="hide"?e:100,from:d=="hide"?g:{height:g.height*f,width:g.width*f}}),c.effect("scale",b.options,b.duration,b.callback),c.dequeue()})},a.effects.scale=function(b){return this.queue(function(){var c=a(this),d=a.extend(!0,{},b.options),e=a.effects.setMode(c,b.options.mode||"effect"),f=parseInt(b.options.percent,10)||(parseInt(b.options.percent,10)==0?0:e=="hide"?0:100),g=b.options.direction||"both",h=b.options.origin;e!="effect"&&(d.origin=h||["middle","center"],d.restore=!0);var i={height:c.height(),width:c.width()};c.from=b.options.from||(e=="show"?{height:0,width:0}:i);var j={y:g!="horizontal"?f/100:1,x:g!="vertical"?f/100:1};c.to={height:i.height*j.y,width:i.width*j.x},b.options.fade&&(e=="show"&&(c.from.opacity=0,c.to.opacity=1),e=="hide"&&(c.from.opacity=1,c.to.opacity=0)),d.from=c.from,d.to=c.to,d.mode=e,c.effect("size",d,b.duration,b.callback),c.dequeue()})},a.effects.size=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right","width","height","overflow","opacity"],e=["position","top","bottom","left","right","overflow","opacity"],f=["width","height","overflow"],g=["fontSize"],h=["borderTopWidth","borderBottomWidth","paddingTop","paddingBottom"],i=["borderLeftWidth","borderRightWidth","paddingLeft","paddingRight"],j=a.effects.setMode(c,b.options.mode||"effect"),k=b.options.restore||!1,l=b.options.scale||"both",m=b.options.origin,n={height:c.height(),width:c.width()};c.from=b.options.from||n,c.to=b.options.to||n;if(m){var p=a.effects.getBaseline(m,n);c.from.top=(n.height-c.from.height)*p.y,c.from.left=(n.width-c.from.width)*p.x,c.to.top=(n.height-c.to.height)*p.y,c.to.left=(n.width-c.to.width)*p.x}var q={from:{y:c.from.height/n.height,x:c.from.width/n.width},to:{y:c.to.height/n.height,x:c.to.width/n.width}};if(l=="box"||l=="both")q.from.y!=q.to.y&&(d=d.concat(h),c.from=a.effects.setTransition(c,h,q.from.y,c.from),c.to=a.effects.setTransition(c,h,q.to.y,c.to)),q.from.x!=q.to.x&&(d=d.concat(i),c.from=a.effects.setTransition(c,i,q.from.x,c.from),c.to=a.effects.setTransition(c,i,q.to.x,c.to));(l=="content"||l=="both")&&q.from.y!=q.to.y&&(d=d.concat(g),c.from=a.effects.setTransition(c,g,q.from.y,c.from),c.to=a.effects.setTransition(c,g,q.to.y,c.to)),a.effects.save(c,k?d:e),c.show(),a.effects.createWrapper(c),c.css("overflow","hidden").css(c.from);if(l=="content"||l=="both")h=h.concat(["marginTop","marginBottom"]).concat(g),i=i.concat(["marginLeft","marginRight"]),f=d.concat(h).concat(i),c.find("*[width]").each(function(){var c=a(this);k&&a.effects.save(c,f);var d={height:c.height(),width:c.width()};c.from={height:d.height*q.from.y,width:d.width*q.from.x},c.to={height:d.height*q.to.y,width:d.width*q.to.x},q.from.y!=q.to.y&&(c.from=a.effects.setTransition(c,h,q.from.y,c.from),c.to=a.effects.setTransition(c,h,q.to.y,c.to)),q.from.x!=q.to.x&&(c.from=a.effects.setTransition(c,i,q.from.x,c.from),c.to=a.effects.setTransition(c,i,q.to.x,c.to)),c.css(c.from),c.animate(c.to,b.duration,b.options.easing,function(){k&&a.effects.restore(c,f)})});c.animate(c.to,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){c.to.opacity===0&&c.css("opacity",c.from.opacity),j=="hide"&&c.hide(),a.effects.restore(c,k?d:e),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.shake.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.shake=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"effect"),f=b.options.direction||"left",g=b.options.distance||20,h=b.options.times||3,i=b.duration||b.options.duration||140;a.effects.save(c,d),c.show(),a.effects.createWrapper(c);var j=f=="up"||f=="down"?"top":"left",k=f=="up"||f=="left"?"pos":"neg",l={},m={},n={};l[j]=(k=="pos"?"-=":"+=")+g,m[j]=(k=="pos"?"+=":"-=")+g*2,n[j]=(k=="pos"?"-=":"+=")+g*2,c.animate(l,i,b.options.easing);for(var p=1;p<h;p++)c.animate(m,i,b.options.easing).animate(n,i,b.options.easing);c.animate(m,i,b.options.easing).animate(l,i/2,b.options.easing,function(){a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments)}),c.queue("fx",function(){c.dequeue()}),c.dequeue()})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.slide.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.slide=function(b){return this.queue(function(){var c=a(this),d=["position","top","bottom","left","right"],e=a.effects.setMode(c,b.options.mode||"show"),f=b.options.direction||"left";a.effects.save(c,d),c.show(),a.effects.createWrapper(c).css({overflow:"hidden"});var g=f=="up"||f=="down"?"top":"left",h=f=="up"||f=="left"?"pos":"neg",i=b.options.distance||(g=="top"?c.outerHeight({margin:!0}):c.outerWidth({margin:!0}));e=="show"&&c.css(g,h=="pos"?isNaN(i)?"-"+i:-i:i);var j={};j[g]=(e=="show"?h=="pos"?"+=":"-=":h=="pos"?"-=":"+=")+i,c.animate(j,{queue:!1,duration:b.duration,easing:b.options.easing,complete:function(){e=="hide"&&c.hide(),a.effects.restore(c,d),a.effects.removeWrapper(c),b.callback&&b.callback.apply(this,arguments),c.dequeue()}})})}})(jQuery);;/*! jQuery UI - v1.8.21 - 2012-06-05
* https://github.com/jquery/jquery-ui
* Includes: jquery.effects.transfer.js
* Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
(function(a,b){a.effects.transfer=function(b){return this.queue(function(){var c=a(this),d=a(b.options.to),e=d.offset(),f={top:e.top,left:e.left,height:d.innerHeight(),width:d.innerWidth()},g=c.offset(),h=a('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(b.options.className).css({top:g.top,left:g.left,height:c.innerHeight(),width:c.innerWidth(),position:"absolute"}).animate(f,b.duration,b.options.easing,function(){h.remove(),b.callback&&b.callback.apply(c[0],arguments),c.dequeue()})})}})(jQuery);;
/*
json2.js
2011-10-19

Public Domain.

NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

See http://www.JSON.org/js.html


This code should be minified before deployment.
See http://javascript.crockford.com/jsmin.html

USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
NOT CONTROL.


This file creates a global JSON object containing two methods: stringify
and parse.

JSON.stringify(value, replacer, space)
value any JavaScript value, usually an object or array.

replacer an optional parameter that determines how object
values are stringified for objects. It can be a
function or an array of strings.

space an optional parameter that specifies the indentation
of nested structures. If it is omitted, the text will
be packed without extra whitespace. If it is a number,
it will specify the number of spaces to indent at each
level. If it is a string (such as '\t' or '&nbsp;'),
it contains the characters used to indent at each level.

This method produces a JSON text from a JavaScript value.

When an object value is found, if the object contains a toJSON
method, its toJSON method will be called and the result will be
stringified. A toJSON method does not serialize: it returns the
value represented by the name/value pair that should be serialized,
or undefined if nothing should be serialized. The toJSON method
will be passed the key associated with the value, and this will be
bound to the value

For example, this would serialize Dates as ISO strings.

Date.prototype.toJSON = function (key) {
function f(n) {
// Format integers to have at least two digits.
return n < 10 ? '0' + n : n;
}

return this.getUTCFullYear() + '-' +
f(this.getUTCMonth() + 1) + '-' +
f(this.getUTCDate()) + 'T' +
f(this.getUTCHours()) + ':' +
f(this.getUTCMinutes()) + ':' +
f(this.getUTCSeconds()) + 'Z';
};

You can provide an optional replacer method. It will be passed the
key and value of each member, with this bound to the containing
object. The value that is returned from your method will be
serialized. If your method returns undefined, then the member will
be excluded from the serialization.

If the replacer parameter is an array of strings, then it will be
used to select the members to be serialized. It filters the results
such that only members with keys listed in the replacer array are
stringified.

Values that do not have JSON representations, such as undefined or
functions, will not be serialized. Such values in objects will be
dropped; in arrays they will be replaced with null. You can use
a replacer function to replace those with JSON values.
JSON.stringify(undefined) returns undefined.

The optional space parameter produces a stringification of the
value that is filled with line breaks and indentation to make it
easier to read.

If the space parameter is a non-empty string, then that string will
be used for indentation. If the space parameter is a number, then
the indentation will be that many spaces.

Example:

text = JSON.stringify(['e', {pluribus: 'unum'}]);
// text is '["e",{"pluribus":"unum"}]'


text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
// text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

text = JSON.stringify([new Date()], function (key, value) {
return this[key] instanceof Date ?
'Date(' + this[key] + ')' : value;
});
// text is '["Date(---current time---)"]'


JSON.parse(text, reviver)
This method parses a JSON text to produce an object or array.
It can throw a SyntaxError exception.

The optional reviver parameter is a function that can filter and
transform the results. It receives each of the keys and values,
and its return value is used instead of the original value.
If it returns what it received, then the structure is not modified.
If it returns undefined then the member is deleted.

Example:

// Parse the text. Values that look like ISO date strings will
// be converted to Date objects.

myData = JSON.parse(text, function (key, value) {
var a;
if (typeof value === 'string') {
a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
if (a) {
return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
+a[5], +a[6]));
}
}
return value;
});

myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
var d;
if (typeof value === 'string' &&
value.slice(0, 5) === 'Date(' &&
value.slice(-1) === ')') {
d = new Date(value.slice(5, -1));
if (d) {
return d;
}
}
return value;
});


This is a reference implementation. You are free to copy, modify, or
redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
lastIndex, length, parse, prototype, push, replace, slice, stringify,
test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate()) + 'T' +
                    f(this.getUTCHours()) + ':' +
                    f(this.getUTCMinutes()) + ':' +
                    f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
           
// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
        JSON.toString = JSON.stringify;
        window['JSON']['stringify'] = JSON.stringify; 
        window['JSON']['toString'] = JSON.stringify; 
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
        JSON.create = JSON.parse;
        window['JSON']['create'] = JSON.parse;
        window['JSON']['parse'] = JSON.parse;
    }
}());
/*
 * Copyright (c) 2006-2011, The Flapjax Team.  All Rights Reserved.
 *  
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 * 
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * * Neither the name of the Brown University, the Flapjax Team, nor the names
 *   of its contributors may be used to endorse or promote products derived
 *   from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 */
  
///////////////////////////////////////////////////////////////////////////////
// Miscellaneous functions




if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var T, A, k;
    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if ({}.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }
    if (thisArg) {
      T = thisArg;
    }
    A = new Array(len); 
    k = 0;
    while(k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[ k ];
        mappedValue = callback.call(T, kValue, k, O);
        A[ k ] = mappedValue;
      }
      k++;
    }
    return A;
  };      
}






// Hacks to build standalone or as a module.           
/** @suppress JSC_UNDEFINED_VARIABLE */
var gProvide = goog['provide'];
gProvide('F');

//goog.provide('flapjax');

/**
 * @namespace Flapjax
 */
F = F || { };
flapjax = F;


/**
 * @namespace
 */
F.internal_ = { };
/**
 * @namespace
 */
F.dom_ = { };
/**
 * @namespace
 */
F.xhr_ = { };

// Sentinel value returned by updaters to stop propagation.
F.doNotPropagate = { };

/**
 * @returns {Array}
 */
F.mkArray = function(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
};








   
               var module = this;

//credit 4umi
//slice: Array a * Integer * Integer -> Array a
F.slice = function (arr, start, stop) {
  var i, len = arr.length, r = [];
  if( !stop ) { stop = len; }
  if( stop < 0 ) { stop = len + stop; }
  if( start < 0 ) { start = len - start; }
  if( stop < start ) { i = start; start = stop; stop = i; }
  for( i = 0; i < stop - start; i++ ) { r[i] = arr[start+i]; }
  return r;
}

F.isEqual = function (a,b) {
  return (a == b) ||
    ( (((typeof(a) == 'number') && isNaN(a)) || a == 'NaN') &&
      (((typeof(b) == 'number') && isNaN(b)) || b == 'NaN') );
};

F.forEach = function(fn,arr) {
  for (var i = 0 ; i < arr.length; i++) {
    fn(arr[i]);
  }
};

//member: a * Array b -> Boolean
F.member = function(elt, lst) {
  for (var i = 0; i < lst.length; i++) { 
    if (isEqual(lst[i], elt)) {return true;} 
  }
  return false;
};

F.zip = function(arrays) {
  if (arrays.length == 0) return [];
  var ret = [];
  for(var i=0; i<arrays[0].length;i++) {
    ret.push([]);
    for(var j=0; j<arrays.length;j++) 
      ret[i].push(arrays[j][i]);
  }
  return ret;
}

//map: (a * ... -> z) * [a] * ... -> [z]
F.map = function (fn) {
  var arrays = F.slice(arguments, 1);
  if (arrays.length === 0) { return []; }
  else if (arrays.length === 1) {
    var ret = [];
    for(var i=0; i<arrays[0].length; i++) {ret.push(fn(arrays[0][i]));}
    return ret;
  }
  else {
    var ret = F.zip(arrays);
    var o = new Object();
    for(var i=0; i<ret.length; i++) {ret[i] = fn.apply(o,ret[i]);}
    return ret;
  }
};

//filter: (a -> Boolean) * Array a -> Array a
F.filter = function (predFn, arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) { 
    if (predFn(arr[i])) { res.push(arr[i]); }
  }
  return res;
};

  
//fold: (a * .... * accum -> accum) * accum * [a] * ... -> accum
//fold over list(s), left to right
F.fold = function(fn, init /* arrays */) {
  var lists = F.slice(arguments, 2);
  if (lists.length === 0) { return init; }
  else if(lists.length === 1) {
    var acc = init;
    for(var i = 0; i < lists[0].length; i++) {
      acc = fn(lists[0][i],acc);
    }
    return acc;
  }
  else {
    var acc = init;
    for (var i = 0; i < lists[0].length; i++) {
      var args = map( function (lst) { return lst[i];}, 
            lists);
      args.push(acc);
      acc = fn.apply({}, args);
    }
    return acc;
  }
};
  
//foldR: (a * .... * accum -> accum) * accum * [a] * ... -> accum
//fold over list(s), right to left, fold more memory efficient (left to right)
F.foldR = function (fn, init /* arrays */) {
  var lists = F.slice(arguments, 2);
  if (lists.length === 0) { return init; }
  else if(lists.length === 1) {
    var acc = init;
    for(var i=lists[0].length - 1; i > -1; i--)
      acc = fn(lists[0][i],acc);
    return acc;
  }
  else {
    var acc = init;
    for (var i = lists[0].length - 1; i > -1; i--) {
      var args = map( function (lst) { return lst[i];}, 
            lists);
      args.push(acc);
      acc = fn.apply({}, args);
    }
    return acc;     
  }
};










//////////////////////////////////////////////////////////////////////////////
// Flapjax core

/**
 * Stamp * Path * Obj
 * @constructor Pulse
 * @private
 */
F.internal_.Pulse = function (stamp, value) {
  // Timestamps are used by F.liftB (and ifE).  Since F.liftB may receive multiple
  // update signals in the same run of the evaluator, it only propagates the 
  // signal if it has a new stamp.
  this.stamp = stamp;
  this.value = value;
};

/**
 * @constructor PQ
 * @private
 */
F.internal_.PQ = function () {
  var ctx = this;
  ctx.val = [];
  this.insert = function (kv) {
    ctx.val.push(kv);
    var kvpos = ctx.val.length-1;
    while(kvpos > 0 && kv.k < ctx.val[Math.floor((kvpos-1)/2)].k) {
      var oldpos = kvpos;
      kvpos = Math.floor((kvpos-1)/2);
      ctx.val[oldpos] = ctx.val[kvpos];
      ctx.val[kvpos] = kv;
    }
  };
  this.isEmpty = function () { 
    return ctx.val.length === 0; 
  };
  this.pop = function () {
    if(ctx.val.length === 1) {
      return ctx.val.pop();
    }
    var ret = ctx.val.shift();
    ctx.val.unshift(ctx.val.pop());
    var kvpos = 0;
    var kv = ctx.val[0];
    while(1) { 
      var leftChild = (kvpos*2+1 < ctx.val.length ? ctx.val[kvpos*2+1].k : kv.k+1);
      var rightChild = (kvpos*2+2 < ctx.val.length ? ctx.val[kvpos*2+2].k : kv.k+1);
      if(leftChild > kv.k && rightChild > kv.k)
          break;

      if(leftChild < rightChild) {
        ctx.val[kvpos] = ctx.val[kvpos*2+1];
        ctx.val[kvpos*2+1] = kv;
        kvpos = kvpos*2+1;
      }
      else {
        ctx.val[kvpos] = ctx.val[kvpos*2+2];
        ctx.val[kvpos*2+2] = kv;
        kvpos = kvpos*2+2;
      }
    }
    return ret;
  };
};

F.internal_.lastRank = 0;
F.internal_.stamp = 1;
F.internal_.nextStamp = function () { return ++F.internal_.stamp; };

//propagatePulse: Pulse * Array Node -> 
//Send the pulse to each node 
F.internal_.propagatePulse = function (pulse, node) {
  var queue = new F.internal_.PQ(); //topological queue for current timestep

  queue.insert({k:node.rank,n:node,v:pulse});

  while (!queue.isEmpty()) {
    var qv = queue.pop();
    var nextPulse = qv.n.updater(new F.internal_.Pulse(qv.v.stamp, qv.v.value));

    if (nextPulse != F.doNotPropagate) {
      for (var i = 0; i < qv.n.sendsTo.length; i++) {
  queue.insert({k:qv.n.sendsTo[i].rank,n:qv.n.sendsTo[i],v:nextPulse});
      }
    }
  }
};

/**
 * Event: Array Node b * ( (Pulse a -> Void) * Pulse b -> Void)
 * @constructor
 * @param {Array.<F.EventStream>} nodes
 */
F.EventStream = function (nodes,updater) {
  this.updater = updater;
  
  this.sendsTo = []; //forward link
  
  this.rank = ++F.internal_.lastRank;

  for (var i = 0; i < nodes.length; i++) {
    nodes[i].attachListener(this);
  }
  
};

/**
 * note: does not add flow as counting for rank nor updates parent ranks
 * @param {F.EventStream} dependent
 */
F.EventStream.prototype.attachListener = function(dependent) {
  if (!(dependent instanceof F.EventStream)) {
    throw 'attachListener: expected an F.EventStream';
  }
  this.sendsTo.push(dependent);
  
  if(this.rank > dependent.rank) {
    var q = [dependent];
    while(q.length) {
      var cur = q.splice(0,1)[0];
      cur.rank = ++F.internal_.lastRank;
      q = q.concat(cur.sendsTo);
    }
  }
};

//note: does not remove flow as counting for rank nor updates parent ranks
F.EventStream.prototype.removeListener = function (dependent) {
  if (!(dependent instanceof F.EventStream)) {
    throw 'removeListener: expected an F.EventStream';
  }

  var foundSending = false;
  for (var i = 0; i < this.sendsTo.length && !foundSending; i++) {
    if (this.sendsTo[i] === dependent) {
      this.sendsTo.splice(i, 1);
      foundSending = true;
    }
  }
  
  return foundSending;
};

/**
 *An internalE is a node that propagates all pulses it receives.  It's used
 * internally by various combinators.
 *
 * @param {Array.<F.EventStream>=} dependsOn
 */
F.internal_.internalE = function(dependsOn) {
  return new F.EventStream(dependsOn || [ ],function(pulse) { return pulse; });
};

/**
 * Create an event stream that never fires any events.
 * 
 * @returns {F.EventStream}
 */
F.zeroE = function() {
  return new F.EventStream([],function(pulse) {
      throw ('zeroE : received a value; zeroE should not receive a value; the value was ' + pulse.value);
  });
};


/** 
 * Create an event stream that fires just one event with the value val.
 *
 * <p>Note that oneE does not immediately fire val. The event is queued and
 * fired after the current event has finished propagating.</p>
 *
 * <p>The following code prints "first", "second" and "third" in order:</p>
 *
 * @example
 * console.log('first');
 * F.oneE('third').mapE(function(val) { console.log(val); });
 * console.log('second');
 *
 * @param {*} val 
 * @returns {F.EventStream}
 */
F.oneE = function(val) { 
  var sent = false; 
  var evt = new F.EventStream([],function(pulse) {
    if (sent) { throw ('oneE : received an extra value'); } sent = true; 
                return pulse; }); 
  window.setTimeout(function() {
    F.sendEvent(evt,val); },0); 
  return evt;
};


/**
 * Triggers when any of the argument event stream trigger; carries the signal
 * from the last event stream that triggered.
 *
 * @param {...F.EventStream} var_args
 * @returns {F.EventStream}
 */
F.mergeE = function(var_args) {
  if (arguments.length === 0) {
    return F.zeroE();
  }
  else {
    var deps = F.mkArray(arguments);
    return F.internal_.internalE(deps);
  }
};

F.EventStream.prototype.mergeE = function() {
  var deps = F.mkArray(arguments);
  deps.push(this);
  return F.internal_.internalE(deps);
};

/**
 * Transforms this event stream to produce only <code>constantValue</code>.
 *
 * @param {*} constantValue
 * @returns {F.EventStream}
 */
F.EventStream.prototype.constantE = function(constantValue) {
  return new F.EventStream([this],function(pulse) {
    pulse.value = constantValue;
    return pulse;
  });
};
                                  //(mid,getRes(),getRes, functionUp, parents)
/**
 * @constructor
 * @param {F.EventStream} event
 * @param {*} init
 * @param {Function=} updater
 */
F.Behavior = function (event, init, updater, upstreamTransformation, parents) {  
  if (!(event instanceof F.EventStream)) { 
    throw 'F.Behavior: expected event as second arg'; 
  }
  
  var behave = this;
  this.last = init;
  this.stamp = 0;
  
  //sendEvent to this might impact other nodes that depend on this event
  //sendF.Behavior defaults to this one
  this.underlyingRaw = event;
  
  //unexposed, sendEvent to this will only impact dependents of this behaviour
  this.underlying = new F.EventStream([event], updater 
    ? function (p) {
        behave.last = updater(p.value); 
        behave.stamp = p.stamp;
        p.value = behave.last; return p;
      } 
    : function (p) {
    	behave.stamp = p.stamp;
        behave.last = p.value;
        return p;
      });
    var upstreamEvent = F.receiverE(); 
    upstreamEvent.mapE(function(value){
    behave.last = value;
    if(upstreamTransformation!=undefined){
        var upstreamValues = upstreamTransformation(value);
        if(upstreamValues!=undefined){
            //log("upstreamValues Length: "+upstreamValues.length);
            //log(upstreamValues);
            if(upstreamValues.length==parents.length){
                //log("Matching Return count");
                for(index in parents){
                    //log("Loop for index "+index + " "+ upstreamValues + value);
                    var parent = parents[index];
                    if(parent instanceof F.Behavior){
                        if(upstreamValues[index]!=undefined){
                             //log("Sending Event "+upstreamValues[index]);
                            parent.sendEvent(upstreamValues[index]);
                            //log("Finished Sending Event");
                        }                
                        else{
                            //log("upstream value "+index+" is undefined"); 
                        }    
                    }
                    else{
                        log("Parent "+index+" is not a behaviour");
                    }
                }
            }
            else{
                log("Upstream transform returned wrong number of arguments was "+upstreamValues.length+" should be "+parents.length);        
            }
        }
        else{
            log("Upstream transformation returned undefined "+upstreamTransformation);        
        }
        behave.sendBehavior(value);            
    }
    else{
            event.sendEvent(value);
        }
        
            
    });
    
    this.sendEvent = function(message){
        upstreamEvent.sendEvent(message);
    }
};

/*var Behavior = function(eventStream, initialValue, downstreamTransformation, upstreamTransformation, parents){
    if (!(eventStream instanceof EventStream)) { 
        throw 'Behavior: expected event as second arg'; 
      }
      
      var behave = this;
      this.last = initialValue;
      this.stamp = 0;


    this.firedBefore = function(b2){
        return behave.stamp<b2.stamp;
    }
    this.firedAfter = function(b2){
        return behave.stamp>b2.stamp;
    }
 
    this.underlyingRaw = eventStream;
    this.underlying = createNode([eventStream], downstreamTransformation 
    ? function (p) {
        behave.stamp = p.stamp;
        //log("<updater1> "+p.value);
        behave.last = downstreamTransformation(p.value); 
//log("</updater1> "+behave.last);
        p.value = behave.last; return p;
      } 
    : function (p) {
        //log("<updater2> "+p.value);
        behave.stamp = p.stamp;
        behave.last = p.value;
        //log("</updater2> "+p.value);
        return p
      });
      
    var upstreamEvent = receiverE(); 
    upstreamEvent.mapE(function(value){
    behave.last = value;
    if(upstreamTransformation!=undefined){
        var upstreamValues = upstreamTransformation(value);
        if(upstreamValues!=undefined){
            //log("upstreamValues Length: "+upstreamValues.length);
            //log(upstreamValues);
            if(upstreamValues.length==parents.length){
                //log("Matching Return count");
                for(index in parents){
                    //log("Loop for index "+index + " "+ upstreamValues + value);
                    var parent = parents[index];
                    if(parent instanceof Behavior){
                        if(upstreamValues[index]!=undefined){
                             //log("Sending Event "+upstreamValues[index]);
                            parent.sendEvent(upstreamValues[index]);
                            //log("Finished Sending Event");
                        }                
                        else{
                            //log("upstream value "+index+" is undefined"); 
                        }    
                    }
                    else{
                        log("Parent "+index+" is not a behaviour");
                    }
                }
            }
            else{
                log("Upstream transform returned wrong number of arguments was "+upstreamValues.length+" should be "+parents.length);        
            }
        }
        else{
            log("Upstream transformation returned undefined "+upstreamTransformation);        
        }
        behave.sendBehavior(value);            
    }
    else{
            eventStream.sendEvent(value);
        }
        
            
    });
    
    this.sendEvent = function(message){
        upstreamEvent.sendEvent(message);
    }
    this.valueNow = function(){
        return this.last;
    }
}
Behavior.prototype = new Object();*/






F.Behavior.prototype.index = function(fieldName) {
  return this.liftB(function(obj) { return obj[fieldName]; });
};

/**
 * Creates an event stream that can be imperatively triggered with 
 * <code>sendEvent</code>.
 *
 * Useful for integrating Flapajx with callback-driven JavaScript code.
 */
F.receiverE = function() {
  var evt = F.internal_.internalE();
  evt.sendEvent = function(value) {
    F.internal_.propagatePulse(new F.internal_.Pulse(F.internal_.nextStamp(), value),evt);
  };
  return evt;
};

//note that this creates a new timestamp and new event queue
F.sendEvent = function (node, value) {
  if (!(node instanceof F.EventStream)) { throw 'sendEvent: expected Event as first arg'; } //SAFETY
  
  F.internal_.propagatePulse(new F.internal_.Pulse(F.internal_.nextStamp(), value),node);
};

// bindE :: F.EventStream a * (a -> F.EventStream b) -> F.EventStream b
F.EventStream.prototype.bindE = function(k) {
  /* m.sendsTo resultE
   * resultE.sendsTo prevE
   * prevE.sendsTo returnE
   */
  var m = this;
  var prevE = false;
  
  var outE = new F.EventStream([],function(pulse) { return pulse; });
  outE.name = "bind outE";
  
  var inE = new F.EventStream([m], function (pulse) {
    if (prevE) {
      prevE.removeListener(outE, true);
      
    }
    prevE = k(pulse.value);
    if (prevE instanceof F.EventStream) {
      prevE.attachListener(outE);
    }
    else {
      throw "bindE : expected F.EventStream";
    }

    return F.doNotPropagate;
  });
  inE.name = "bind inE";
  
  return outE;
};

/**
 * @param {function(*):*} f
 * @returns {!F.EventStream}
 */
F.EventStream.prototype.mapE = function(f) {
  if (!(f instanceof Function)) {
    throw ('mapE : expected a function as the first argument; received ' + f);
  };
  
  return new F.EventStream([this],function(pulse) {
    pulse.value = f(pulse.value);
    return pulse;
  });
};

/**
 * @returns {F.EventStream}
 */
F.EventStream.prototype.notE = function() { 
  return this.mapE(function(v) { 
    return !v; 
  }); 
};

/**
 * Only produces events that match the given predicate.
 *
 * @param {function(*):boolean} pred
 * @returns {F.EventStream}
 */
F.EventStream.prototype.filterE = function(pred) {
  if (!(pred instanceof Function)) {
    throw ('filterE : expected predicate; received ' + pred);
  };
  
  // Can be a bindE
  return new F.EventStream([this], function(pulse) {
    return pred(pulse.value) ? pulse : F.doNotPropagate;
  });
};

/**
 * Only triggers on the first event on this event stream.
 *
 * @returns {F.EventStream}
 */
F.EventStream.prototype.onceE = function() {
  var done = false;
  return this.filterE(function(_) {
    if (!done) {
      done = true;
      return true;
    }
    return false;
  });
};

/**
 * Does not trigger on the first event on this event stream.
 *
 * @returns {F.EventStream}
 */
F.EventStream.prototype.skipFirstE = function() {
  var skipped = false;
  return this.filterE(function(_) {
    if (!skipped) {
      skipped = true;
      return false;
    }
    return true;
  });
};

/**
 * Transforms this event stream to produce the result accumulated by
 * <code>combine</code>.
 *
 * <p>The following example accumulates a list of values with the latest
 * at the head:</p>
 *
 * @example
 * original.collectE([],function(new,arr) { return [new].concat(arr); });
 *
 * @param {*} init
 * @param {Function} combine <code>combine(acc, val)</code> 
 * @returns {F.EventStream}
 */
F.EventStream.prototype.collectE = function(init, combine) {
  var acc = init;
  return this.mapE(
    function (n) {
      var next = combine(n, acc);
      acc = next;
      return next;
    });
};

/**
 * Given a stream of event streams, fires events from the most recent event
 * stream.
 * 
 * @returns {F.EventStream}
 */
F.EventStream.prototype.switchE = function() {
  return this.bindE(function(v) { return v; });
};

F.recE = function(fn) {
  var inE = F.receiverE(); 
  var outE = fn(inE); 
  outE.mapE(function(x) { 
    inE.sendEvent(x); }); 
  return outE; 
};

F.internal_.delayStaticE = function (event, time) {
  
  var resE = F.internal_.internalE();
  
  new F.EventStream([event], function (p) { 
    setTimeout(function () { F.sendEvent(resE, p.value);},  time ); 
    return F.doNotPropagate;
  });
  
  return resE;
};

/**
 * Propagates signals from this event stream after <code>time</code>
 * milliseconds.
 * 
 * @param {F.Behavior|number} time
 * @returns {F.EventStream}
 */
F.EventStream.prototype.delayE = function (time) {
  var event = this;
  
  if (time instanceof F.Behavior) {
    
    var receiverEE = F.internal_.internalE();
    var link = 
    {
      from: event, 
      towards: F.internal_.delayStaticE(event, time.valueNow())
    };
    
    //TODO: Change semantics such that we are always guaranteed to get an event going out?
    var switcherE = 
    new F.EventStream(
      [time.changes()],
      function (p) {
        link.from.removeListener(link.towards); 
        link =
        {
          from: event, 
          towards: F.internal_.delayStaticE(event, p.value)
        };
        F.sendEvent(receiverEE, link.towards);
        return F.doNotPropagate;
      });
    
    var resE = receiverEE.switchE();
    
    F.sendEvent(switcherE, time.valueNow());
    return resE;
    
      } else { return F.internal_.delayStaticE(event, time); }
};

//mapE: ([Event] (. Array a -> b)) . Array [Event] a -> [Event] b
F.mapE = function (fn /*, [node0 | val0], ...*/) {
  //      if (!(fn instanceof Function)) { throw 'mapE: expected fn as second arg'; } //SAFETY
  
  var valsOrNodes = F.mkArray(arguments);
  //selectors[i]() returns either the node or real val, optimize real vals
  var selectors = [];
  var selectI = 0;
  var nodes = [];
  for (var i = 0; i < valsOrNodes.length; i++) {
    if (valsOrNodes[i] instanceof F.EventStream) {
      nodes.push(valsOrNodes[i]);
      selectors.push( 
        (function(ii) {
            return function(realArgs) { 
              return realArgs[ii];
            };
        })(selectI));
      selectI++;
    } else {
      selectors.push( 
        (function(aa) { 
            return function () {
              return aa;
            }; 
        })(valsOrNodes[i]));
    } 
  }
  
  var nofnodes = selectors.slice(1);
  
  if (nodes.length === 0) {
    return F.oneE(fn.apply(null, valsOrNodes));
  } else if ((nodes.length === 1) && (fn instanceof Function)) {
    return nodes[0].mapE(
      function () {
        var args = arguments;
        return fn.apply(
          null, 
          nofnodes.map(function (s) {return s(args);}));
      });
  } else if (nodes.length === 1) {
    return fn.mapE(
      function (v) {
        var args = arguments;
        return v.apply(
          null, 
          nofnodes.map(function (s) {return s(args);}));
      });                
  }
  else {
  throw 'unknown mapE case';
  }
};

/** 
 * Produces values from <i>valueB</i>, which are sampled when <i>sourceE</i>
 * is triggered.
 *
 * @param {F.Behavior} valueB
 * @returns {F.EventStream}
 */
F.EventStream.prototype.snapshotE = function (valueB) {
  return new F.EventStream([this], function (pulse) {
    pulse.value = valueB.valueNow(); // TODO: glitch
    return pulse;
  });
};

/**
 * Filters out repeated events that are equal (JavaScript's <code>===</code>).
 *
 * @param {*=} optStart initial value (optional)
 * @returns {F.EventStream}
 */
F.EventStream.prototype.filterRepeatsE = function(optStart) {
  var hadFirst = optStart === undefined ? false : true;
  var prev = optStart;

  return this.filterE(function (v) {
    if(typeof(v)=='object'){
        if(!objectEquals(v, prev)){
            prev = clone(v);
            return true;
        }
    }
    else if (!hadFirst || prev !== v) {
      hadFirst = true;
      prev = v;
      return true;
    }
    return false;
  });
};

/**
 * <i>Calms</i> this event stream to fire at most once every <i>time</i> ms.
 *
 * Events that occur sooner are delayed to occur <i>time</i> milliseconds after
 * the most recently-fired event.  Only the  most recent event is delayed.  So,
 * if multiple events fire within <i>time</i>, only the last event will be
 * propagated.
 *
 * @param {!number|F.Behavior} time
 * @returns {F.EventStream}
 */
F.EventStream.prototype.calmE = function(time) {
  if (!(time instanceof F.Behavior)) {
    time = F.constantB(time);
  }

  var out = F.internal_.internalE();
  new F.EventStream(
    [this],
    function() {
      var towards = null;
      return function (p) {
        if (towards !== null) { clearTimeout(towards); }
        towards = setTimeout( function () { 
            towards = null;
            F.sendEvent(out,p.value); }, time.valueNow());
        return F.doNotPropagate;
      };
    }());
  return out;
};

/**
 * Only triggers at most every <code>time</code> milliseconds. Higher-frequency
 * events are thus ignored.
 *
 * @param {!number|F.Behavior} time
 * @returns {F.EventStream}
 */
F.EventStream.prototype.blindE = function (time) {
  return new F.EventStream(
    [this],
    function () {
      var intervalFn = 
      time instanceof F.Behavior?
      function () { return time.valueNow(); }
      : function () { return time; };
      var lastSent = (new Date()).getTime() - intervalFn() - 1;
      return function (p) {
        var curTime = (new Date()).getTime();
        if (curTime - lastSent > intervalFn()) {
          lastSent = curTime;
          return p;
        }
        else { return F.doNotPropagate; }
      };
    }());
};

/**
 * @param {*} init
 * @returns {!F.Behavior}
 */
F.EventStream.prototype.startsWith = function(init) {
  return new F.Behavior(this,init);
};

/**
 * Returns the presently stored value.
 */
F.Behavior.prototype.valueNow = function() {
  return this.last;
};

/**
 * @returns {F.EventStream}
 */
F.Behavior.prototype.changes = function() {
  return this.underlying;
};

/**
 * @returns {F.Behavior}
 */
F.Behavior.prototype.firedBefore = function(b2) {
  return this.stamp<b2.stamp;
};


/**
 * @returns {F.Behavior}
 */
F.Behavior.prototype.firedAfter = function(b2) {
  return this.stamp>b2.stamp;  
};

/**
 * @returns {!F.Behavior}
 */
F.Behavior.prototype.switchB = function() {
  var behaviourCreatorsB = this;
  var init = behaviourCreatorsB.valueNow();
  
  var prevSourceE = null;
  
  var receiverE = F.internal_.internalE();
  
  //XXX could result in out-of-order propagation! Fix!
  var makerE = 
  new F.EventStream(
    [behaviourCreatorsB.changes()],
    function (p) {
      if (!(p.value instanceof F.Behavior)) { throw 'switchB: expected F.Behavior as value of F.Behavior of first argument'; } //SAFETY
      if (prevSourceE != null) {
        prevSourceE.removeListener(receiverE);
      }
      
      prevSourceE = p.value.changes();
      prevSourceE.attachListener(receiverE);
      
      F.sendEvent(receiverE, p.value.valueNow());
      return F.doNotPropagate;
    });
  
  if (init instanceof F.Behavior) {
    F.sendEvent(makerE, init);
  }
  
  return receiverE.startsWith(init instanceof F.Behavior? init.valueNow() : init);
};

/**
 * @param {!F.Behavior|number} interval
 * @returns {F.Behavior}
 */
F.timerB = function(interval) {
  return F.timerE(interval).startsWith((new Date()).getTime());
};

//TODO test, signature
F.Behavior.prototype.delayB = function (time, init) {
  var triggerB = this;
  if (!(time instanceof F.Behavior)) {
    time = F.constantB(time);
  }
  return triggerB.changes()
           .delayE(time)
           .startsWith(arguments.length > 3 ? init : triggerB.valueNow());
};

//artificially send a pulse to underlying event node of a behaviour
//note: in use, might want to use a receiver node as a proxy or an identity map
F.Behavior.prototype.sendBehavior = function(val) {
  F.sendEvent(this.underlyingRaw,val);
};

F.Behavior.prototype.ifB = function(trueB,falseB) {
  var testB = this;
  //TODO auto conversion for behaviour funcs
  if (!(trueB instanceof F.Behavior)) { trueB = F.constantB(trueB); }
  if (!(falseB instanceof F.Behavior)) { falseB = F.constantB(falseB); }
  return F.liftB(function(te,t,f) { return te ? t : f; },testB,trueB,falseB);
};

F.ifB = function(test,cons,altr) {
  if (!(test instanceof F.Behavior)) { test = F.constantB(test); };
  
  return test.ifB(cons,altr);
};


/** 
 * condB: . [F.Behavior boolean, F.Behavior a] -> F.Behavior a
 * 
 * Evaluates to the first <i>resultB</i> whose associated <i>conditionB</i> is
 * <code>True</code>
 *
 * @param {Array.<Array.<F.Behavior>>} var_args
 * @returns {F.Behavior}
 */
F.condB = function (var_args ) {
  var pairs = F.mkArray(arguments);
return F.liftB.apply({},[function() {
    for(var i=0;i<pairs.length;i++) {
      if(arguments[i]) return arguments[pairs.length+i];
    }
    return undefined;
  }].concat(pairs.map(function(pair) {return pair[0];})
            .concat(pairs.map(function(pair) {return pair[1];}))));
};

/**
 * @param {*} val
 * @returns {!F.Behavior.<*>}
 */
F.constantB = function (val) {
  return new F.Behavior(F.internal_.internalE(), val);
};

/**
 * @param {Function|F.Behavior} fn
 * @param {...F.Behavior} var_args
 * @returns !F.Behavior            
 */
F.liftB = function (fn) {
   // showObj(var_args);
  var args = Array.prototype.slice.call(arguments, 1);
  //dependencies
  var constituentsE = F.map(function (b) { return b.changes(); }, F.filter(function (v) { return v instanceof F.Behavior; }, F.mkArray(arguments)));
  
  //calculate new vals
  var getCur = function (v) {
    return v instanceof F.Behavior ? v.last : v;
  };
  
  var getRes = function () {
    return getCur(fn).apply(null, F.map(getCur, args));
  };

  if(constituentsE.length === 1) {
    return new F.Behavior(constituentsE[0],getRes(),getRes);
  }
    
  //gen/send vals @ appropriate time
  var prevStamp = -1;
  var mid = new F.EventStream(constituentsE, function (p) {
    if (p.stamp != prevStamp) {
      prevStamp = p.stamp;
      return p; 
    }
    else {
      return F.doNotPropagate;
    }
  });
  
  return new F.Behavior(mid,getRes(),getRes);
};   
  
  
  /**
 * @param {Function|F.Behavior} fn
 * @param {Function|F.Behavior} fu
 * @param {...F.Behavior} var_args
 * @returns !F.Behavior            
 */
F.liftBI = function (fn, functionUp) {
   // showObj(var_args);
  var args = Array.prototype.slice.call(arguments, 2);
  //dependencies
  var constituentsE = F.map(function (b) { return b.changes(); }, F.filter(function (v) { return v instanceof F.Behavior; }, F.mkArray(arguments)));
  
  //calculate new vals
  var getCur = function (v) {
    return v instanceof F.Behavior ? v.last : v;
  };
  
  var getRes = function () {
    return getCur(fn).apply(null, F.map(getCur, args));
  };

  if(constituentsE.length === 1) {
    return new F.Behavior(constituentsE[0],getRes(),getRes, functionUp, args);
  }
    
  //gen/send vals @ appropriate time
  var prevStamp = -1;
  var mid = new F.EventStream(constituentsE, function (p) {
    if (p.stamp != prevStamp) {
      prevStamp = p.stamp;
      return p; 
    }
    else {
      return F.doNotPropagate;
    }
  });
  
  return new F.Behavior(mid,getRes(),getRes, functionUp, args);
};           
/*F.liftBI = function (functionDown, functionUp, parents) {
      //var parents = Array.slice(arguments, 2);
    args = parents; 
    //dependencies
      var constituentsE =
        map(changes,
        filter(function (v) { return v instanceof F.Behavior; },
                parents));
                
      var constituentsE =
    F.mkArray(arguments)
    .filter(function (v) { return v instanceof F.Behavior; })
    .map(function (b) { return b.changes(); });   
      
      //calculate new vals
      var getCur = function (v) {
        return v instanceof F.Behavior ? v.last : v;
      };
      
      var ctx = this;
      var getRes = function () {
        return getCur(functionDown).apply(ctx, map(getCur, parents));
      };

      if(constituentsE.length == 1) {
        return new F.Behavior(constituentsE[0],getRes(),getRes, functionUp, parents);
      }
        
      //gen/send vals @ appropriate time
      var prevStamp = -1;
      var mid = createNode(constituentsE, function (p) {
        if (p.stamp != prevStamp) {
          prevStamp = p.stamp;
          return p; 
        }
        else {
          return doNotPropagate;
        }
      });
      //log("Behaviour with multiple parents detected");
      return new F.Behavior(mid,getRes(),getRes, functionUp, parents);
    };

    F.Behavior.prototype.liftBI = function(functionDown, functionUp, parents) {        
        return F.liftBI.apply(this,[functionDown, functionUp].concat([this]).concat(parents));
    };            */



/**
 * @param {...F.Behavior} var_args
 * @returns {F.Behavior}
 */
F.Behavior.prototype.ap = function(var_args) {
  var args = [this].concat(F.mkArray(arguments));
  return F.liftB.apply(null, args);
};

/**
 * @param {F.Behavior|Function} fn
 * @returns {!F.Behavior}
 */
F.Behavior.prototype.liftB = function(fn) {
  return F.liftB(fn, this);
};

/**
 * @param {...F.Behavior} var_args
 */
F.Behavior.andB = function (var_args) {
return F.liftB.apply({},[function() {
    for(var i=0; i<arguments.length; i++) {if(!arguments[i]) return false;}
    return true;
}].concat(F.mkArray(arguments)));
};    
F.andB = F.Behavior.andB;    
/**
 * @param {...F.Behavior} var_args
 */
F.Behavior.orB = function (var_args) {
  return F.liftB.apply({},[function() {
      for(var i=0; i<arguments.length; i++) {if(arguments[i]) return true;}
      return false;
  }].concat(F.mkArray(arguments)));
};
F.orB = F.Behavior.orB;
//F.orB = F.Behavior.orB;

/**
 * @returns {F.Behavior}
 */
F.Behavior.prototype.notB = function() {
  return this.liftB(function(v) { return !v; });
};
F.notB = F.Behavior.prototype.notB;

F.Behavior.prototype.blindB = function (intervalB) {
  return this.changes().blindE(intervalB).startsWith(this.valueNow());
};

F.Behavior.prototype.calmB = function (intervalB) {
  return this.changes().calmE(intervalB).startsWith(this.valueNow());
};

///////////////////////////////////////////////////////////////////////////////
// DOM Utilities

/**
 * assumes IDs already preserved
 *
 * @param {Node|string} replaceMe
 * @param {Node|string} withMe
 * @returns {Node}
 */
F.dom_.swapDom = function(replaceMe, withMe) {
  if ((replaceMe === null) || (replaceMe === undefined)) { throw ('swapDom: expected dom node or id, received: ' + replaceMe); } //SAFETY
  
  var replaceMeD = F.dom_.getObj(replaceMe);
  if (!(replaceMeD.nodeType > 0)) { throw ('swapDom expected a Dom node as first arg, received ' + replaceMeD); } //SAFETY
  
  if (withMe) {
    var withMeD = F.dom_.getObj(withMe);
    if (!(withMeD.nodeType > 0)) { throw 'swapDom: can only swap with a DOM object'; } //SAFETY
    try {
      if (replaceMeD.parentNode === null) { return withMeD; }
      if(withMeD != replaceMeD) replaceMeD.parentNode.replaceChild(withMeD, replaceMeD);
    } catch (e) {
      throw('swapDom error in replace call: withMeD: ' + withMeD + ', replaceMe Parent: ' + replaceMeD + ', ' + e + ', parent: ' + replaceMeD.parentNode);                    
    }
  } else {
    replaceMeD.parentNode.removeChild(replaceMeD); //TODO isolate child and set innerHTML to "" to avoid psuedo-leaks?
  }
  return replaceMeD;
};

//getObj: String U Dom -> Dom
//throws 
//  'getObj: expects a Dom obj or Dom id as first arg'
//  'getObj: flapjax: cannot access object'
//  'getObj: no obj to get
//also known as '$'
F.dom_.getObj = function (name) {
  if (typeof(name) === 'object') { return name; }
  else if ((typeof(name) === 'null') || (typeof(name) === 'undefined')) {
    throw 'getObj: expects a Dom obj or Dom id as first arg';
  } else {
    
    var res = 
    document.getElementById ? document.getElementById(name) :
    document.all ? document.all[name] :
    document.layers ? document.layers[name] :
    (function(){ throw 'getObj: flapjax: cannot access object';})();
    if ((res === null) || (res === undefined)) { 
      throw ('getObj: no obj to get: ' + name); 
    }
    return res;
  }
};

// TODO: should be richer
F.$ = F.dom_.getObj;

/**
 * helper to reduce obj look ups
 * getDynObj: domNode . Array (id) -> domObj
 * obj * [] ->  obj
 * obj * ['position'] ->  obj
 * obj * ['style', 'color'] ->  obj.style
 *
 * @param {Node|string} domObj
 * @param {Array.<string>} indices
 * @returns {Object}
 */
F.dom_.getMostDom = function (domObj, indices) {
  var acc = F.dom_.getObj(domObj);
  if ( (indices === null) || (indices === undefined) || (indices.length < 1)) {
    return acc;
  } else {
    for (var i = 0; i < indices.length - 1; i++) {
      acc = acc[indices[i]];
    }
    return acc;
  }       
};

F.dom_.getDomVal = function (domObj, indices) {
  var val = F.dom_.getMostDom(domObj, indices);
  if (indices && indices.length > 0) {
    val = val[indices[indices.length - 1]];
  }
  return val;
};

/**
 * An event stream that fires every <code>intervalB</code> ms.
 *
 * The interval itself may be time-varying. The signal carried is the current
 * time, in milliseconds.
 *
 * @param {!F.Behavior|number} intervalB
 * @returns {F.EventStream}
 */
F.timerE = function(intervalB) {
  if (!(intervalB instanceof F.Behavior)) {
    intervalB = F.constantB(intervalB);
  }
  var eventStream = F.receiverE();
  var callback = function() {
    eventStream.sendEvent((new Date()).getTime());
  };
  var timerID = null;
  intervalB.liftB(function(interval) {
    if (timerID) {
      clearInterval(timerID);
      timerID = null;
    }
    if (typeof interval === 'number' && interval > 0) {
      timerID =  setInterval(callback, interval);
    }
  });
  return eventStream;
};


// Applies f to each element of a nested array.
F.dom_.deepEach = function(arr, f) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] instanceof Array) {
      F.dom_.deepEach(arr[i], f);
    }
    else {
      f(arr[i]);
    }
  }
};


F.dom_.mapWithKeys = function(obj, f) {
  for (var ix in obj) {
    if (!(Object.prototype && Object.prototype[ix] === obj[ix])) {
      f(ix, obj[ix]);
    }
  }
};


/**
 * @param {Node} parent
 * @param {Node} newChild
 * @param {Node} refChild
 */
F.dom_.insertAfter = function(parent, newChild, refChild) {
  if (typeof refChild != "undefined" && refChild.nextSibling) {
    parent.insertBefore(newChild, refChild.nextSibling);
  }
  else {
    // refChild == parent.lastChild
    parent.appendChild(newChild);
  }
};

/**
 * @param {Node} parent
 * @param {Array.<Node>} existingChildren
 * @param {Array.<Node>} newChildren
 */
F.dom_.swapChildren = function(parent, existingChildren, newChildren) {
  var end = Math.min(existingChildren.length, newChildren.length);
  var i;

  for (i = 0; i < end; i++) {
    parent.replaceChild(newChildren[i], existingChildren[i]);
  }

  var lastInsertedChild = existingChildren[i - 1];

  if (end < existingChildren.length) {
    for (i = end; i < existingChildren.length; i++) {
      parent.removeChild(existingChildren[i]);
    }
  }
  else if (end < newChildren.length) {
    for (i = end; i < newChildren.length; i++) {
      F.dom_.insertAfter(parent, newChildren[i], newChildren[i - 1]);
    }
  }
};

/**
 * not a word
 *
 * @param {*} maybeElement
 * @returns {Node}
 *
 * @suppress {checkTypes} the nodeType check does not get by the typechecker
 */
F.dom_.elementize = function(maybeElement) {
  return (maybeElement.nodeType > 0) 
           ? maybeElement
           : document.createTextNode(maybeElement.toString()); // TODO: toString!!
};


/**
 * @param {Object} obj
 * @param {string} prop
 * @param {*} val
 */
F.dom_.staticEnstyle = function(obj, prop, val) {
  if (val instanceof Object) {
    // TODO: enstyle is missing? I think this should be staticEnstyle.
    // mapWithKeys(val, function(k, v) { enstyle(obj[prop], k, v); });
  }
  else {
    obj[prop] = val;
  }
};


/**
 * @param {Object} obj
 * @param {string} prop
 * @param {F.Behavior|*} val
 */
F.dom_.dynamicEnstyle = function(obj, prop, val) {
//alert(F.dom_);
  if (val instanceof F.Behavior) {
    // TODO: redundant? F.liftB will call anyway ...
    F.dom_.staticEnstyle(obj, prop, val.valueNow()); 
    val.liftB(function(v) {
      F.dom_.staticEnstyle(obj, prop, v);
    });
  }
  else if (val instanceof Object) {
    F.dom_.mapWithKeys(val, function(k, v) {
      F.dom_.dynamicEnstyle(obj[prop], k, v);
    });
  }
  else {
    obj[prop] = val;
  }
};
  

/**
 * @param {string} tagName
 * @returns {function((string|Object|Node)=, ...[(string|Node|Array.<Node>)]):!HTMLElement}
 */
F.dom_.makeTagB = function(tagName) { return function() {
  var attribs, children;

  if (typeof(arguments[0]) === "object" && 
      !(arguments[0].nodeType > 0 || arguments[0] instanceof F.Behavior || 
        arguments[0] instanceof Array)) {
    attribs = arguments[0];
    children = Array.prototype.slice.call(arguments, 1);
  }
  else {
    attribs = { };
    children = F.mkArray(arguments);
  }
 
  var elt = document.createElement(tagName);

  F.dom_.mapWithKeys(attribs, function(name, val) {
    if (val instanceof F.Behavior) {
      elt[name] = val.valueNow();
      val.liftB(function(v) { 
        F.dom_.staticEnstyle(elt, name, v); });
    }
    else {
      F.dom_.dynamicEnstyle(elt, name, val);
    }
  });

  F.dom_.deepEach(children, function(child) {
    if (child instanceof F.Behavior) {
      var lastVal = child.valueNow();
      if (lastVal instanceof Array) {
        lastVal = lastVal.map(F.dom_.elementize);
        lastVal.forEach(function(dynChild) { elt.appendChild(dynChild); });
        child.liftB(function(currentVal) {
          currentVal = currentVal.map(F.dom_.elementize);
          F.dom_.swapChildren(elt, lastVal, currentVal);
          lastVal = currentVal;
        });
      }
      else {
        lastVal = F.dom_.elementize(lastVal);
        elt.appendChild(lastVal);
        var lastValIx = elt.childNodes.length - 1; 
        child.liftB(function(currentVal) {
          currentVal = F.dom_.elementize(currentVal);
          if (lastVal.parentNode != elt) {
            elt.appendChild(currentVal); }
          else {
            elt.replaceChild(currentVal, lastVal); }
          lastVal = currentVal;
        });
      }
    }
    else {
      elt.appendChild(F.dom_.elementize(child));
    }
  });

  return elt;
}; };


var dtypes = [ "a", "b", "blockquote", "br", "button", "canvas", "div", "fieldset", 
"form", "font", "h1", "h2", "h3", "h4", "hr", "iframe", "input", 
"label", "legend", "li", "ol", "optgroup", "option", 
"p", "select", "span", "strong", "table", "tbody", 
"td", "textarea", "tfoot", "th", "thead", "tr", "tt", "ul" ];

for(index in dtypes){
    var name = dtypes[index];
    if(window&&typeof(name)=='string'&&window[name.toUpperCase()])
        window[name.toUpperCase()] = F.dom_.makeTagB(name);
}

/**
 * Creates a DOM element with time-varying children.
 *
 * @param {!string} tag
 * @param {!string|Object|Node=} opt_style
 * @param {...(string|Node|Array.<Node>|F.Behavior)} var_args
 * @returns {!HTMLElement}
 */
F.elt = function(tag, opt_style, var_args) {
  return F.dom_.makeTagB(tag).apply(null, F.mkArray(arguments).slice(1));
};

//TEXTB: F.Behavior a -> F.Behavior Dom TextNode
F.text = function (strB) {

  // TODO: Create a static textnode and set the data field?
  //      if (!(strB instanceof F.Behavior || typeof(strB) == 'string')) { throw 'TEXTB: expected F.Behavior as second arg'; } //SAFETY
  if (!(strB instanceof F.Behavior)) { strB = F.constantB(strB); }
  
  return strB.changes().mapE(
      function (txt) { return document.createTextNode(txt); })
    .startsWith(document.createTextNode(strB.valueNow()));
};

/**
 * @typedef {function((!string|Object|Node)=, ...[(!string|Node|Array.<Node>)]):!Node}
 */
F.tagMaker;

/** @type {F.tagMaker} */
var DIV = F.dom_.makeTagB('div');
/** @type {F.tagMaker} */
var SPAN = F.dom_.makeTagB('span');
/** @type {F.tagMaker} */
var A = F.dom_.makeTagB('a');
/** @type {F.tagMaker} */
var TEXTAREA = F.dom_.makeTagB('TEXTAREA');
/** @type {F.tagMaker} */
var OPTION = F.dom_.makeTagB('OPTION');
/** @type {F.tagMaker} */
var INPUT = F.dom_.makeTagB('INPUT');
/** @type {F.tagMaker} */
var SELECT = F.dom_.makeTagB('SELECT');
/** @type {F.tagMaker} */
var IMG = F.dom_.makeTagB('IMG');
/** @type {F.tagMaker} */
var PRE = F.dom_.makeTagB('pre');


var TEXT = function (str) {
  return document.createTextNode(str);
};

///////////////////////////////////////////////////////////////////////////////
// Reactive DOM

/**
 * [EventName] * (F.EventStream DOMEvent, ... -> Element) -> Element
 *

 * <p>An element may be a function of some event and behaviours, while those
 * same events and behaviours might als be functions of the tag. <i>tagRec</i>
 * is a convenience method for writing such cyclic dependencies. Also, as
 * certain updates may cause a tag to be destroyed and recreated, this
 * guarentees the extracted events are for the most recently constructed DOM
 * node.</p>
 * 
 * <p>This example create a tags whose background color is white on mouse 
 * over and black on mouseout, starting as black.</p>
 *
 * @example
 * F.tagRec(
 *  ['mouseover', 'mouseout'],
 *  function (overE, outE) {
 *    return F.elt('div',
 *      { style: {
 *        color:
 *          mergeE(overE.constantE('#FFF'), outE.constantE('#000')).
 *          startsWith('#000')}},
 *      'mouse over me to change color!');
 *  });
 * 
 */
F.tagRec = function (eventNames, maker) {
  if (!(eventNames instanceof Array)) { throw 'tagRec: expected array of event names as first arg'; } //SAFETY
  if (!(maker instanceof Function)) { throw 'tagRec: expected function as second arg'; } //SAFETY
  
  var numEvents = eventNames.length;

  var receivers = [ ];
  var i;
  for (i = 0; i < numEvents; i++) {
    receivers.push(F.internal_.internalE());
  }

  var elt = maker.apply(null, receivers);

  for (i = 0; i < numEvents; i++) {
    F.extractEventE(elt, eventNames[i]).attachListener(receivers[i]);
  }

  return elt;
};

F.dom_.extractEventDynamicE = function(eltB, eventName, useCapture) {
  if (typeof useCapture === 'undefined') {
    useCapture = false;
  }
  var eventStream = F.receiverE();
  var callback = function(evt) {
    eventStream.sendEvent(evt); 
  };
  var currentElt = false;
  eltB.liftB(function(elt) {
    if (currentElt) {
      currentElt.removeEventListener(eventName, callback, useCapture); 
    }
    currentElt = elt;
    if (elt && elt.addEventListener && elt.removeEventListener) {
      elt.addEventListener(eventName, callback, useCapture);
    }
  });
  return eventStream;
};

F.dom_.extractEventStaticE = function(elt, eventName, useCapture) {
  if (typeof useCapture === 'undefined') {
    useCapture = false;
  }
  var eventStream = F.receiverE();
  var callback = function(evt) {
    eventStream.sendEvent(evt); 
  };
  if(elt.addEventListener){
    elt.addEventListener(eventName, callback, useCapture);
  }
  else{
    elt.attachEvent("on"+eventName, callback);
  }
  return eventStream;  
};

/**
 * A signal carrying DOM events, which triggers on each event.
 * 
 * The argument <code>elt</code> may be a behavior of DOM nodes or 
 * <code>false</code>.
 * 
 * @param {F.Behavior|Node|Window} elt
 * @param {string} eventName
 * @param {boolean=} useCapture
 * @returns {F.EventStream}
 */
F.extractEventE = function(elt, eventName, useCapture) {
  if (elt instanceof F.Behavior) {
    return F.dom_.extractEventDynamicE(elt, eventName, useCapture);
  }
  else {
    if(typeof(elt)=="string"){
        elt = document.getElementById(elt);
    }
    return F.dom_.extractEventStaticE(elt, eventName, useCapture);
  }
};

/**
 *
 * Extracts just one event from elt.
 *
 * oneEvent detaches the underlying DOM callback after receiving the event.
 *
 * @param {Node} elt
 * @param {string} eventName
 * @returns {F.EventStream}
 */
F.oneEvent = function(elt, eventName) {
  return F.recE(function(evts) {
    return F.extractEventE(evts.constantE(false).startsWith(elt),
      eventName);
  });
};

/**
 * @param {F.Behavior} domObj
 * @param {...string} var_args
 * @returns {F.EventStream}
 */
F.extractEventsE = function (domObj, var_args) {
    var eventNames = Array.prototype.slice.call(arguments, 1);
    var events = (eventNames.length === 0 ? [] : eventNames).map(function (eventName) {
        return F.extractEventE(domObj, eventName);
    });
    return F.mergeE.apply(null, events);
};

/**extractDomFieldOnEventE: Event * Dom U String . Array String -> Event a
 *
 * @param {F.EventStream} triggerE
 * @param {Node} domObj
 * @param {...*} var_args
 */
F.extractDomFieldOnEventE = function (triggerE, domObj, var_args) {
  if (!(triggerE instanceof F.EventStream)) { throw 'extractDomFieldOnEventE: expected Event as first arg'; } //SAFETY
  var indices = Array.prototype.slice.call(arguments, 2);
  var res =
  triggerE.mapE(
    function () { return F.dom_.getDomVal(domObj, indices); });
  return res;
};

F.extractValueE = function (domObj) {
  return F.extractValueB.apply(null, arguments).changes();
};

//extractValueOnEventB: Event * DOM -> F.Behavior
// value of a dom form object, polled during trigger
F.extractValueOnEventB = function (triggerE, domObj) {
  return F.dom_.extractValueStaticB(domObj, triggerE);
};

/**
 * If no trigger for extraction is specified, guess one
 *
 * @param {Node} domObj
 * @param {F.EventStream=} triggerE
 * @returns {!F.Behavior}
 */
F.dom_.extractValueStaticB = function (domObj, triggerE) { 
  var objD;
  try {
    objD = F.dom_.getObj(domObj);
    //This is for IE
    if(typeof(domObj) === 'string' && objD.id != domObj) {
      throw 'Make a radio group';
    }
  } catch (e) {
    objD = {type: 'radio-group', name: domObj};
  }
  
  var getter; // get value at any current point in time
  
  var result;

  switch (objD.type)  {
    //TODO: checkbox.value instead of status?
  case 'checkbox': 
    result = F.extractDomFieldOnEventE(
          triggerE ? triggerE : 
          F.extractEventsE(
            objD, 
            'click', 'keyup', 'change'),
          objD,
          'checked').filterRepeatsE(objD.checked).startsWith(objD.checked);
    break; 
  case 'select-one':
      getter = function () {                         
        return objD.selectedIndex > -1 ? 
        (objD.options[objD.selectedIndex].value ?
          objD.options[objD.selectedIndex].value :
          objD.options[objD.selectedIndex].innerText)
        : undefined;
      };
      result = (triggerE ? triggerE :
            F.extractEventsE(
              objD,
              'click', 'keyup', 'change')).mapE(getter).filterRepeatsE().startsWith(getter());
      break;
  case 'select-multiple':
    //TODO ryan's cfilter adapted for equality check
    getter = function () {
      var res = [];
      for (var i = 0; i < objD.options.length; i++) {
        if (objD.options[i].selected) {
          res.push(objD.options[i].value ? objD.options[i].value : objD.options[i].innerText);
        }
      }
      return res;
    };
    result = 
        (triggerE ? triggerE : 
        F.extractEventsE(
          objD,
          'click', 'keyup', 'change')).mapE(getter).startsWith(getter());
    break;
    
  case 'text':
  case 'textarea':
  case 'hidden':
  case 'password':
    result = F.extractDomFieldOnEventE(
          triggerE ? triggerE :
          F.extractEventsE(
            objD, 
            'click', 'keyup', 'change'),
          objD,
          'value').filterRepeatsE(objD.value).startsWith(objD.value);
    break;
    
  case 'button': //same as above, but don't filter repeats
    result = F.extractDomFieldOnEventE(
        triggerE ? triggerE :
        F.extractEventsE(
          objD, 
          'click', 'keyup', 'change'),
        objD,
        'value').startsWith(objD.value);
    break;
    
  case 'radio': 
  case 'radio-group':
    
    //TODO returns value of selected button, but if none specified,
    //      returns 'on', which is ambiguous. could return index,
    //      but that is probably more annoying
    
    var radiosAD = 
      F.mkArray(document.getElementsByTagName('input'))
      .filter(
      function (elt) { 
        return (elt.type === 'radio') &&
        (elt.getAttribute('name') === objD.name); 
      });
    
    getter = 
    objD.type === 'radio' ?
    
    function () {
      return objD.checked;
    } :
    
    function () {
      for (var i = 0; i < radiosAD.length; i++) {
        if (radiosAD[i].checked) {
          return radiosAD[i].value; 
        }
      }
      return undefined; //TODO throw exn? 
    };
    
    var actualTriggerE = triggerE ? triggerE :
    F.mergeE.apply(
      null,
      radiosAD.map(
        function (radio) { 
          return F.extractEventsE(
            radio, 
        'click', 'keyup', 'change'); }));
    
    result =
      actualTriggerE.mapE(getter).filterRepeatsE(getter()).startsWith(getter());
    break;
  default:
    throw ('extractValueStaticB: unknown value type "' + objD.type + '"');
  }

  return result;
};

/**
 * Signal carries the value of the form element <code>domObj</code>.
 *
 * The signal triggers when a change event fires, which depends on the
 * type of <code>domObj</code>.
 *
 * @param {!F.Behavior|!Node} domObj
 * @returns {!F.Behavior}
 */
F.extractValueB = function (domObj) {
  if (domObj instanceof F.Behavior) {
    return domObj.liftB(function (dom) { return F.dom_.extractValueStaticB(dom); })
                 .switchB();
  } else {
    return F.dom_.extractValueStaticB(domObj);
  }
};

/**
 * @param {!F.Behavior|!Node} domObj
 * @returns {!F.Behavior}
 */
F.$B = F.extractValueB;


//into[index] = deepValueNow(from) via descending from object and mutating each field
F.dom_.deepStaticUpdate = function (into, from, index) {
  var fV = (from instanceof F.Behavior)? from.valueNow() : from;
  if (typeof(fV) === 'object') {
    for (var i in fV) {
      if (!(Object.prototype) || !(Object.prototype[i])) {
        F.dom_.deepStaticUpdate(index? into[index] : into, fV[i], i);
      }
    }
  } else {
    var old = into[index];
    into[index] = fV;
  }
};

//note: no object may be time varying, just the fields
//into[index] = from
//only updates on changes
F.dom_.deepDynamicUpdate = function (into, from, index) {
  var fV = (from instanceof F.Behavior)? from.valueNow() : from;
  if (typeof(fV) === 'object') {
    if (from instanceof F.Behavior) {
      throw 'deepDynamicUpdate: dynamic collections not supported';
    }
    for (var i in fV) {
      if (!(Object.prototype) || !(Object.prototype[i])) {
        F.dom_.deepDynamicUpdate(index? into[index] : into, fV[i], i);
      }
    }
  } else {
    if (from instanceof F.Behavior) {
      new F.EventStream(
        [from.changes()],
        function (p) {
          if (index) { 
            var old = into[index];
            into[index] = p.value;
          }
          else { into = p.value; } //TODO notify topE?
          return F.doNotPropagate;
        });
    }
  }
};


F.insertValue = function (val, domObj /* . indices */) {
  var indices = Array.prototype.slice.call(arguments, 2);
  var parent = F.dom_.getMostDom(domObj, indices);
  F.dom_.deepStaticUpdate(parent, val, 
      indices ? indices[indices.length - 1] : undefined);      
};

//TODO convenience method (default to firstChild nodeValue) 
F.insertValueE = function (triggerE, domObj /* . indices */) {
  if (!(triggerE instanceof F.EventStream)) { throw 'insertValueE: expected Event as first arg'; } //SAFETY
  
  var indices = Array.prototype.slice.call(arguments, 2);
  var parent = F.dom_.getMostDom(domObj, indices);
  
    triggerE.mapE(function (v) {
      F.dom_.deepStaticUpdate(parent, v, indices? indices[indices.length - 1] : undefined);
    });
};

//insertValueB: F.Behavior * domeNode . Array (id) -> void
//TODO notify adapter of initial state change?
/**
 * Inserts each event in <i>triggerB</i> into the field <i>field</i> of the 
 * elmeent <i>dest</i></p>.
 *
 * @param {F.Behavior} triggerB
 * @param {Node} domObj
 * @param {...string} var_args
 */
F.insertValueB = function (triggerB, domObj, var_args) { 
  
  var indices = Array.prototype.slice.call(arguments, 2);
  var parent = F.dom_.getMostDom(domObj, indices);
  
  
  //NOW
  F.dom_.deepStaticUpdate(parent, triggerB, indices ? indices[indices.length - 1] : undefined);
  
  //LATER
  F.dom_.deepDynamicUpdate(parent, triggerB, indices? indices[indices.length -1] : undefined);
  
};

//TODO copy dom event call backs of original to new? i don't thinks so
//  complication though: registration of call backs should be scoped
F.insertDomE = function (triggerE, domObj) {
  
  if (!(triggerE instanceof F.EventStream)) { throw 'insertDomE: expected Event as first arg'; } //SAFETY
  
  var objD = F.dom_.getObj(domObj);
  
  var res = triggerE.mapE(
    function (newObj) {
      //TODO safer check
      if (!((typeof(newObj) === 'object') && (newObj.nodeType === 1))) { 
        newObj = SPAN({}, newObj);
      }
      F.dom_.swapDom(objD, newObj);
      objD = newObj;
      return newObj; // newObj;
    });
  
  return res;
};

//insertDom: dom 
//          * dom 
//          [* (null | undefined | 'over' | 'before' | 'after' | 'leftMost' | 'rightMost' | 'beginning' | 'end']
//          -> void
// TODO: for consistency, switch replaceWithD, hookD argument order
F.dom_.insertDomInternal = function (hookD, replaceWithD, optPosition) {
  switch (optPosition)
  {
  case undefined:
  case null:
  case 'over':
    F.dom_.swapDom(hookD,replaceWithD);
    break;
  case 'before':  
    hookD.parentNode.insertBefore(replaceWithD, hookD);
    break;
  case 'after':
    if (hookD.nextSibling) {
      hookD.parentNode.insertBefore(replaceWithD, hookD.nextSibling);
    } else {
      hookD.parentNode.appendChild(replaceWithD);
    }
    break;
  case 'leftMost':
    if (hookD.parentNode.firstChild) { 
      hookD.parentNode.insertBefore(
        replaceWithD, 
        hookD.parentNode.firstChild);
              } else { hookD.parentNode.appendChild(replaceWithD); }
              break;
            case 'rightMost':
              hookD.parentNode.appendChild(replaceWithD);
              break;
            case 'beginning':
              if (hookD.firstChild) { 
                hookD.insertBefore(
                  replaceWithD, 
                  hookD.firstChild);
              } else { hookD.appendChild(replaceWithD); }
              break;
            case 'end':
              hookD.appendChild(replaceWithD);
              break;
            default:
              throw ('domInsert: unknown position: ' + optPosition);
  }
};

//insertDom: dom 
//          * dom U String domID 
//          [* (null | undefined | 'over' | 'before' | 'after' | 'leftMost' | 'rightMost' | 'beginning' | 'end']
//          -> void
F.insertDom = function (replaceWithD, hook, optPosition) {
  //TODO span of textnode instead of textnode?
  F.dom_.insertDomInternal(
    F.dom_.getObj(hook), 
    ((typeof(replaceWithD) === 'object') && (replaceWithD.nodeType > 0)) ? replaceWithD :
    document.createTextNode(replaceWithD),      
    optPosition);           
};

/**
 * if optID not specified, id must be set in init val of trigger
 * if position is not specified, default to 'over'
 *
 * @param {F.Behavior|Node} initTriggerB
 * @param {string=} optID
 * @param {string=} optPosition
 */
F.insertDomB = function (initTriggerB, optID, optPosition) {
  
  if (!(initTriggerB instanceof F.Behavior)) { 
    initTriggerB = F.constantB(initTriggerB);
  }
  
  var triggerB = initTriggerB.liftB(function (d) { 
      if ((typeof(d) === 'object') && (d.nodeType >  0)) {
        return d;
      } else {
        var res = document.createElement('span'); //TODO createText instead
        res.appendChild(document.createTextNode(d));
        return res;
      }
    });
  
  var initD = triggerB.valueNow();
  if (!((typeof(initD) === 'object') && (initD.nodeType === 1))) { throw ('insertDomB: initial value conversion failed: ' + initD); } //SAFETY  
  
  F.dom_.insertDomInternal(
    optID === null || optID === undefined ? F.dom_.getObj(initD.getAttribute('id')) : F.dom_.getObj(optID), 
    initD, 
    optPosition);
  
  var resB = F.insertDomE(triggerB.changes(), initD).startsWith(initD);
  
  return resB;
};

/**
 * @param {Node} elem
 * @returns {F.EventStream}
 */
F.mouseE = function(elem) {
  return F.extractEventE(elem,'mousemove')
  .mapE(function(evt) {
      if (evt.pageX | evt.pageY) {
        return { left: evt.pageX, top: evt.pageY };
      }
      else if (evt.clientX || evt.clientY) {
        return { left : evt.clientX + document.body.scrollLeft,
                 top: evt.clientY + document.body.scrollTop };
      }
      else {
        return { left: 0, top: 0 };
      }
  });
};

/**
 * Triggered when the mouse moves, carrying the mouse coordinates.
 *
 * @param {Node} elem
 * @returns {F.Behavior} <code>{ left: number, top: number }</code>
 */
F.mouseB = function(elem) {
  return F.mouseE(elem).startsWith({ left: 0, top: 0 });
};

/**
 * @param {Node} elem
 * @returns {F.EventStream}
 */
F.clicksE = function(elem) {
  return F.extractEventE(elem,'click');
};


//////////////////////////////////////////////////////////////////////////////
// Combinators for web services

F.xhr_.ajaxRequest = function(method,url,body,async,callback) {
  var xhr = new window.XMLHttpRequest();
  xhr.onload = function() { callback(xhr); };
  xhr.open(method,url,async);
  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  }
  xhr.send(body);
  return xhr;
};

F.xhr_.encodeREST = function(obj) {
  var str = "";
  for (var field in obj) {
    if (typeof(obj[field]) !== 'function') { // skips functions in the object
      if (str != '') { str += '&'; }
      str += field + '=' + encodeURIComponent(obj[field]);
    }
  }
  return str;
};

/**
 * Must be an event stream of bodies
 * 
 * @private
 * @param {!string} method PUT or POST
 * @param {!string} url URL to POST to
 * @returns {F.EventStream} an event stream carrying objects with three
 * fields: the request, the response, and the xhr object.
 */
F.EventStream.prototype.xhrWithBody_ = function(method, url) {
  var respE = F.receiverE();
  this.mapE(function(body) {
    var xhr = new window.XMLHttpRequest();
    function callback() {
      if (xhr.readyState !== 4) {
        return;
      }
      respE.sendEvent({ request: body, response: xhr.responseText, xhr: xhr });
    }
    xhr.onload = callback;
    // We only do async. Build your own for synchronous.
    xhr.open(method, url, true);
    xhr.send(body);
  });
  return respE; 
};

/**
 * POST the body to url. The resulting event stream carries objects with three
 * fields: <code>{request: string, response: string, xhr: XMLHttpRequest}</code>
 *
 * @param {!string} url
 * @returns {F.EventStream}
 */
F.EventStream.prototype.POST = function(url) {
  return this.xhrWithBody_('POST', url);
};

/**
 * Transforms a  stream of objects, <code>obj</code>, to a stream of fields
 * <code>obj[name]</code>.
 *
 * @param {!string} name
 * @returns {F.EventStream}
 */
F.EventStream.prototype.index = function(name) {
  return this.mapE(function(obj) {
    if (typeof obj !== 'object' && obj !== null) {
      throw 'expected object';
    }
    return obj[name];
  });
};

/**
 * Parses a steram of JSON-serialized strings.
 *
 * @returns {F.EventStream}
 */
F.EventStream.prototype.JSONParse = function() {
  return this.mapE(function(val) {
    return JSON.parse(val);
  });
};

/**
 * Serializes a stream of values.
 *
 * @returns {F.EventStream}
 */
F.EventStream.prototype.JSONStringify = function() {
  return this.mapE(function(val) {
    return JSON.stringify(val);
  });
};

/**
 * @param {F.EventStream} requestE
 * @returns {F.EventStream}
 */
F.getWebServiceObjectE = function(requestE) {
  var responseE = F.receiverE();

  requestE.mapE(function (obj) {
      var body = '';
      var method = 'GET';
      var url = obj.url;
      
      var reqType = obj.request ? obj.request : (obj.fields ? 'post' : 'get');
      if (obj.request === 'get') {
        if (obj.fields) { url += "?" + F.xhr_.encodeREST(obj.fields); }
        body = '';
        method = 'GET';
      } else if (obj.request === 'post') {
        body = JSON.stringify(obj.fields); 
        method = 'POST';
      } else if (obj.request === 'rawPost') {
        body = obj.body;
        method = 'POST';
      }
      else if (obj.request === 'rest') {
        body = F.xhr_.encodeREST(obj.fields);
        method = 'POST';
      }
      else {
        throw("Invalid request type: " + obj.request);
      }
      
      var async = obj.async !== false;
      
      var xhr;
      
      // Branch on the response type to determine how to parse it
      if (obj.response === 'json') {
        xhr = F.xhr_.ajaxRequest(method,url,body,async,
          function(xhr) {
            responseE.sendEvent(JSON.parse(xhr.responseText)); 
          });
      }
      else if (obj.response === 'xml') {
        F.xhr_.ajaxRequest(method,url,body,async,
          function(xhr) {
            responseE.sendEvent(xhr.responseXML);
          });
      }
      else if (obj.response === 'plain' || !obj.response) {
        F.xhr_.ajaxRequest(method,url,body,async,
          function(xhr) {
            responseE.sendEvent(xhr.responseText);
        });
      }
      else {
        throw('Unknown response format: ' + obj.response);
      }
    return F.doNotPropagate;
  });
  
  return responseE;
};
function AuroraDom(){
    this.get = function(id){
        if(typeof id == 'string'){
            return document.getElementById(id);
        }
        return id;
    }                           
    this.createDiv = function(id, innerHTML, className){//TODO: refactor this to go id, className, innerHTML
        log("CREATE DIVV");
        return this.create('div', id, className, innerHTML);
    }
    this.createSpan = function(id, innerHTML, className){//TODO: refactor this to go id, className, innerHTML
        return this.create('span', id, className, innerHTML);
    }
    this.create = function(type, id, className, innerHTML){//TODO: refactor this to go id, className, innerHTML
        var element = document.createElement(type);
        if(id!=undefined){
            element.id = id;
        }
        if(className!=undefined){
            element.className = className;
        }
        if(innerHTML!=undefined){
            element.innerHTML = innerHTML;
        } 
        return element;
    }
    this.createOption = function(id, className, innerText, value){
        var element = this.create('option', undefined, undefined, innerText);
        element.value = value;
        element.innerText = innerText; 
        element.text = innerText;
        return element;
    }
    this.createImg = function(id, className, src){
        var element = document.createElement('img');
        if(id!=undefined){
            element.id = id;
        }
        if(className!=undefined){
            element.className = className;
        }
        if(src!=undefined){
            element.src = src;
        }
        return element;
    }
    this.stopEvent = function(event){
        event.stopPropagation();  
        event.preventDefault();
    }
    this.getElementsByClassName = function(class_name, tag, elm) {
        var docList = elm.getElementsByTagName('*');
        var matchArray = [];
        /*Create a regular expression object for class*/
        var re = new RegExp("(?:^|\\s)"+class_name+"(?:\\s|$)");
        for (var i = 0; i < docList.length; i++) {
            if (re.test(docList[i].className) ) {
                matchArray.push(docList[i]);
            }                                                  
        }
        return matchArray;
    }
}

function parseMysqlDate(mysql_string){ 
   if(typeof mysql_string === 'string')
   {
      var t = mysql_string.split(/[- :]/);
      return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);          
   }
   return null;   
}
function createButton(value, className){
    var button = createDomElement("input", undefined,"button");
    button.type = "submit";
    button.value = value;
    if(className!=undefined)
        button.className = className;
    return button;
}
String.prototype['contains'] = function(str){
    return (this.indexOf(str) >= 0);
}
//window.getElementsByClassName = DOM.getElementsByClassName;
if(typeof(Element)!='undefined'){
    Element.prototype.removeChildren = function(element){
        if(element==undefined)
            element = this;
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
    }
}
function getMilliseconds(){
var d = new Date();
return d.getTime(); 
} 
function createDomElement(type, id, className, innerHTML){
    var ele = document.createElement(type);
    if(id!=undefined&&id.length>0)
    ele.id = id;
    if(className!=undefined&&className.length>0)
    ele.className = className; 
    if(innerHTML!=undefined&&innerHTML.length>0)
    ele.innerHTML = innerHTML;
    return ele; 
}
function createIcon(src){
    var saveButton = document.createElement("img");
    saveButton.src=src;
    saveButton.style.cursor="pointer";
    return saveButton;
}
function findParentNodeWithTag(element, tag){
    if(element==undefined||element==null)
        return undefined; 
    else if(element.tagName.toUpperCase() == tag.toUpperCase())
        return element;
    return findParentNodeWithTag(element.parentNode, tag);    
}
function findTableRowIndex(table, row){
    for(i=0; i<table.rows.length; i++){
        if(table.rows[i]==row)
            return i;
    }
    return -1;
}

function stopEventBubble(event){
    agent = jQuery.browser;
    if(agent.msie) {
        event.cancelBubble = true;
    } else {
        event.stopPropagation();
    }
}
function ajax(options) {
    if(typeof jQuery != 'undefined'){
        jQuery.ajax(options);
    }
    else{
        var type = (options["type"]=='undefined')?"POST":options["type"];
        var success = options["success"];
        var error = options["fail"];
        var dataType = options["dataType"];
        var url = options["url"];
        var data = options["data"];
        
        function getXMLHttpRequest() {
            if (window.XMLHttpRequest) {
                return new window.XMLHttpRequest;
            } else {
                try {
                    return new ActiveXObject("MSXML2.XMLHTTP");
                } catch (ex) {
                    return null;
                }
            }
        }

        if(typeof data == 'string'){
            data = JSON.parse(data);
        } 
        var dataStr="";
        var count =0;
        for(index in data){
            var dataPiece = (typeof(data[index])=='string')?data[index]:JSON.stringify(data[index]);
            if(count!=0)
                dataStr+="&";
            dataStr += index+"="+dataPiece;
            count++;
        }
        //dataStr = dataStr.replaceAll("\"", "'");
        /*var oReq = getXMLHttpRequest();
        if (oReq != null) {
            oReq.open("POST", url, true);
            oReq.onreadystatechange = handler;
            oReq.send(dataStr);
        } else {
            UI.showMessage("AJAX (XMLHTTP) not supported.");
        }  */
        var xmlhttp = getXMLHttpRequest(); 
        
        if (xmlhttp != null) {
            xmlhttp.open("POST",url,true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send(dataStr);
            xmlhttp.onreadystatechange = function(){
                if (xmlhttp.readyState == 4 /* complete */ ) {
                    if (xmlhttp.status == 200 && success!=undefined) {
                        success(xmlhttp.responseText);
                    }
                    else if(error!=undefined)
                        error(xmlhttp.status);
                }
            };
        } else {
            UI.showMessage("AJAX (XMLHTTP) not supported.");
        }
    }    
}
window['createBehaviour'] = function(initialValue){
    return F.receiverE().startsWith(initialValue);
}
function getPos(el) {
    // yay readability
    for (var lx=0, ly=0;el != null;lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent){}
    return {x: lx,y: ly};
}

function aurora_viewport()
{
var e = window
, a = 'inner';
if ( !( 'innerWidth' in window ) )
{
a = 'client';
e = document.documentElement || document.body;
}
return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}
//John Resig   
var ready = ( function () {
function addEvent( obj, type, fn ) {
    if (obj.addEventListener) {
        obj.addEventListener( type, fn, false );
        EventCache.add(obj, type, fn);
    }
    else if (obj.attachEvent) {
        obj["e"+type+fn] = fn;
        obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
        obj.attachEvent( "on"+type, obj[type+fn] );
        EventCache.add(obj, type, fn);
    }
    else {
        obj["on"+type] = obj["e"+type+fn];
    }
}
var EventCache = function(){
    var listEvents = [];
    return {
        listEvents : listEvents,
        add : function(node, sEventName, fHandler){
            listEvents.push(arguments);
        },
        flush : function(){
            var i, item;
            for(i = listEvents.length - 1; i >= 0; i = i - 1){
                item = listEvents[i];
                if(item[0].removeEventListener){
                    item[0].removeEventListener(item[1], item[2], item[3]);
                };
                if(item[1].substring(0, 2) != "on"){
                    item[1] = "on" + item[1];
                };
                if(item[0].detachEvent){
                    item[0].detachEvent(item[1], item[2]);
                };
                item[0][item[1]] = null;
            };
        }
    };
}();
// Usage
/*addEvent(window,'unload',EventCache.flush);
addEvent(window,'load', function(){});       */

  function ready( f ) {
    if( ready.done ) return f();

    if( ready.timer ) {
      ready.ready.push(f);
    } else {
      addEvent( window, "load", isDOMReady );
      ready.ready = [ f ];
      ready.timer = setInterval(isDOMReady, 13);
    }
  };

  function isDOMReady() {
    if( ready.done ) return false;

    if( document && document.getElementsByTagName && document.getElementById && document.body ) {
      clearInterval( ready.timer );
      ready.timer = null;
      for( var i = 0; i < ready.ready.length; i++ ) {
        ready.ready[i]();
      }
      ready.ready = null;
      ready.done = true;
    }
  }

  return ready;
})();


function caller(ob, depth, maxDepth){
    if(depth==undefined)
        depth = 1;
    if(maxDepth==undefined)
        maxDepth = 10;
    log("Probing at depth: "+depth);
    log(ob);
    log(ob.callee);
    log(ob.callee.toString);
    log(ob.callee.caller);
    log(ob.callee.caller.toString());
    log("");
    if(depth<=maxDepth)
        caller(ob.callee.caller.arguments, depth+1, maxDepth);
}
function auroraParseBoolean(b){
    if(b=="true"||b==true)
        return true;
    return false;
}

function getViewPortDimensions(){
 
 var viewportwidth;
 var viewportheight;
  
 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
  
 if (typeof window.innerWidth != 'undefined')
 {
      viewportwidth = window.innerWidth,
      viewportheight = window.innerHeight
 }
  
// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
 
 else if (typeof document.documentElement != 'undefined'
     && typeof document.documentElement.clientWidth !=
     'undefined' && document.documentElement.clientWidth != 0)
 {
       viewportwidth = document.documentElement.clientWidth,
       viewportheight = document.documentElement.clientHeight
 }
  
 // older versions of IE
  
 else
 {
       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
       viewportheight = document.getElementsByTagName('body')[0].clientHeight
 }
return {width: viewportwidth, height: viewportheight};
}
// Array Remove - By John Resig (MIT Licensed)

/*Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};      */


Array.indexOf = function(array, needle) {
        return arrayIndexOf(array, needle);
    };  

arrayIndexOf = function(arr, needle) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] === needle) {
                return i;
            }
        }
        return -1;
    };            
function arrayCut(array, index) {
    array.splice(index,1); 
};
Array.max = function( array ){
    return Math.max.apply( Math, array );
};

Array.min = function( array ){
    return Math.min.apply( Math, array );
};
//}
/*Array.prototype.contains = function(ob){
    return this.indexOf('Sam') > -1;
}    */
function arrayContains(array, search){
    return arrayIndexOf(array, search) > -1; 
}

String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
};

String.prototype.endsWith = function(suffix) {
    return this.match(suffix+"$") == suffix;
};
if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

String.prototype.replaceAll = function(replace, with_this) {
  return this.replace(new RegExp(replace, 'g'),with_this);
};
/*if (!document.addEventListener && document.attachEvent)
{
    Object.prototype.addEventListener = function(eventName, func, capture)
    {
        if (this.attachEvent)
            this.attachEvent('on' + eventName, func);
    }

    var i, l = document.all.length;

    for (i = 0; i < l; i++)
        document.all[i].addEventListener = Object.prototype.addEventListener;

    window.addEventListener = Object.prototype.addEventListener;
    document.addEventListener = Object.prototype.addEventListener;
}*/
if(!window.addEventListener && document.attachEvent){
window.addEventListener = function(eventName, func, capture){
        this.attachEvent('on' + eventName, func);
    }
}


/*document.getElementsByClassName = function(cl) {
var retnode = [];
var myclass = new RegExp('\\b'+cl+'\\b');
var elem = this.getElementsByTagName('*');
for (var i = 0; i < elem.length; i++) {
var classes = elem[i].className;
if (myclass.test(classes)) retnode.push(elem[i]);
}
return retnode;
}; 
function getElementsByClassName2(className, body){
    var retnode = [];
     var element = document.createElement('div');
    element.innerHTML = body;
    var tags = element.getElementsByTagName('img');
    for(index in tags){
        var tag = tags[index];
        if(tag.className==className){
            retnode.push(tag);
        }
    }
    return retnode;
}          */
function test(ob){
    alert(getClassName(ob)+" | "+ob+" | "+ObjectToString(ob));
}
function getClassName(element) { 
   var funcNameRegex = /function (.{1,})\(/;
   var results = (funcNameRegex).exec((element).constructor.toString());
   return (results && results.length > 1) ? results[1] : "";
}; 

function loadXMLString(txt)
{
if (window.DOMParser)
  {
  parser=new DOMParser();
  xmlDoc=parser.parseFromString(txt,"text/xml");
  }
else // Internet Explorer
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  xmlDoc.async="false";
  xmlDoc.loadXML(txt);
  }
return xmlDoc;
}
/*document.getElementsByClassName = function(class_name) {
    return getElementsByClassName(class_name, '', null); 
}*/
getElementsByClassName = function(class_name, tag, elm) {
    doc = elm || this;
    var docList = doc.all || doc.getElementsByTagName('*');
    var matchArray = new Array();

    /*Create a regular expression object for class*/
    var re = new RegExp("(?:^|\\s)"+class_name+"(?:\\s|$)");
    for (var i = 0; i < docList.length; i++) {
        //showObj(docList[i]);
        if (re.test(docList[i].className) ) {
            matchArray[matchArray.length] = docList[i];
        }
    }
    return matchArray;
}

/*var getElementsByClassName = function (className, tag, elm){
    if (document.getElementsByClassName) {
        getElementsByClassName = function (className, tag, elm) {
            elm = elm || document;
            var elements = elm.getElementsByClassName(className),
                nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
                returnElements = [],
                current;
            for(var i=0, il=elements.length; i<il; i+=1){
                current = elements[i];
                if(!nodeName || nodeName.test(current.nodeName)) {
                    returnElements.push(current);
                }
            }
            return returnElements;
        }; 
    }
    else if (document.evaluate) {
        getElementsByClassName = function (className, tag, elm) {
            tag = tag || "*";
            elm = elm || document;
            var classes = className.split(" "),
                classesToCheck = "",
                xhtmlNamespace = "http://www.w3.org/1999/xhtml",
                namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
                returnElements = [],
                elements,
                node;
            for(var j=0, jl=classes.length; j<jl; j+=1){
                classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
            }
            try    {
                elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
            }
            catch (e) {
                elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
            }
            while ((node = elements.iterateNext())) {
                returnElements.push(node);
            }
            return returnElements;
        };
    }
    else {
        getElementsByClassName = function (className, tag, elm) {
            tag = tag || "*";
            elm = elm || document;
            var classes = className.split(" "),
                classesToCheck = [],
                elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
                current,
                returnElements = [],
                match;
            for(var k=0, kl=classes.length; k<kl; k+=1){
                classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
            }
            for(var l=0, ll=elements.length; l<ll; l+=1){
                current = elements[l];
                match = false;
                for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
                    match = classesToCheck[m].test(current.className);
                    if (!match) {
                        break;
                    }
                }
                if (match) {
                    returnElements.push(current);
                }
            }
            return returnElements;
        };
    }
    return getElementsByClassName(className, tag, elm);
};
        */ 
function createDomElement(type, id, className, innerHTML){
    var ele = document.createElement(type);
    if(id.length>0)
    ele.id = id;
    if(className.length>0)
    ele.className = className; 
    if(innerHTML.length>0)
    ele.innerHTML = innerHTML;
    return ele; 
}
function getElement(id){
    return document.getElementById(id);
}
function disableEventPropagation(event)
{
   if (event.stopPropagation){
       event.stopPropagation();
   }
   else if(window.event){
      window.event.cancelBubble=true;
   }
} 
function disableHighlight(target){
	target = (typeof(target)=='string')?DOM.get(target):target;
    if(document.all)
        target.onselectstart = handleSelectAttempt;
    target.onmousedown = handleSelectAttempt;   
}

function handleSelectAttempt(e) {
    var sender = e && e.target || window.event.srcElement;
    if (window.event) {
        event.returnValue = true;
    }
    return true;
}
function makeUnselectable(node) {
    if (node.nodeType == 1) {
        node.unselectable = true;
    }
    var child = node.firstChild;
    while (child) {
        makeUnselectable(child);
        child = child.nextSibling;
    }
}

function objectEquals(ob1, ob2)
{
    if(typeof(ob1)=='undefined'||typeof(ob2)=='undefined'){
        return (typeof(ob1)=='undefined'&&typeof(ob2)=='undefined');
    }


  var p;
  for(p in ob1) {
      if(typeof(ob2)=='undefined'||typeof(ob2[p])=='undefined') {return false;}
  }

  for(p in ob1) {
      if (ob1[p]) {
          switch(typeof(ob1[p])) {
              case 'object':
                  if (!objectEquals(ob1[p], ob2[p])) { return false; } break;
              case 'function':
                  if (typeof(ob2)=='undefined' || typeof(ob2[p])=='undefined' ||
                      (p != 'equals' && ob1[p].toString() != ob2[p].toString()))
                      return false;
                  break;
              default:
                  if (ob1[p] != ob2[p]) { return false; }
          }
      } else {
          if (ob2[p])
              return false;
      }
  }

  for(p in ob2) {
      if(typeof(ob1)=='undefined'||typeof(ob1[p])=='undefined') {return false;}
  }

  return true;
}   
//Object.prototype.equals = objectEquals;
function clone(source){
    return cloneObject(source);
}  
//Object.prototype.clone = clone;
function cloneObject(source) {
   if (source instanceof Array) {
        var copy = [];
        for (var i = 0; i < source.length; i++) {
            copy[i] = cloneObject(source[i]);
        }
        return copy;
    }
   var copiedObject = {};
   jQuery.extend(true, copiedObject,source);
   return copiedObject;
   }


/*  
/*Object.extend = function(destination, source) {
  for (var property in source)
    destination[property] = source[property];
  return destination;
};    */

/*function cloneObject(source) {
    /*for (i in source) {
        if (typeof source[i] == 'source') {
            this[i] = new cloneObject(source[i]);
        }
        else{
            this[i] = source[i];
    }
    } 
//    return Object.extend({ }, object);
   // return jQuery.extend(true, {}, source);
   //return clone(source);
   
   var copiedObject = {};
   jQuery.extend(copiedObject,source);
   return copiedObject;
}  
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

       */
       
       //LZW Compression/Decompression for Strings
var LZW = {
    compress: function (uncompressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = {},
            c,
            wc,
            w = "",
            result = [],
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[String.fromCharCode(i)] = i;
        }
 
        for (i = 0; i < uncompressed.length; i += 1) {
            c = uncompressed.charAt(i);
            wc = w + c;
            if (dictionary[wc]) {
                w = wc;
            } else {
                result.push(dictionary[w]);
                // Add wc to the dictionary.
                dictionary[wc] = dictSize++;
                w = String(c);
            }
        }
 
        // Output the code for w.
        if (w !== "") {
            result.push(dictionary[w]);
        }
        return result;
    },
 
 
    decompress: function (compressed) {
        "use strict";
        // Build the dictionary.
        var i,
            dictionary = [],
            w,
            result,
            k,
            entry = "",
            dictSize = 256;
        for (i = 0; i < 256; i += 1) {
            dictionary[i] = String.fromCharCode(i);
        }
 
        w = String.fromCharCode(compressed[0]);
        result = w;
        for (i = 1; i < compressed.length; i += 1) {
            k = compressed[i];
            if (dictionary[k]) {
                entry = dictionary[k];
            } else {
                if (k === dictSize) {
                    entry = w + w.charAt(0);
                } else {
                    return null;
                }
            }
 
            result += entry;
 
            // Add w+entry[0] to the dictionary.
            dictionary[dictSize++] = w + entry.charAt(0);
 
            w = entry;
        }
        return result;
    }
}; // For Test Purposes
/*    comp = LZW.compress("TOBEORNOTTOBEORTOBEORNOT"),
    decomp = LZW.decompress(comp);
document.write(comp + '<br>' + decomp);*/




/**
*
*  MD5 (Message-Digest Algorithm)
*  http://www.webtoolkit.info/
*
**/
 
var MD5 = function (string) {
 
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
 
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
     }
 
     function F(x,y,z) { return (x & y) | ((~x) & z); }
     function G(x,y,z) { return (x & z) | (y & (~z)); }
     function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
 
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
 
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    };
 
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
 
    string = Utf8Encode(string);
 
    x = ConvertToWordArray(string);
 
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
 
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
    return temp.toLowerCase();
}

/*objectEquals = function(ob1, x)
{
  for(p in ob1) {
      if(typeof(x[p])=='undefined') {return false;}
  }

  for(p in ob1) {
      if (ob1[p]) {
          switch(typeof(ob1[p])) {
              case 'object':
                  if (!objectEquals(ob1[p], x[p])) { return false; } break;
              case 'function':
                  if (typeof(x[p])=='undefined' ||
                      (p != 'equals' && ob1[p].toString() != x[p].toString()))
                      return false;
                  break;
              default:
                  if (ob1[p] != x[p]) { return false; }
          }
      } else {
          if (x[p])
              return false;
      }
  }

  for(p in x) {
      if(typeof(ob1[p])=='undefined') {return false;}
  }

  return true;
} */


         
function loadScriptE(url){
    var rec = F.receiverE();
    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                rec.sendEvent(true);
            }
        };
    } else {  //Others
        script.onload = function(){
            rec.sendEvent(true);
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
    return rec;
}

function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function aurora_requestWidgetRefE(page){
    var rec = F.receiverE();
    jQuery.ajax({
        dataType: 'json',
        type: "post",
        data: {page: page},
        url: SETTINGS.scriptPath+"request/getWidgetRef",
        success: function(data){
            rec.sendEvent(data);
        },
        error: connectionError
    });
    return rec;
}
function aurora_requestWidgetRef(page, callback){
    jQuery.ajax({
        dataType: 'json',
        type: "post",
        data: {page: page},
        url: SETTINGS.scriptPath+"request/getWidgetRef",
        success: function(data){
            callback(data);
        },
        error: connectionError
    });
}
function getPlaceholderDimensions(placeholder){
    var width = placeholder.getAttribute('width');
    var height = placeholder.getAttribute('height');
    width = (width!=undefined)?width:placeholder.style.width;
    height = (height!=undefined)?height:placeholder.style.height;
    wUnit = width.contains("%")?"%":"px";
    hUnit = height.contains("%")?"%":"px";
    return {width: parseInt(width.replace('px', '')), height: parseInt(height.replace('px', '')), wUnit: wUnit, hUnit:hUnit};
}

function getObjectValues(ob){
    var ret = [];
    log("getObjectValues");
    for(index in ob){
    	log(index);
    	log(ob[index]);
        ret.push(ob[index]);
    }
    return ret;
}     

/**
 *  RemoteData
 * @constructor
 */
 

function RemoteData(key, context, initialValue, pollRate){
   
this.hash = "HASH";
    this.eventE = F.receiverE();
    this.event = this.eventE;
    this.originBehaviour = this.event.startsWith(initialValue);
    this.pollRate = (pollRate==undefined)?0:pollRate;//A pollrate of 0 means it will be requested once.
    this.lastUpdated = 0;
    this.behaviour = F.liftBI(
        function(value){
            return value;
        },
        function(value){
            //log("Upstream Event: "+key);
            parent.data = value;
            parent.hash = null;
            parent.dirty=true;
            return [undefined];
        },
        this.originBehaviour);
    this.requiresPoll = function(){
        return ((new Date().getTime())>(this.lastUpdated+this.pollRate)||this.lastUpdated==0);
    }
    this.updateFromServer = function(data, hash){
        this.dirty = false;
        this.hash = hash;
        if(data.length!=0){
            this.lastUpdated = new Date().getTime();
            this.data = data;
            this.event.sendEvent(data);
        }
    }
    this.sendEvent = function(event){
        this.behaviour.sendEvent(event);
    }
    this.key = key;
    this.dirty = false;
    this.data = initialValue;
    this.context = (context==undefined)?"":context;
    this.remote = true;
    this.newData=null;
    var parent = this;
}

/**
 *  CompositKey
 * @constructor
 */
function CompositKey(key1, key2){
    this.getKey = function(){                   
        return (key2==undefined||key2.length==0)?key1:key1+"___"+key2;
    }
    //this["getKey"] = this.buildKey;
}
/**
 *  BehaviourManager
 * @constructor
 */
function BehaviourManager(){
    this.availableRemotes = new Array();
    this.localData = new Object();
    this.data = new Object();
    this.buildKey = function(key1, key2){                   
        return (key2==undefined||key2.length==0)?key1:key1+"___"+key2;
    }
    this.getRemote = function(key, context, initialValue, pollRate){
        var key2 = key;
        if(context=="_"||(context!=undefined&&context!='undefined'&&context!=null&&context.length!=0)){
            key2 = new CompositKey(key, context).getKey();
        }
        initialValue = (initialValue==undefined)?NOT_READY:initialValue;
        pollRate = (pollRate==undefined)?0:pollRate;
        if(this.data[key2]==undefined)
            this.data[key2] =  new RemoteData(key, context, initialValue, pollRate);
        else if(this.data[key2].pollRate<pollRate)
            this.data[key2].pollRate = pollRate;         
        return this.data[key2]; 
    }
    this.getE = function(key, context){
        var key2 = key;
        if(context=="_"||(context!=undefined&&context!='undefined'&&context!=null&&context.length!=0)){
            key2 = new CompositKey(key, context).getKey();
        }
        if(this.localData[key2]==undefined)
            this.localData[key2] = F.receiverE();
        return this.localData[key2];
    }
    this.getB = function(key, context, initialValue){
        var key2 = key;
        if(context=="_"||(context!=undefined&&context!='undefined'&&context!=null&&context.length!=0)){
            key2 = new CompositKey(key, context).getKey();
        }
        if(this.localData[key2]==undefined){
            this.localData[key2] = F.liftBI(function(value){
                return value;
            }, function(value){
                return [value];
            }, F.receiverE().startsWith((initialValue==undefined)?NOT_READY:initialValue));
        }
        return this.localData[key2];
    }
    /*this.getB = function(key, context){
        var key2 = key;
        if(context=="_"||(context!=undefined&&context!='undefined'&&context!=null&&context.length!=0)){
            key2 = new CompositKey(key, context).getKey();
        }
        if(this.localData[key2]==undefined)
            this.localData[key2] = receiverE().startsWithI(NOT_READY);
        return this.localData[key2];
    }     */
    /*this.registerRemote=function(key){
        this.availableRemotes.push(key);
    }
    this.register=function(key, context, behaviour){
        context = (context==undefined||context.length==0)?"_":context;
        if(this.localData[key]!=undefined&&this.localData[key][context]!=undefined)
            return this.localData[key][context];
        if(this.localData[key]==undefined)
            this.localData[key] = new Array();
        this.localData[key][context] = behaviour;
        return this.localData[key][context]; 
    }*/
    this.deregister = function(key, context){
        context = (context=='undefined'||context==null||context.length==0)?"_":context;
        key = new CompositKey(key, context).getKey();
        this.data[key]=null;
        delete this.data[key];
    }   
    this.isEmpty = function(){
        return (this.size()==0);
    }
    this.size = function(){                 
        var size = 0, key;
        for (key in this.data) {
            if (this.data.hasOwnProperty(key)) size++;
        }
        return size;
        //return Object.keys(this.data).length; 
    }
    this.get = function(key, context, initialValue){
        var mContext = (context==undefined||context.length==0)?"_":context;
        if(this.data[key]!=undefined&&this.data[key][mContext]!=undefined){
            return this.data[key][mContext];
        }
        return this.getB(key, context, initialValue);
       /* 
        
        if(this.localData[key]!=undefined&&this.localData[key][mContext]!=undefined)
            return this.localData[key][mContext];
        if(context=="_"||(context!='undefined'&&context!=null&&context.length!=0)){
            key = new CompositKey(key, mContext).getKey();
        }
        return this.data[key].behaviour; */
    }
    this.getDataRequest = function(){
        var arr = new Array();       
        for(var index in this.data){
            var dataR = this.data[index];                            //rDatashow
            //log(dataR);
            if(dataR.requiresPoll()){
                var packet = dataR.dirty?{key: dataR.key, context: dataR.context, data: dataR.data}:{key: dataR.key, context: dataR.context, hash: dataR.hash};
                arr.push(packet);
            }
        }           
        return {"database": cleanFunctions(arr)};
    }
    this.startPolling = function(){
        var localData = this.localData;
        var data = this.data;
        var respE = F.receiverE();
        var requestEvery = window['SETTINGS']['updateWait']; // request with this delay, only if last request is already serviced
        var nowB = F.timerB(500); // current time, 500ms granularity
        var lastRespTmB = respE.snapshotE(nowB).startsWith(nowB.valueNow());
        var requestOkayB = F.liftB(function(now, lastRespTm) {
		//log("Request OK");
            return (now > (lastRespTm + requestEvery));                               
        }, nowB, lastRespTmB);
        var requestReadyE = requestOkayB.changes().filterE(function(x) { return x; }).filterE(function(x){return !DATA.isEmpty()}); 
        var dataRequestReady = requestReadyE.snapshotE(nowB).mapE(function(x){return DATA.getDataRequest();}); 
        var serverResponseE = sendServerRequestE(dataRequestReady, window['SETTINGS']['scriptPath']+'getBehaviours');
        var localSyncE = serverResponseE.mapE(function(retData){                  
        	for(key in retData){
                var dataRow = retData[key];
                for(context in dataRow){
	                var newKey = key;
	                if(context!=undefined&&context.length!=0){
	                    newKey+="___"+context;
	                }
	                var serverData = dataRow[context];
                    var localData = data[newKey]; 
                   //Pre getKey() check for json object contexts. 
                    //var newKey = new CompositKey(key, context);
                   // localData = (localData!=null)?localData:data[newKey];
                    localData.updateFromServer(serverData.data, serverData.hash);
                }                                  
            }
            respE.sendEvent(true);
            return retData;
        });
        //respE.sendEvent(true);
    }
}
function sendServerRequestE(triggerE, url, timeout){
    timeout = (timeout==undefined)?15000:timeout;
    var rec = F.receiverE();                       
    triggerE.mapE(function(requestData){
        if(requestData["database"].length>0){
        requestData.database = JSON.stringify(requestData.database);
        jQuery.ajax({
            type: "post",
            async: true,
            data: requestData,
            dataType: 'json',
            url: url,
            timeout: timeout,
            success: function(data){
                rec.sendEvent(data);
            },
            error: function(data){/*rec.sendEvent(data);*/}
        });
        }
    });                                          
    return rec;
}
/**
 *  WidgetManager
 * @constructor
 */
function WidgetManager(){
    this.widgetTypes=new Array(); 
    this.widgetInterface=new Array();
    this.widgets = new Array();
    this.register = function(name, classDef, configInterface){
        this.widgetTypes[name] = classDef;
        if(configInterface!=undefined){
            this.widgetInterface[name] = configInterface;
        }
    }
    this.add = function(widget){
        this.widgets.push(widget);
    }
    this.load = function()
    {
        for(var i=0;i<this.widgets.length;i++){
           this.widgets[i].loader();
        }
    }
    this.clear = function(){
        this.widgets = new Array();     
    }
    
    //These method are for scripts that are not compiled. String keys are used to avoid abfuscation.
    this['getWidgetDef'] = function(str){
        return this.widgetTypes[str];
    }
    this['buildWidget'] = function(widget){
        return widget.build();
    }
    this['renderWidget'] = function(widget, data){
        //log(widget);
        return (widget['render'])(data);
    }
    this['loadWidget'] = function(widget){
        return widget.loader();
    }
    this['getWidgetInterface'] = function(name){
        return this.widgetInterface[name];
    }
    this['getWidgetTypes'] = function(){
        return this.widgetTypes;
    }
    this["renderConfigurator"] = function(widget, data){
        return widget.render(data);
    }
    this["getDescription"] = function(widget){
        return widget.getDescription();
    }
    this["getImage"] = function(widget){
        log(widget);
        return widget.getImage();
    }
    this["getName"] = function(widget){
        return widget.getName();
    }
    this["getData"] = function(widget){
        return widget.getData();
    }
}


goog['require']('F');
var DATA = new BehaviourManager();
var DOM = new AuroraDom();
var ENUMS = {};
window['WIDGETS'] = new WidgetManager();
var POLL_RATES = {ONCE: 0, VERY_FAST: 500, FAST: 1500, NORMAL: 3000, SLOW: 5000, VERY_SLOW: 30000};
var CONSTANTS = {NOT_READY: 978000,NO_PERMISSION: 978001, RENDER_SIZE: {SMALL: 0, MEDIUM: 1, LARGE: 2}};
var NOT_READY = CONSTANTS.NOT_READY;
var NO_PERMISSION = CONSTANTS.NO_PERMISSION; 
window['UI'] = new aurora_ui();
var WIDGET = {
    getWidth: function(){return (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');},
    getHeight: function(){return (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');}
}; 
var userB = DATA.getRemote("aurora_current_user",undefined,NOT_READY, POLL_RATES.VERY_SLOW).behaviour;
var widgets=new Array();
var getVars = readGET();


//var docReadyE = jQuery(document).fj('extEvtE', 'ready'); 

/**
* @type {F.Event}
*/
var pageE = F.receiverE();
/**
* @type {F.Behavior}
*/
var pageB = pageE.startsWith(NOT_READY);

var pageDataB = F.liftB(function(pageData){
    if(pageData==NOT_READY)
        return NOT_READY;      
    var page = pageData.page;
    var theme = pageData.theme;
    var permissions = pageData.permissions;
    WIDGETS.clear();
    //log("Rendering Page "+page+" "+theme);
    document.getElementById("body").innerHTML = renderPage(theme.html);   // Using the body div and not body because ckeditor doesnt like the body tag
    document.getElementById("content").innerHTML = renderPage(page.html);
        
    WIDGETS.load();
    document.getElementById("body").style.display = 'block';   // Page data is output in php pre JS render but the body div is hidden so its not visible. This is for SEO
},pageB);
ready(function() {
    var pageName = window['SETTINGS']['page']['name'];
    var href = window['SETTINGS']['scriptPath']+pageName;
    if(history.pushState){
        //history.pushState({page: pageName}, pageName, href);    
    }
    else{
        //window.location = href;
    }  
    pageE.delayE(1000).mapE(function(){   //TODO: Fix this dodgey bandaid which fixed the firefox dialog box issue
        if(window['SETTINGS']['messages']!=""){
            UI.showMessage('', window['SETTINGS']['messages']);
            window['SETTINGS']['messages'] = "";      
        }
    });
    pageE.sendEvent({page: window['SETTINGS']['page'], theme: SETTINGS['theme'], permissions: SETTINGS['pagePermissions']});
    DATA.startPolling();
});
window.addEventListener('popstate', function(ev) {
  if(ev.state && ev.state.page){
    loadPageE.sendEvent(ev.state.page);
  }
  else{
    
    //loadPageE.sendEvent(document.URL.replace(SETTINGS['scriptPath'], ''))
  }
});
//})(F);

function renderPage(data){
    var widgetTypes = WIDGETS.widgetTypes;
    widgets=Array();    
    var elm = document.createElement('div');
    elm.innerHTML=data; 
    for (var key in widgetTypes) {
        //log(key);
        widgetDef = widgetTypes[key];   
        var widgetPlaceholders = DOM.getElementsByClassName("widget_"+key, "img", elm);
        for (var i=0;i<widgetPlaceholders.length;i++){
            if(index==="addEventListener"){
                break;
            }
            var widgetPlaceholder = widgetPlaceholders[i];     
            var instanceId = key+i; //(widgetPlaceholder.id!='')?widgetPlaceholder.id:key+i;
            var arguments={};
            //alert(widgetPlaceholder.alt);
            try{         
                arguments = (widgetPlaceholder.alt==null||widgetPlaceholder.alt=="")?{placeholder: widgetPlaceholder}:window['JSON'].parse(widgetPlaceholder.alt.replaceAll("'", '"'));    
            }
            catch(err){
                log("Widget Argument Parse Error: "+err);
                arguments={};
            }

            var element = document.createElement('span');
            if(typeof(arguments)!='string'&&widgetPlaceholder.width!=null&&widgetPlaceholder.width!=null){
                element.width = widgetPlaceholder.width;
                element.height = widgetPlaceholder.height; 
            }
            arguments.placeholder = widgetPlaceholder;
            if(typeof jQuery != 'undefined')
                widget = jQuery.extend(new widgetDef(instanceId, arguments), WIDGET);
            else
                widget = new widgetDef(instanceId, arguments);   
            WIDGETS.add(widget);
            
            var wBuild = widget.build();
            if(typeof(wBuild)=='undefined'){}
            else if(typeof(wBuild)=='string'){
                element.innerHTML = wBuild;
            }
            else{
                element.appendChild(wBuild);
            }
            widgetPlaceholder.parentNode.replaceChild(element, widgetPlaceholder);
        }
    } 
    return elm.innerHTML;            
}

var loadPageE = F.receiverE();
loadPageE.mapE(function(pageName){
    ajax({
        dataType: 'json',
        url: SETTINGS.scriptPath+"request/getPage/"+pageName+"/",
        success: function(data){
            pageE.sendEvent({page: data, theme: window['SETTINGS']['theme'], permissions: data.permissions});
        },
        error: connectionError
    });    
}); 
function loadPage(pageName){
    /*window.location = window['SETTINGS']['scriptPath']+pageName;
    return;*/
    log("Loadpage");
    if(history.pushState){
        history.pushState({page: pageName}, pageName, window['SETTINGS']['scriptPath']+pageName);
        loadPageE.sendEvent(pageName);
    }
    else{
        window.location = window['SETTINGS']['scriptPath']+pageName;
    }
    return false;
}   

function connection_error(error){
    log(error);
}
//te2sting testing
function checkPermission(groupId){
    for(index in window['SETTINGS']['page']['permissions']['groups']){
        if(window['SETTINGS']['page']['permissions']['groups'][index]['group_id']==groupId)
            return true;
    }
    return false;
}
function connectionError(error){
    log(error);
}
function isBase(){
    return window['SETTINGS']['page']['name']==window['SETTINGS']['defaultPage'];
}
function readGET(){
    var params = {};
    if(window.location.search){
    var param_array = window.location.search.split('?')[1].split('&');
    for(var i in param_array){
        x = param_array[i].split('=');
        params[x[0]] = x[1];
    }
    return params;
}
    return {};
};

/**
 *  aurora_ui
 * @constructor
 */
function aurora_ui(){
    this.active = false;
    
    this.showOnCursor = function(targetId, text, style, duration){
        if(!this.active){
            var divId = targetId+'_tooltip';
            this.active = true;
            var d = DIV({ "className": style,"id": divId,
                  style: { "position": 'absolute'}},
                text);
            var blah = F.insertDomB(d,targetId,'beginning');
            
            F.liftB(function(left, top){
                document.getElementById(divId).style.left = (left+5)+'px';
                document.getElementById(divId).style.top = (top+5)+'px';    
            }, mouseLeftB(document),mouseTopB(document));
                        
            if(duration!=null)
                setTimeout(function(){fadeOutE(d, 20, 20).mapE(function(){document.getElementById(targetId).removeChild(d);})}, duration);
            this.active = false;
            return blah
            
        }                                  
    }
    this.showMessage = function(title, message, callback, options){
        var modal = (options==undefined||options.modal==undefined)?true:options.modal;
        var draggable = (options==undefined||options.draggable==undefined)?false:options.draggable;  
        var resizable = (options==undefined||options.resizable==undefined)?false:options.resizable;
        var width = (options==undefined||options.width==undefined)?"":options.width;
        var height = (options==undefined||options.height==undefined)?"'600'":options.height; 
        if(typeof jQuery == 'undefined'){ 
            this.dialog(title, message, undefined, callback);
        }
        else{
            var oldD =  document.getElementById('aurora_dialog');
            if(oldD!=null)
                oldD.parentNode.removeChild(oldD);
            var dialog = createDomElement('div', 'aurora_dialog', '', message);
            dialog.style.width = "100%";
            dialog.title = title;
            document.body.appendChild(dialog);
            var dialogOptions = {width: width, "modal": modal,"draggable": draggable,"resizable": resizable,"buttons":[{"text": "Ok","click": function() { jQuery(this).dialog("close");if(callback!=undefined)callback();}}]}
            if(options!=undefined && options.fullscreen!=undefined&&options.fullscreen==true){
            	dialogOptions.minWidth = 1000;
            	dialogOptions.minHeight = jQuery(window).height()-100;
        	}
            if(options!=undefined&&options.height!=undefined){
                dialogOptions.height = options.height;    
            }
            jQuery("#aurora_dialog").dialog(dialogOptions);
        }
    }
    this.confirm = function(title, message, text1, callback1, text2, callback2, fullscreen, dialogOpenCallback){
        if(typeof jQuery == 'undefined'){
            this.dialog(title, message, text1, callback1, text2, callback2, fullscreen, dialogOpenCallback);
       }
       else{
          var options = {
            "modal": true,
            "draggable": false,
            "resizable": false,
            "open": function(event, ui) {
                if(dialogOpenCallback!=undefined)
                    dialogOpenCallback();
            },
            "buttons":[
            {"text": text1,"click": function(){jQuery(this).dialog("close");if(callback1!=undefined)callback1();}},
            {"text": text2,"click": function(){jQuery(this).dialog("close");if(callback2!=undefined)callback2();}}
            ]
        };
        if(fullscreen!=undefined&&fullscreen==true){
            options.minWidth = 1000;
            options.minHeight = jQuery(window).height()-100;
            options.position = ["left","top"];
          	options.width = "100%";
          	options.height = jQuery(window).height();
          	options.zIndex = 1000;
        }
    
        var oldD =  document.getElementById('aurora_dialog');
        if(oldD!=null)
            oldD.parentNode.removeChild(oldD);
        var dialog = createDomElement('div', 'aurora_dialog', '', message);
        dialog.title = title;
        document.body.appendChild(dialog);
        window.top.jQuery("#aurora_dialog").dialog(options);
       }
    }
    
    this.dialog = function(title, message, text1, callback1, text2, callback2, fullscreen, dialogOpenCallback){
    var dialog = document.createElement('div');
    dialog.style.cssText = 'position: absolute; top: 33%; left: 33%; right: 33%; width 33%; background-color: #F0F0F0; padding: 5px;' ;
    dialog.innerHTML = message;
    var buttonCont = document.createElement('div');  
    if(callback1!=undefined){
        var button1 = document.createElement('input');
        button1.type = 'submit';
        button1.value = (text1!=undefined)?text1:"Ok";
        button1.onclick = function(){dialog.style.display = 'none';callback1();};
        buttonCont.appendChild(button1);
    }
    if(text1!=undefined&&callback1!=undefined){
        var button2 = document.createElement('input');
        button2.type = 'submit';
        button2.value = text2;
        button2.onclick = function(){dialog.style.display = 'none';callback2();};
        buttonCont.appendChild(button2); 
    }
    dialog.appendChild(buttonCont);
    document.body.appendChild(dialog);
    if(dialogOpenCallback!=undefined)
        dialogOpenCallback();         
    return dialog;
}
}



//aurora_ui.showOnCursor(targetId, text, style, duration);


/* BASE WIDGETS */        
/**
 *  WebpageSettingsWidget
 * @constructor
 */
function WebpageSettingsWidget(instanceId, data){
    this.loader=function(){
        
        var targetPlugin = (data!=undefined&&data.plugin!=undefined)?data.plugin:"aurora";
        var themesR = DATA.getRemote("aurora_theme_list", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW 
        var dataR = DATA.getRemote("aurora_settings", targetPlugin, NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW    
        var dataBI = dataR.behaviour;
        //log("loader");
        var rendererTypedB = F.liftBI(
        function(settingTable, themes){
            //log("lift1");  
            if(settingTable==NOT_READY||themes==NOT_READY)
                return NOT_READY;
            if(settingTable==NO_PERMISSION||themes==NO_PERMISSION)
                return NO_PERMISSION;
            //log("lift2");        
            //var settingTable = clone(settingTable);
            var cellMetaData = [];
            for(rowIndex in settingTable["DATA"]){
              //  log("Loop: "+rowIndex);
                var cellMetaDataRow = [];
                var name = getTableValue(settingTable, rowIndex, "name"); 
                var type = getTableValue(settingTable, rowIndex, "type");
                var description = getTableValue(settingTable, rowIndex, "description");
                var value = getTableValue(settingTable, rowIndex, "value");
                var valueColIndex = getColumnIndex(settingTable, "value");
                                     
                if(CELL_RENDERERS[type]!=undefined){
                    var renderer = new BasicCellRenderer(type, name);   
                    cellMetaDataRow[valueColIndex] = {"renderer": renderer};    
                }
                else if(type=="userDisplay"){
                    var options = [{"display": "Username", value: 1}, {"display": "Firstname", "value": 2}, {"display": "Full Name", "value": 3}];
                    var renderer = new BasicRadioCellRendererContainer(name, options);
                    cellMetaDataRow[valueColIndex] = {"renderer": renderer};  
                }
                else if(type=="themeSelect"){
                    var options = [];
                    for(rowId in themes["DATA"]){
                        var themeId = getTableValue(themes, rowId, "theme_id");
                        var themeName = getTableValue(themes, rowId, "theme_name");
                        options.push({"display": themeName, "value": themeId});
                    }
                    var renderer = new BasicSelectCellRendererContainer(options);
                    cellMetaDataRow[valueColIndex] = {"renderer": renderer};            
                }
                cellMetaData.push(cellMetaDataRow);
            }
            settingTable["CELLMETADATA"] = cellMetaData;
            //log("Lift Return");
            return settingTable;
        },
        function(settingTable, themes){
           // var settingTable = clone(settingTable);
            return [settingTable, undefined];
        },
        dataBI, themesR.behaviour);   
        tableBI = TableWidgetB(instanceId+"_table", data, rendererTypedB);    
        F.insertDomB(tableBI, instanceId+"_container");
    
    }
    this.destroy=function(){
        DATA.deregister("aurora_settings", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
WIDGETS.register("WebpageSettingsWidget", WebpageSettingsWidget); 
/**
 *  GroupsManagerWidget
 * @constructor
 */
function GroupsManagerWidget(instanceId, data){
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW    
        tableB = TableWidgetB(instanceId+"_table", data, dataR.behaviour);    
        F.insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
WIDGETS.register("GroupsManagerWidget", GroupsManagerWidget);
/**
 *  PluginManagerWidget
 * @constructor
 */
function PluginManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_plugins", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        tableB = TableWidgetB(instanceId+"_table", data, dataR.behaviour);    
        F.insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_plugins", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
WIDGETS.register("PluginManagerWidget", PluginManagerWidget);

/**
 *  BehaviourPermissionsWidget
 * @constructor
 */
function BehaviourPermissionsWidget(instanceId, data){      
    this.loader=function(){
    	var groupsR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST);
    	var behavioursR = DATA.getRemote("aurora_permissions", "", NOT_READY, POLL_RATES.VERY_FAST);
        var behaviourPermissionsR = DATA.getRemote("aurora_permissions_set", "", NOT_READY, POLL_RATES.VERY_FAST);  
        
	    var groupsB = groupsR.behaviour;
        var behavioursB = behavioursR.behaviour;
        var newTableB = F.liftBI(function(behaviourPermissions, groups, behaviours){   	
	        if(groups==NOT_READY||behaviours==NOT_READY||behaviourPermissions==NOT_READY)
                return NOT_READY;
            if(groups==NO_PERMISSION||behaviours==NO_PERMISSION||behaviourPermissions==NO_PERMISSION)
                return NO_PERMISSION;
            var columns = [{"reference": "behaviour", "display": "", "type": "string", "visible":true, "readOnly": false}];
            var groupColMap = new Array();
            var count = 1;
            for(groupIndex in groups["DATA"]){
                var groupId = getTableValue(groups, groupIndex, "groupId");
                var groupName = getTableValue(groups, groupIndex, "group");
        	    //var group = groups["DATA"][groupIndex];
        	    columns.push({"reference": groupId, "display": groupName,"visible":true, "readOnly": false});
        	    groupColMap[groupId+""] = count++;
            }
            var data = [];
            var rowMetaData = [];
            var cellMetaData = [];
            var columnMetaData = [];
            columnMetaData[0] = {"permissions": "R"};
            for(behaviourIndex in behaviours["DATA"]){
        	    var behaviour = behaviours["DATA"][behaviourIndex];
        	    var behaviourId = getTableValue(behaviours, behaviourIndex, "permissionRegisterId");
                var permissionRegType = getTableValue(behaviours, behaviourIndex, "type");
                var typeRenderer = new BasicCellRenderer(permissionRegType);
                var behaviourDescription = getTableValue(behaviours, behaviourIndex, "description");
           		var dataRow = [behaviourDescription];
           		var cellMetaDataRow = [];
                for(groupIndex in groups["DATA"]){           
                    cellMetaDataRow[parseInt(groupIndex)+1] = {"renderer": typeRenderer}; 
                }
        	    for(permissionIndex in behaviourPermissions["DATA"]){
        		    var bPermissionsBehaviourId = getTableValue(behaviourPermissions, permissionIndex, "permissionRegisterId");
                    if(behaviourId==bPermissionsBehaviourId){
        			    var bPermission = behaviourPermissions["DATA"][permissionIndex];
				        var bPermissionId = getTableValue(behaviourPermissions, permissionIndex, "permissionId");
           				var bPermissionGroupId = getTableValue(behaviourPermissions, permissionIndex, "groupId");
           				var bPermissionPermission = getTableValue(behaviourPermissions, permissionIndex, "permissions");
        			    var colIndex = groupColMap[bPermissionGroupId+""];
                        //alert(colIndex);
                        if(bPermissionPermission=="true"||bPermissionPermission=="false"){
                            bPermissionPermission = auroraParseBoolean(bPermissionPermission);
                        }
        			    dataRow[colIndex] = bPermissionPermission;
                        if(cellMetaDataRow[colIndex]==undefined){
                            cellMetaDataRow[colIndex] = {"permissionId":bPermissionId};
                        }
                        else{
                        cellMetaDataRow[colIndex]["permissionId"] = bPermissionId;
                        }
                        if(bPermissionGroupId==3&&(bPermissionsBehaviourId==2||bPermissionsBehaviourId==4||bPermissionsBehaviourId==5))
                            cellMetaDataRow[colIndex]["permissions"] = {"canEdit": false};
        		    }
        	    }
        	    cellMetaData.push(cellMetaDataRow);
        	    data.push(dataRow);
        	    rowMetaData.push(behaviourId);
            }
	        var table = {"DATA": data, "COLUMNS": columns, "TABLEMETADATA": {"originalColumns": behaviourPermissions["COLUMNS"], "permissions": {"canAdd": false, "canDelete": false, "canEdit": true}}, "ROWMETADATA": rowMetaData, "CELLMETADATA": cellMetaData, "COLUMNMETADATA": columnMetaData};
            return table;
        },
        function(value){
        	var permissionsData = value["DATA"];
        	var newData = [];
        	for(rowIndex in permissionsData){
        		newRow = [];
        		var row = permissionsData[rowIndex];
        		var behaviourName = row[0];
        		var behaviourId = value["ROWMETADATA"][rowIndex];
        		for(colIndex in value["COLUMNS"]){
        			if(colIndex==0)
        				continue;
        			var dataIndex = parseInt(colIndex)+1;
        			var column = value["COLUMNS"][colIndex];
        			var groupId = column["reference"];
        			var dataCell = row[colIndex];
        			if(dataCell!=undefined){
        			   //log(value["CELLMETADATA"][rowIndex][colIndex]);
                       /* log("RI: "+rowIndex);
                        log("CI: "+colIndex);
                        log("permissionId: "+value["CELLMETADATA"][rowIndex][colIndex]["permissionId"]);
                        log(value["CELLMETADATA"][rowIndex][colIndex]["permissionId"]);
                        for(index in value["CELLMETADATA"][rowIndex][colIndex]){
                            log("Index: "+index);
                        }
                        log("");*/
                        var id=(value["CELLMETADATA"][rowIndex][colIndex]!=undefined&&value["CELLMETADATA"][rowIndex][colIndex]["permissionId"]!=undefined)?value["CELLMETADATA"][rowIndex][colIndex]["permissionId"]:"NULL";
        				///log("ID: "+id+", RI:"+rowIndex+", CI:"+colIndex);
                        newData.push([id, behaviourId, groupId, undefined, dataCell]);
        			}
        		}		
        	}
        	var newTable = {"DATA": newData, "COLUMNS": value["TABLEMETADATA"].originalColumns, "TABLEMETADATA": {"permissions": {"canAdd": false, "canDelete": false, "canEdit": true}}, "ROWMETADATA": [], "CELLMETADATA": [], "COLUMNMETADATA": []};
		return [newTable, undefined,undefined];		
        },
        behaviourPermissionsR.behaviour, groupsB, behavioursB);        
        tableB = TableWidgetB(instanceId+"_table", data, newTableB);    
        F.insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("aurora_groups", "");
        DATA.deregister("aurora_permissions", "");
        DATA.deregister("aurora_permissions_set", "");
        
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
WIDGETS.register("BehaviourPermissionsWidget", BehaviourPermissionsWidget);

/**
 *  AuroraUserGroupColumn
 * @constructor
 */
function AuroraUserGroupColumn(groups){
    this.groups = groups;
    this.getCellRenderer = function(value, cell, width){
	    if(cell==undefined){
		    //alert("caller is " + arguments.callee.caller.toString());
		    return null;
	    }	   
        return new AuroraGroupCellRenderer(groups, value, cell, width);    
    }
}
/**
 *  AuroraGroupCellRenderer
 * @constructor
 */
function AuroraGroupCellRenderer(groups, value, cell, width){
    var select = document.createElement("select");
    var index;
    cell.className="TableWidgetCell";
    for(index in groups){
                var group = groups[index];
                var option=document.createElement("OPTION");
                option.appendChild(document.createTextNode(group[1]));
                option.value = group[0];
                select.appendChild(option);       
            }
            select.value = value;     
    this.render = function(){
        select.disabled = true;
        cell.removeChildren();
        cell.appendChild(select);    
    }
    this.renderEditor = function(){
        select.disabled = false;  
        cell.removeChildren();
        cell.appendChild(select);
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }
        else
            cell.className="TableWidgetCell"; 
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
    this.getUpdateEvent = function(){;
        return F.extractValueE(select);
    }
}             
/**
 *  UsersManagerWidget
 * @constructor
 */                                               
function UsersManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("aurora_users", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        var groupsR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST); //, NOT_READY, POLL_RATES.SLOW
        var renderedTableB = F.liftBI(function(data, groups){
            if(data==NOT_READY||groups==NOT_READY)
                return NOT_READY;
            for(colIndex in data["COLUMNS"]){
                if(data["COLUMNS"][colIndex]["reference"]=="group"){
                    if(data["COLUMNMETADATA"][colIndex]==undefined)
                        data["COLUMNMETADATA"][colIndex] = {};
                    data["COLUMNMETADATA"][colIndex]["renderer"] = new AuroraUserGroupColumn(groups["DATA"]);
                }
            
            }
            //showObj(data);
            return data;
        },function(value){
            return [value, null];
        }, dataR.behaviour, groupsR.behaviour);
    
    tableB = TableWidgetB(instanceId+"_table", data, renderedTableB);    
    F.insertDomB(tableB, instanceId+"_container");
    
    }
    this.destroy=function(){
        DATA.deregister("aurora_users", "");
        DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}     
function auroraBaseFindCustomRendererForCol(renderers, colIndex){
    for(var index in renderers){
        if(renderers[index].columnIndex==colIndex)
            return renderers[index];
    }
    return undefined;
}          
WIDGETS.register("UsersManagerWidget", UsersManagerWidget);     

/**
 *  HTMLSelectWidget
 * @constructor
 */ 
function HTMLSelectWidget(instanceId, userData){
    /*var width = (data.placeholder!=undefined&&data.placeholder.style.width!=undefined)?data.placeholder.style.width:undefined;
    var height = (data.placeholder!=undefined&&data.placeholder.style.height!=undefined)?data.placeholder.style.height:undefined;
    */
    var id = instanceId+"_container";
    var container = createDomElement("div", id);
    container.className = "HTMLSelectWidget";
    container.style.overflow = 'auto';
    this.rowSelectionsB = undefined;
    this.loader=function(){
        var dataB = userData['dataB'];
        var htmlDataB = dataB.liftB(function(data){
            var cont = document.createElement("div");
            for(index in data){
                var optionValue = data[index].value;
                var optionHTML = data[index].display;
                var optionElement = createDomElement("div",undefined, "HTMLSelectWidgetOption",optionHTML);
                optionElement.id = "HTMLSelectWidgetOption_"+index;
                //cont.appendChild(optionElement);
                container.appendChild(optionElement);
            }
            return container;
        });
        F.insertDomB(htmlDataB, id);
       var optionClickedE = jQuery(container).fj('extEvtE', 'click').mapE(function(ev){
            var target = (ev.target==undefined)?ev.srcElement:ev.target;
            while(target.parentNode!=undefined){
                if(target.className=="HTMLSelectWidgetOption"||target.className=="HTMLSelectWidgetOptionSelected"){
                    var clicked = parseInt(target.id.replace("HTMLSelectWidgetOption_", ""));
                    return clicked;
                }
                target = target.parentNode; 
            }
       });
       
       
       var rowSelectionsE = optionClickedE.collectE([],function(newElement,arr) {
        if(newElement==NOT_READY)
            return []; 
           // log("Col");
           var clickedIndex = newElement;
            if(arr.length==1&&arrayContains(arr, clickedIndex)){
                arr = [];
            }
            else{
                arr = [clickedIndex];
            }
        return arr;
        });
        this.selected = F.liftB(function(optionData, rowSelections){
            if(optionData==NOT_READY||rowSelections==NOT_READY)
                return NOT_READY;
            for(index in optionData){
                document.getElementById("HTMLSelectWidgetOption_"+index).className = "HTMLSelectWidgetOption";    
            }
            if(rowSelections.length==1){
                var selectedIndex = rowSelections[0];
                document.getElementById("HTMLSelectWidgetOption_"+selectedIndex).className = "HTMLSelectWidgetOptionSelected";
                return optionData[selectedIndex].value;
            }
            return NOT_READY;
        }, dataB, rowSelectionsE.startsWith(NOT_READY));
    }
    this.destroy=function(){

    }
    this.build=function(){
        return "<div id=\""+id+"\">&nbsp;</div>";
    }
    this['selectedValue'] = function(){return this.selected.valueNow()};
}
WIDGETS.register("HTMLSelectWidget", HTMLSelectWidget);  

/**
 *  StringBuilderEx
 * @constructor
 */
StringBuilderEx = function(){
    this._buffer = new Array();
}

    StringBuilderEx.prototype =
    {
    // This method appends the string into an array 
        append : function(text)
        {
            this._buffer[this._buffer.length] = text;
        },
        
    // This method does concatenation using JavaScript built-in function
        toString : function()
        {
            return this._buffer.join("");
        }
    }; 
    
/**
 *  FirstNameWidget
 * @constructor
 */ 
function FirstNameWidget(instanceId, data){
    this.loader=function(){}
    this.destroy=function(){}
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">"+window['SETTINGS']['user']['firstname']+"</span>"; 
    }                         
} 
/**
 *  FirstNameWidgetConfigurator
 * @constructor
 */ 
function FirstNameWidgetConfigurator(){
    this['load'] = function(newData){}
    this['build'] = function(newData){}
    this['getData'] = function(){}
    this['getName'] = function(){
        return "First Name Widget";
    }
    this['getDescription'] = function(){
        return "Text showing the current users first name";
    }
    this['getPackage'] = function(){
        return "Users";
    }
} 
WIDGETS.register("FirstNameWidget", FirstNameWidget, FirstNameWidgetConfigurator); 

/**
 *  FullNameWidget
 * @constructor
 */ 
function FullNameWidget(instanceId, data){
    this.loader=function(){}
    this.destroy=function(){}
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">"+window['SETTINGS']['user']['firstname']+" "+window['SETTINGS']['user']['lastname']+"</span>"; 
    }                         
}   
/**
 *  FullNameWidgetConfigurator
 * @constructor
 */ 
function FullNameWidgetConfigurator(){
    this['load'] = function(newData){}
    this['build'] = function(newData){}
    this['getData'] = function(){}
    this['getName'] = function(){
        return "Last Name Widget";
    }
    this['getDescription'] = function(){
        return "Text showing the current users last name";
    }
    this['getPackage'] = function(){
        return "Users";
    }
} 
WIDGETS.register("FullNameWidget", FullNameWidget, FullNameWidgetConfigurator); 

/**
 *  UsernameWidget
 * @constructor
 */ 
function UsernameWidget(instanceId, data){
    this.loader=function(){}
    this.destroy=function(){}
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">"+window['SETTINGS']['user']['username']+"</span>"; 
    }                         
}

/**
 *  UsernameWidgetConfigurator
 * @constructor
 */                                                      
function UsernameWidgetConfigurator(){
    this['load'] = function(newData){}
    this['build'] = function(newData){}
    this['getData'] = function(){}
    this['getName'] = function(){
        return "User Name Widget";
    }
    this['getDescription'] = function(){
        return "Text showing the current users user name";
    }
    this['getPackage'] = function(){
        return "Users";
    }
    this['getImage'] = function(){}
} 
WIDGETS.register("UsernameWidget", UsernameWidget, UsernameWidgetConfigurator); 
//HASHffff


/**
 *  LoggedInImageWidget
 * @constructor
 */ 
function LoggedInImageWidget(instanceId, data){
    var href = (window['SETTINGS']['user']['groupid']==1)?data.outURL:data.inURL;
    var src = (window['SETTINGS']['user']['groupid']==1)?data.outSRC:data.inSRC;
    this.loader=function(){
        /*setTimeout(function(){
            document.getElementById(instanceId+"_anchor").setAttribute('href',href);
            document.getElementById(instanceId+"_img").setAttribute('onclick',function(){window.location('/logout');});
            document.getElementById(instanceId+"_img").setAttribute('style',"cursor: pointer;");
        }, 1000);  */
    }
    this.destroy=function(){}
    
    this.build=function(){
        return "<a id=\""+instanceId+"_anchor\" href=\""+href+"\"><img id=\""+instanceId+"_img\" src=\""+src+"\" alt=\"\" /></a>";
    }                         
}
WIDGETS.register("LoggedInImageWidget", LoggedInImageWidget);

/**
 *  LoggedInImageMenuWidget
 * @constructor
 */ 
function LoggedInImageMenuWidget(instanceId, data){
    this.loader=function(){                
        var li = document.createElement('li');
        if(data.targetGroupId==undefined){
            var src = (window['SETTINGS']['user']['groupid']!=1)?data.inSRC:data.outSRC;
            var url = (window['SETTINGS']['user']['groupid']!=1)?data.inURL:data.outURL;    
        } 
        else{                
            var targetGroupId = data.targetGroupId;             
            var src = (window['SETTINGS']['user']['groupid']==targetGroupId)?data.inSRC:data.outSRC;
            var url = (window['SETTINGS']['user']['groupid']==targetGroupId)?data.inURL:data.outURL;
        }
        li.innerHTML = "<a id=\""+instanceId+"_anchor\" href=\""+url+"\"><img id=\""+instanceId+"_img\" src=\""+src+"\" alt=\"\" /></a>";           
        jQuery(li).prependTo(jQuery("#"+data.target));
    }
    this.destroy=function(){}
    
    this.build=function(){}                         
}
WIDGETS.register("LoggedInImageMenuWidget", LoggedInImageMenuWidget);



/**
 *  UserGroupDivHiderWidget
 * @constructor                         
 */ 
function UserGroupDivHiderWidget(instanceId, data){

    
    this.loader=function(){
        var targetDiv = DOM.get(data.target);
        var visibleGroups = data.visibleGroups;
        userB.liftB(function(user){
            if(!good())
                return NOT_READY;
            if(arrayContains(visibleGroups, parseInt(user.group_id))){
                jQuery(targetDiv).fadeIn(300);
                   
            }
            else{
                jQuery(targetDiv).fadeOut(300);  
            }
        });                                   
    }
    this.destroy=function(){}
    
    this.build=function(){
        return "";
    }                         
}
WIDGETS.register("UserGroupDivHiderWidget", UserGroupDivHiderWidget);



/**
 *  FileSizeRenderer
 * @constructor
 */
function FileSizeRenderer(value, cell, width){
    var container = DOM.createDiv();
    cell.appendChild(container);
    
    this.render = function(){
    }
    this.renderEditor = function(){        
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }                                  
        else{
            cell.className="TableWidgetCell"; 
        }
    }
    this.getValue = function(){
        return value; //force readonly for now.
        var val = container.innerHTML;
        if(val.length==0){
            val = -1;
        }
        else{
            val = parseInt(val);
        }
        return val;
    }
    this.setValue = function(newValue){
        if(newValue<0||newValue==""){
            newValue = "";
        }
        else if(newValue>1000000000000000){
            newValue = ((newValue/1000000000000000).toFixed(2))+" PB";
        }
        else if(newValue>1000000000000){
            newValue = ((newValue/1000000000000).toFixed(2))+" TB";
        }
        else if(newValue>1000000000){
            newValue = ((newValue/1000000000).toFixed(2))+" GB";
        }
        else if(newValue>1000000){
            newValue = ((newValue/1000000).toFixed(2))+" MB";
        }
        else if(newValue>1000){
            newValue = ((newValue/1000).toFixed(2))+" KB";
        }
        else{
            newValue = newValue+" B";
        }
        container.innerHTML = newValue;
    }
    this.getUpdateEvent = function(){
        return F.zeroE();
    }
    this.setValue(value);
}

/**
 *  FileSizeRendererColumn
 * @constructor
 */
function FileSizeRendererColumn(){
    this.getCellRenderer = function(value, cell, width){
        if(cell==undefined){
            return null;
        }       
        return new FileSizeRenderer(value, cell, width);    
    }
}






/**
 *  FileTypeRenderer
 * @constructor
 */
function FileTypeRenderer(value, cell, width){
    var img = DOM.createImg(undefined, undefined, window["SETTINGS"]["scriptPath"]+"resources/trans.png");
    cell.appendChild(img);
    cell.style.textAlign="center";
    this.render = function(){
    }
    this.renderEditor = function(){        
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
        }                                  
        else{
            cell.className="TableWidgetCell"; 
        }
    }
    this.getValue = function(){
        return value;
    }
    this.setValue = function(val){
        var src="";
        if(val==undefined){
        }
        else if(val=="directory"){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/directory.png";
        }
        else if(val.contains("image")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/image.png";
        }
        else if(val.contains("video")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/video.png";
        }
        else if(val.contains("audio")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/music.png";
        }
        else if(val.contains("text")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/document.png";
        }
        else if(val.contains("torrent")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/torrent.png";
        }
        else if(val.contains("zip")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/zip.png";
        }
        else if(val.contains("g-zip")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/gzip.png";
        }
        else if(val.contains("excel")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/excel.png";
        }
        else if(val.contains("word")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/word.png";
        }
        else if(val.contains("font")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/font.png";
        }
        else if(val.contains("pdf")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/pdf.png";
        }
        else if(val.contains("kml")){                
            src=window["SETTINGS"]["theme"]["path"]+"tables/kml.png";
        }
        if(src!=""){
            img.src = src;
        }
    }
    this.getUpdateEvent = function(){
        return F.zeroE();
    }
    this.setValue(value);
}
/**
 *  FileTypeRendererColumn
 * @constructor
 */
function FileTypeRendererColumn(){
    this.getCellRenderer = function(value, cell, width){
        if(cell==undefined){
            return null;
        }       
        return new FileTypeRenderer(value, cell, width);    
    }
}
function good(){
    var args = arguments.callee.caller.arguments;
    for(index in args){
        if(args[index]==NOT_READY)
            return false;
    }
    return true;
}
function liftBArray(f, argsF){
    argsF.unshift(f);
    var behaviour = F.liftB.apply(argsF[0], argsF);
    return behaviour;
}
function funcCallArray(f, argsF){
    var behaviour = f.apply(this, argsF);
} 
function jFadeInE(triggerE, elementId, time){
    var rec = receiverE();
    triggerE.mapE(function(event){
        jQuery(document.getElementById(elementId)).fadeIn(time, function(){rec.sendEvent(event);});
    });
    return rec;
}

function FileReaderLoadedE(fr){
    var rec = receiverE();
    fr.onload = function(event){
        rec.sendEvent(event);    
    }
    return rec;
}
function fileDragDropE(element){
    var rec = receiverE();
    element.addEventListener('drop', function(event){
            event.stopPropagation();  
            event.preventDefault();
            rec.sendEvent(event);
            //handleDragAndDrogUpload(event);
    }, false);
    return rec;
    //return extractEventE(element, 'drop');    
}
function fileDropEnterE(element){
    var rec = receiverE();
    element.addEventListener('dragenter', function(event){
            event.stopPropagation();  
            event.preventDefault();
            rec.sendEvent(event);
            //handleDragAndDrogUpload(event);
    }, false);
    return rec;    
}
function fileDragOverE(element){
    var rec = receiverE();
    element.addEventListener('dragover', function(event){
            event.stopPropagation();  
            event.preventDefault();
            rec.sendEvent(event);
            //handleDragAndDrogUpload(event);
    }, false);
    return rec;    
}
function getAjaxRequestE(triggerE, url, timeout){
    timeout = (timeout==undefined)?15000:timeout;
    var rec = F.receiverE();      
                       
    triggerE.mapE(function(requestData){
        
        jQuery.ajax({
            type: "post",
            data: requestData,
            dataType: 'json',
            url: url,
            timeout: timeout,
            success: function(data){
                rec.sendEvent(data);
            },
            error: function(data){/*rec.sendEvent(data);*/}
        });
    });                                          
    return rec;
}
function getAjaxRequestB(triggerB, url){
    var rec = F.receiverE();                     
    triggerB.liftB(function(requestData){
        if(requestData!=NOT_READY){                                 
        jQuery.ajax({
            type: "post",
            data: requestData,
            dataType: 'json',
            url: url.replace("<VAL>", requestData),
            success: function(data){
                rec.sendEvent(data);
            },
            error: function(data){rec.sendEvent(data);}
        });
        }
    });                                          
    return rec;
}
function FileReaderReadyE(fr){
    var rec = receiverE();
    fr.onload = function(event){
        rec.sendEvent(event.target.result);
    }
    return rec;
}     
function getAjaxFileRequest(triggerE, url, contentType){
    var rec = F.receiverE();
    triggerE.mapE(function(builder){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-Type', contentType);
        //xhr.send(builder);
        xhr.sendAsBinary(builder);        
        xhr.onload = function(event) { 
            if (xhr.responseText)
                rec.sendEvent(JSON.parse(xhr.responseText));
        };
    });
    return rec;
}

function AuroraTaskQueue(dequeueEventE){ 
    return new AuroraTaskQueueStack(dequeueEventE, "queue");
}
function AuroraTaskStack(dequeueEventE){ 
    return new AuroraTaskQueueStack(dequeueEventE, "stack");
}
function AuroraTaskQueueStack(dequeueEventE, type){
    var taskqueustack = this;
    var collectionType = (type==undefined)?"stack":"queue";
    this.enqueueE = F.receiverE();
   
   this.dequeueEventE = dequeueEventE;
   this.push = function(val){
    this.enqueueE.sendEvent(val); 
   };
   this.enqueue = function(val){
    this.enqueueE.sendEvent(val);
   };
  
  
   var dequeueEventE = F.receiverE();
   this.dequeueEventE = dequeueEventE;
   var finishedE = F.receiverE();
   this.finishedE = finishedE.filterE(function(val){return val;});
   var finishedB = finishedE.filterRepeatsE().startsWith(true);
   var startQueueE = F.receiverE();
   
   this.jobQueueE = F.mergeE(this.enqueueE, this.finishedE.mapE(function(finished){return NOT_READY;})).collectE([],function(newVal,arr) {
        if(newVal==NOT_READY){
            return [];
        }
        arr.push(newVal);
        return arr;
   });
   
   var queueE = F.mergeE(this.enqueueE).collectE([],function(newVal,arr) {
        arr.push(newVal);
        return arr;
   });
   this.queueB = queueE.startsWith([]);
    this.kickstartE = F.liftB(function(queue, finished){
        if(!good()){
            return NOT_READY;
        }
        return {queue: queue, finished: finished};
    }, this.queueB, finishedB).changes().filterE(function(queueAndFinished){
        return queueAndFinished!=NOT_READY && (queueAndFinished.finished && queueAndFinished.queue.length>0);
    }).mapE(function(queueAndFinished){
        finishedE.sendEvent(false);
        startQueueE.sendEvent(true);     
    }); 
    
    var loopedQueueE = startQueueE.snapshotE(this.queueB);
    var emptyQueueE = loopedQueueE.filterE(function(queue){return queue!=NOT_READY&&queue.length==0;});
    var notEmptyQueueE = loopedQueueE.filterE(function(queue){return queue!=NOT_READY&&queue.length!=0;});
    emptyQueueE.mapE(function(){
        finishedE.sendEvent(true);
    });
    notEmptyQueueE.mapE(function(queue){
        var val = (collectionType=="stack")?queue.pop():queue.shift();
        dequeueEventE.sendEvent(val);
    });
    this.next = function(){
         startQueueE.sendEvent(true);      
    };                   
}




F.EventStream.prototype.ajaxRequestE = function(){
    return this.mapE(function(request){
    	var timeout = (request.timeout==undefined)?15000:request.timeout;
    	var dataType = (request.dataType==undefined)?'text':request.dataType;
    	var rec = F.receiverE(); 
        jQuery.ajax({				
            type: request.type,
            data: request.data,
            dataType: dataType,
            url: request.url,
            timeout: timeout,
            success: function(data){
            	rec.sendEvent(data);
            },
            error: function(data){log("getAjaxRequestE ERROR on URL: "+request.url);}
        });
        return rec;
    }).switchE();                                          
}
F.EventStream.prototype.ajaxRequestB = function(){
    return this.startsWith(NOT_READY).ajaxRequestB();                                          
}
F.Behavior.prototype.ajaxRequestB = function(){
    return this.liftB(function(request){
    	if(!good()){
    		 return NOT_READY;
    	}
    	var timeout = (request.timeout==undefined)?15000:request.timeout;
    	var dataType = (request.dataType==undefined)?'text':request.dataType;
    	var rec = F.receiverE(); 
        jQuery.ajax({				
            type: request.type,
            data: request.data,
            dataType: dataType,
            url: request.url,
            timeout: timeout,
            success: function(data){
            	rec.sendEvent(data);
            },
            error: function(data){log("getAjaxRequestB ERROR on URL: "+request.url);}
        });
        return rec.startsWith(NOT_READY);
    }).switchB();                                          
}
F.Behavior.prototype.ajaxRequestE = function(){
    return this.changes().ajaxRequestE();                                          
}

F.EventStream.prototype.cancelDOMBubbleE = function(){
	return this.mapE(function(event){DOM.stopEvent(event);return event;});
}

function showObj(obj){
    alert(ObjectToString(obj));
}
function ObjectToString(object){
    var output = '';
for (property in object) {
  output += property + ': ' + object[property]+'; ';
}                                                   
return output;
}
function countProperties(object){
    var count = 0;
for (property in object) {
  count++;
}
return count;
}
function printHashTable(table){
 var loadWidgets = table.values();
    for(i=0;i<table.size();i++){
        alert(ObjectToString(loadWidgets[i]));
    }
}

window['log'] = function(message){
    if (window.console)
        console.log(message);
}

/*function BehaviourTree(instanceId,data){
    var domId=instanceId+"_tree";
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    this.loader=function(){
        log("Behaviour Tree loaded");
        timerB(1000).liftB(function(){
            var container = document.getElementById(domId);
            var domDiv = document.createElement("div");
            for(index in DATA.localData){
                var behaviour = DATA.localData[index];
                var value = behaviour["_"].last;
                if(value==undefined||value==NOT_READY)
                    value = "NOT READY";
                var display = index+": "+value;
                domDiv.appendChild(createDomElement("div", "", "", display));
            }  
            removeChildren(container);
            container.appendChild(domDiv);
        });
    }
    this.destroy=function(){}
    this.build=function(){
        return "<div class=\"behaviourTree\" style=\"width:"+width+"px; height: "+height+"px\"><div id=\""+domId+"\"></div></div>";
    }
}
widgetTypes['BehaviourTree']=BehaviourTree;


function BehaviourTest(instanceId,data){
    var domId=instanceId+"_tree";
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    this.loader=function(){
       var t1B = timerB(500);
       var t2B = timerB(350);
       
       var mergeB = F.liftB(function(t1, t2){
        return t1+"<>"+t2;
       }, t1B, t2B);
       DATA.register("timer1", "", t1B);
       DATA.register("timer2", "", t2B);
       DATA.register("merge", "", mergeB);
       F.insertDomB(mergeB, domId);
    }
    this.destroy=function(){}
    this.build=function(){
        return "<div class=\"BehaviourTest\" style=\"width:"+width+"px; height: "+height+"px\"><div id=\""+domId+"\"></div></div>";
    }
}
widgetTypes['BehaviourTest']=BehaviourTest;*/
function parseMysqlDate(mysql_string){ 
   if(typeof mysql_string === 'string')
   {
      var t = mysql_string.split(/[- :]/);
      return new Date(t[0], t[1] - 1, t[2], t[3] || 0, t[4] || 0, t[5] || 0);          
   }
   return null;   
}
function createButton(value, className){
    var button = createDomElement("input", undefined,"button");
    button.type = "submit";
    button.value = value;
    if(className!=undefined)
        button.className = className;
    return button;
}
String.prototype['contains'] = function(str){
    return (this.indexOf(str) >= 0);
}
getElementsByClassName = function(class_name, tag, elm) {
    doc = elm || this;
    var docList = doc.all || doc.getElementsByTagName('*');
    var matchArray = new Array();

    /*Create a regular expression object for class*/
    var re = new RegExp("(?:^|\\s)"+class_name+"(?:\\s|$)");
    for (var i = 0; i < docList.length; i++) {
        //showObj(docList[i]);
        if (re.test(docList[i].className) ) {
            matchArray[matchArray.length] = docList[i];
        }
    }
    return matchArray;
}
Element.prototype.removeChildren = function(element){
    if(element==undefined)
        element = this;
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
}
function getMilliseconds(){
var d = new Date();
return d.getTime(); 
} 
function createDomElement(type, id, className, innerHTML){
    var ele = document.createElement(type);
    if(id!=undefined&&id.length>0)
    ele.id = id;
    if(className!=undefined&&className.length>0)
    ele.className = className; 
    if(innerHTML!=undefined&&innerHTML.length>0)
    ele.innerHTML = innerHTML;
    return ele; 
}
function createIcon(src){
    var saveButton = document.createElement("img");
    saveButton.src=src;
    saveButton.style.cursor="pointer";
    return saveButton;
}
function findParentNodeWithTag(element, tag){
    if(element==undefined||element==null)
        return undefined; 
    else if(element.tagName.toUpperCase() == tag.toUpperCase())
        return element;
    return findParentNodeWithTag(element.parentNode, tag);    
}
function findTableRowIndex(table, row){
    for(i=0; i<table.rows.length; i++){
        if(table.rows[i]==row)
            return i;
    }
    return -1;
}

function stopEventBubble(event){
    agent = jQuery.browser;
    if(agent.msie) {
        event.cancelBubble = true;
    } else {
        event.stopPropagation();
    }
}

/* BASE WIDGETS */        
/**
 *  WebpageSettingsWidget
 * @constructor
 */
function VideoPlayerWidget(instanceId, data){
    var width = (data.placeholder!=undefined&&data.placeholder.style.width!=undefined)?data.placeholder.style.width:undefined;
    var height = (data.placeholder!=undefined&&data.placeholder.style.height!=undefined)?data.placeholder.style.height:undefined;
    var poster = (data.poster!=undefined&&data.poster!="")?"&poster="+data.poster+"":"";
    var poster2 = (data.poster!=undefined&&data.poster!="")?"<img alt=\"happyfit2\" src=\""+data.poster+"\" style=\"position:absolute;left:0;\" width=\""+width+"\" height=\""+height+"\" title=\"Video playback is not supported by your browser\" />":"";
    var poster3 = (data.poster!=undefined&&data.poster!="")?" poster=\""+data.poster+"\"":"";
    var sources = data.sources;
    var flashPlayer = "/plugins/aurora.media/flashfox.swf";
    this.loader=function(){
         var sourcesStr = "";
        var mp4 = "";
        var autoplay = (data.autoplay==true||data.autoplay=="true")?true:false;
        for(index in sources){
            var type = sources[index]['type'];
            //window['SETTINGS']['scriptPath']
            if(sources[index]['type']=="video/mp4")
                mp4 = sources[index]['src']; 
            sourcesStr += "<source src=\""+sources[index]['src']+"\" type='"+type+"' />";
        }
        var flashPart = "";
        if(mp4!=""){
            flashPart = "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" type=\"application/x-shockwave-flash\" data=\""+flashPlayer+"\" width=\"604\" height=\"256\" style=\"position:relative;\">"+
                                "<param name=\"movie\" value=\""+flashPlayer+"\" />"+
                                "<param name=\"allowFullScreen\" value=\"true\" />"+
                                "<param name=\"flashVars\" value=\"autoplay="+autoplay+"&amp;controls=true&amp;loop=true&amp;src="+mp4+"\" />"+
                                "<embed src=\""+flashPlayer+"\" width=\"604\" height=\"256\" flashVars=\"src="+mp4+"&amp;autoplay="+autoplay+"&amp;controls=true&amp;loop=true"+poster+"\"    allowFullScreen=\"true\" wmode=\"transparent\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.adobe.com/go/getflashplayer_en\" />"+
                                poster2+
                                "</object>";
        }
        document.getElementById("video").innerHTML = "<video controls=\"controls\" "+(autoplay?" autoplay=\"autoplay\"":"")+"\""+poster3+" width=\""+width+"\" height=\""+height+"\" onclick=\"if(/Android/.test(navigator.userAgent))this.play();\">"+sourcesStr+flashPart+"</video>"; 
    }
    this.destroy=function(){
        DATA.deregister("aurora_settings", "");
    }
    this.build=function(){     
        return "<div id=\"video\"></div>";
    }
}   

function VideoPlayerWidgetConfigurator(){
    var id = "VideoWidgetCont";
    this['load'] = function(newData){}
    this['build'] = function(newData){
        var poster = (newData!=undefined&&newData['poster']!=undefined)?newData['poster']:"";
        var autoplay = (newData!=undefined&&newData['autoplay']!=undefined)?newData['autoplay']:"false";
        var returnString = "";
        var src1 = "";
        var type1="";
        var src2 = "";
        var type2="";
        var src3 = "";
        var type3="";
        if(newData!=undefined&&newData['sources'].length>0){
            src1 = (newData!=undefined&&newData['sources'][0]['src']!=undefined)?newData['sources'][0]['src']:"";
            type1 = (newData!=undefined&&newData['sources'][0]['type']!=undefined)?newData['sources'][0]['type']:""; 
             
        }
        returnString+="SRC: <input type=\"text\" id=\""+id+"_src1\" value=\""+src1+"\" /><br />Type<input type=\"text\" id=\""+id+"_type1\" value=\""+type1+"\" /><br />";
        if(newData!=undefined&&newData['sources'].length>1){
            src2 = (newData!=undefined&&newData['sources'][1]['src']!=undefined)?newData['sources'][1]['src']:"";
            type2 = (newData!=undefined&&newData['sources'][1]['type']!=undefined)?newData['sources'][1]['type']:""; 
             
        }
        returnString+="SRC: <input type=\"text\" id=\""+id+"_src2\" value=\""+src2+"\" /><br />Type<input type=\"text\" id=\""+id+"_type2\" value=\""+type2+"\" /><br />";
        if(newData!=undefined&&newData['sources'].length>2){
            src3 = (newData!=undefined&&newData['sources'][2]['src']!=undefined)?newData['sources'][2]['src']:"";
            type3 = (newData!=undefined&&newData['sources'][2]['type']!=undefined)?newData['sources'][2]['type']:""; 
             
        }
        returnString+="SRC: <input type=\"text\" id=\""+id+"_src3\" value=\""+src3+"\" /><br />Type<input type=\"text\" id=\""+id+"_type3\" value=\""+type3+"\" /><br />";
        return returnString+"Poster: <input type=\"text\" id=\""+id+"_poster\" value=\""+poster+"\" /><br />Autoplay: <input type=\"checkbox\" id=\""+id+"_autoplay\"  "+((autoplay)?" checked=\"true\"":"")+" />"; 
    }
    this['getData'] = function(){
        var sources = [];
        var src1 = document.getElementById(id+"_src1");
        var type1 = document.getElementById(id+"_type1");
        var src2 = document.getElementById(id+"_src2");
        var type2 = document.getElementById(id+"_type2");
        var src3 = document.getElementById(id+"_src3");
        var type3 = document.getElementById(id+"_type3");
        if(src1.value.length>0){
            var type1Value = (type1.value.length==0)?auroraMediaVideoSrcToType(src1):type1.value;
            sources.push({"src": src1.value, "type": type1Value});
        }
        if(src2.value.length>0){
            var type2Value = (type2.value.length==0)?auroraMediaVideoSrcToType(src2):type2.value; 
            sources.push({"src": src2.value, "type": type2Value});
        }
        if(src3.value.length>0){
            var type3Value = (type3.value.length==0)?auroraMediaVideoSrcToType(src3):type3.value; 
            sources.push({"src": src3.value, "type": type3Value});
        }
        return {"poster": document.getElementById(id+"_poster").value, "autoplay": document.getElementById(id+"_autoplay").checked, "sources": sources};
    }
    this['getName'] = function(){
        return "Video Player Widget";
    }
    this['getDescription'] = function(){
        return "An mp4 player";
    }
    this['getPackage'] = function(){
        return "Audio/Video";
    }
} 
WIDGETS.register("VideoPlayerWidget", VideoPlayerWidget, VideoPlayerWidgetConfigurator); 
function BuildProductWidgetHTML(id, title, description, price, text){
    var text = (text==undefined)?"Add To Cart":text;
    return "<div id=\""+id+"\" class=\"ProductWidget\"><img id=\""+id+"_image\" src=\"resources/aurora.products/"+id+".png\" alt=\"\" class=\"ProductWidgetImg\" /><h2>"+title+"</h2>"+description+"<div style=\"clear:both;\" class=\"ProductWidgetPrice\"><form style=\"float: right;\" target=\"paypal\" action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\"><input id=\""+id+"_submit\" type=\"image\" src=\"/plugins/aurora.products/addtocart.png\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\"><input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\"><input type=\"hidden\" name=\"hosted_button_id\" value=\""+id+"\"></form>$"+price+"</div></div>";
//<input id=\""+id+"_submit\" type=\"submit\" src=\"/border=\"0\" name=\"submit\" value=\""+text+"\" alt=\"PayPal - The safer, easier way to pay online!\">    
//<input id=\""+id+"_submit\" type=\"image\" src=\"/plugins/aurora.products/addtocart.png\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">    
 /*<img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\"> */   
    
}
/**
 *  ProductWidget
 * @constructor
 */ 
function ProductWidget(instanceId, data){
    var id = instanceId+"_container";
    var title = data.title;
    var description = data.description;
    var price = data.price;
    var productId = data.productId;
    this.loader=function(){
        //jQuery("#"+productId+"_submit").button();
        var img = document.getElementById(productId+"_image");
        if(!img.complete){
            img.src = "/resources/trans.png";
        }
    }
    this.destroy=function(){}
    this.build=function(){
        return BuildProductWidgetHTML(productId, title, description, price);
    }                         
}
                     
/**
 *  UsernameWidgetConfigurator
 * @constructor
 */                                                      
function ProductWidgetConfigurator(){
	this['load'] = function(newData){}
    var id = "ProductWidgetConfigurator";
    this['build'] = function(newData){
        var productId = "";
        var title = ""; 
        var description = ""; 
        var price = "";
        if(newData!=undefined){
            productId = newData['productId'];
            title = newData['title']; 
            description = newData['description']; 
            price = newData['price']; 
        }
        return "Product Id: <input type=\"text\" id=\""+id+"_id\" value=\""+productId+"\" /><br />"+
        "Title: <input type=\"text\" id=\""+id+"_title\" value=\""+title+"\" /><br />"+
        "Description: <input type=\"text\" id=\""+id+"_description\" value=\""+description+"\" /><br />"+
        "Price: <input type=\"text\" id=\""+id+"_price\" value=\""+price+"\" />";
    }
    this['getData'] = function(){
        return {"productId": document.getElementById(id+'_id').value, "title": document.getElementById(id+'_title').value, "description": document.getElementById(id+'_description').value, "price": document.getElementById(id+'_price').value};
    }
    this['getName'] = function(){
        return "Product Widget";
    }
    this['getDescription'] = function(){
        return "A product item with an add to cart button";
    }
    this['getPackage'] = function(){
        return "Products";
    }
} 
WIDGETS.register("ProductWidget", ProductWidget, ProductWidgetConfigurator); 



/**
 *  ProductWidget
 * @constructor
 */ 
function ViewCartWidget(instanceId, data){
    var id = instanceId+"_container";
    
    var identifier = (data.code!=undefined)?"<input type=\"hidden\" name=\"encrypted\" value=\""+data.code+"\">":"<input type=\"hidden\" name=\"business\" value=\""+data.business+"\">"
    this.loader=function(){}
    this.destroy=function(){}
    this.build=function(){           //<input type=\"hidden\" name=\"encrypted\" value=\""+code+"\">
        return "<form target=\"paypal\" action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\">"+identifier+"<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\"><input class=\"viewCart\" type=\"image\" src=\"/plugins/aurora.products/cart.png\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\"></form>";
    }                         
}

/*<form target="_self" action="https://www.paypal.com/cgi-bin/webscr"  
        method="post">  
  
    <!-- Identify your business so that you can collect the payments. -->  
    <input type="hidden" name="business" value="kin@kinskards.com">  
  
    <!-- Specify a PayPal Shopping Cart View Cart button. -->  
    <input type="hidden" name="cmd" value="_cart">  
    <input type="hidden" name="display" value="1">  
  
    <!-- Display the View Cart button. -->  
    <input type="image" name="submit" border="0"  
        src="https://www.paypal.com/en_US/i/btn/btn_viewcart_LG.gif"   
        alt="PayPal - The safer, easier way to pay online">  
    <img alt="" border="0" width="1" height="1"  
        src="https://www.paypal.com/en_US/i/scr/pixel.gif" >  
</form> */

                     
/**
 *  UsernameWidgetConfigurator
 * @constructor
 */                                                      
function ViewCartWidgetConfigurator(){
	this['load'] = function(newData){}
    var id = "ViewCartWidgetConfigurator";
    this['build'] = function(newData){
        var code = "";
        if(newData!=undefined){
            code = newData['code'];
        }
        return "Product Id: <input type=\"text\" id=\""+id+"_code\" value=\""+code+"\" />";
    }
    this['getData'] = function(){
        return {"code": document.getElementById(id+'_code').value};
    }
    this['getName'] = function(){
        return "Product View Cart Button";
    }
    this['getDescription'] = function(){
        return "A button that takes you to your shopping cart";
    }
    this['getPackage'] = function(){
        return "Products";
    }
} 
WIDGETS.register("ViewCartWidget", ViewCartWidget, ViewCartWidgetConfigurator); 




/*
function VideoPlayerWidget(instanceId, data){
    var poster = (data.poster!=undefined&&data.poster!="")?" poster=\""+data.poster+"\"":"";
    var width = (data.placeholder!=undefined&&data.placeholder.style.width!=undefined)?data.placeholder.style.width:undefined;
    var height = (data.placeholder!=undefined&&data.placeholder.style.height!=undefined)?data.placeholder.style.height:undefined;
    var sources = data.sources;
    this.loader=function(){                     
      
    }
    this.destroy=function(){
        DATA.deregister("aurora_settings", "");
    }
    this.build=function(){
        var sourcesStr = "";
        for(index in sources){
            sourcesStr += "<source type=\""+sources[index]['type']+"\" src=\""+sources[index]['src']+"\">";
        }
        //<track kind=\"subtitles\" srclang=\"ru\" src=\"./media/sintel_ru.srt\">
        return "<video controls"+poster+" width=\""+width+"\" height=\""+height+"\">"+sourcesStr+"</video>";
    }
}     
function VideoPlayerWidgetConfigurator(){
	this['load'] = function(newData){}
    var id = "VideoWidgetCont";
    this['build'] = function(newData){
        var poster = (newData!=undefined&&newData['poster']!=undefined)?newData['poster']:"";
        var returnString = "";
        var src1 = "";
        var type1="";
        var src2 = "";
        var type2="";
        var src3 = "";
        var type3="";
        
        if(newData!=undefined&&newData['sources'].length>0){
            src1 = (newData!=undefined&&newData['sources'][0]['src']!=undefined)?newData['sources'][0]['src']:"";
            type1 = (newData!=undefined&&newData['sources'][0]['type']!=undefined)?newData['sources'][0]['type']:""; 
             
        }
        returnString+="SRC: <input type=\"text\" id=\""+id+"_src1\" value=\""+src1+"\" /><br />Type<input type=\"text\" id=\""+id+"_type1\" value=\""+type1+"\" /><br />";
        if(newData!=undefined&&newData['sources'].length>1){
            src2 = (newData!=undefined&&newData['sources'][1]['src']!=undefined)?newData['sources'][1]['src']:"";
            type2 = (newData!=undefined&&newData['sources'][1]['type']!=undefined)?newData['sources'][1]['type']:""; 
             
        }
        returnString+="SRC: <input type=\"text\" id=\""+id+"_src2\" value=\""+src2+"\" /><br />Type<input type=\"text\" id=\""+id+"_type2\" value=\""+type2+"\" /><br />";
        if(newData!=undefined&&newData['sources'].length>2){
            src3 = (newData!=undefined&&newData['sources'][2]['src']!=undefined)?newData['sources'][2]['src']:"";
            type3 = (newData!=undefined&&newData['sources'][2]['type']!=undefined)?newData['sources'][2]['type']:""; 
             
        }
        returnString+="SRC: <input type=\"text\" id=\""+id+"_src3\" value=\""+src3+"\" /><br />Type<input type=\"text\" id=\""+id+"_type3\" value=\""+type3+"\" /><br />";
        return returnString+"Poster: <input type=\"text\" id=\""+id+"_poster\" value=\""+poster+"\" />"; 
    }
    this['getData'] = function(){
        var sources = [];
        var src1 = document.getElementById(id+"_src1");
        var type1 = document.getElementById(id+"_type1");
        var src2 = document.getElementById(id+"_src2");
        var type2 = document.getElementById(id+"_type2");
        var src3 = document.getElementById(id+"_src3");
        var type3 = document.getElementById(id+"_type3");
        if(src1.value.length>0){
            var type1Value = (type1.value.length==0)?auroraMediaVideoSrcToType(src1):type1.value;
            sources.push({"src": src1.value, "type": type1Value});
        }
        if(src2.value.length>0){
            var type2Value = (type2.value.length==0)?auroraMediaVideoSrcToType(src2):type2.value; 
            sources.push({"src": src2.value, "type": type2Value});
        }
        if(src3.value.length>0){
            var type3Value = (type3.value.length==0)?auroraMediaVideoSrcToType(src3):type3.value; 
            sources.push({"src": src3.value, "type": type3Value});
        }
        return {"poster": document.getElementById(id+"_poster").value, "sources": sources};
    }
    this['getName'] = function(){
        return "Video Player Widget";
    }
    this['getDescription'] = function(){
        return "An mp4 player";
    }
    this['getPackage'] = function(){
        return "Audio/Video";
    }
} */
var tableBackgroundColor = "#FFFFFF";
var tableBackgroundColorSelected = "#b3ddf8";
var CELL_RENDERERS = {"boolean":BooleanCellRenderer, "string":StringCellRenderer, "int":IntegerCellRenderer,"float":StringCellRenderer, "gender":GenderColumn, "date":(typeof(jQuery)=='undefined')?StringCellRenderer:DateColumn, "RW": ReadWriteColumn, "readWrite": ReadWriteColumn};
                                                                                     
                                    


function cleanFunctions(obj) {
    if(jQuery.isArray(obj)||jQuery.type(obj) === "object"){
        for (var name in obj){
            obj[name] = cleanFunctions(obj[name]);
        }
    }
    else if(jQuery.isFunction(obj)){
        return undefined;   
    }
    return obj;
}

function cleanRenderers(table){
    for(colIndex in table["COLUMNMETADATA"]){
        table["COLUMNMETADATA"][colIndex]["renderer"] = undefined;    
    }
    for(rowIndex in table["ROWMETADATA"]){
        table["ROWMETADATA"][rowIndex]["renderer"] = undefined;    
    }
    for(rowIndex in table["CELLMETADATA"]){
        var row = table["CELLMETADATA"][rowIndex];
        if(row!=undefined){
            for(colIndex in row){
                var cell = row[colIndex];
                cell["renderer"] = undefined; 
            }
        }    
    }
    return table;
}

/**
 *  BasicSelectCellRenderer
 * @constructor
 */
function BasicSelectCellRenderer(options, value, cell, width){
    var element = document.createElement("select");
    var selectedElement = 0;
    for(optionIndex in options){
        var option = options[optionIndex];
        var optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.innerHTML = option.display;
        element.appendChild(optionElement);
        if(optionElement.value==value)
            selectedElement = optionIndex;
    }    
    element.selectedIndex = selectedElement;
    cell.appendChild(element);
    
    this.render = function(){
        element.disabled = true;
    }
    this.getValue = function(){
        return element.value;
    }
    this.renderEditor = function(){
        element.disabled = false;   
    }
    this.setSelected = function(selected){ 
        if(selected){
            cell.className="TableWidgetCellSelected"; 
           // cell.style.backgroundColor=tableBackgroundColorSelected; 
        }                                  
        else{
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.setValue = function(newValue){
        element.value = newValue;
    }
    this.getUpdateEvent = function(){
        return F.extractValueE(element);
    }
}
/**
 *  BasicSelectCellRendererContainer
 * @constructor
 */
function BasicSelectCellRendererContainer(options){       
    this.getCellRenderer = function(value, cell, width){
        return new BasicSelectCellRenderer(options, value, cell, width);
    }
}
//table
/**
 *  BasicRadioCellRenderer
 * @constructor
 */
function BasicRadioCellRenderer(name, options, value, cell, width){
    this.elements = [];
    this.events = new Array();
    for(optionIndex in options){
        var div = document.createElement("div");
        div.style.textAlign = "center";
        var option = options[optionIndex];
        var element = document.createElement("input");
        element.type = "radio";
        element.name = name;
        element.value = option.value;
        div.appendChild(document.createTextNode(option.display));
        div.appendChild(element);
        cell.appendChild(div);
        this.elements.push(element);
        if(element.value == value)
            element.checked = true;
        var event = F.extractEventE(element, "change");
        this.events.push(event);
    }
    this.valueChangeEventE = F.mergeE.apply(this, this.events);  
    this.render = function(){
        this.enabled(false);
    }
    this.enabled = function(en){
        for(elementIndex in this.elements){
            var element = this.elements[elementIndex];
            element.disabled = !en;
        }
    }
    this.getValue = function(){
        for(elementIndex in this.elements){
            var element = this.elements[elementIndex];
            if(element.checked==true){
                return element.value;
            }
        }
        return "";
    }
    this.renderEditor = function(){
        this.enabled(true);
    }
    this.setSelected = function(selected){ 
        if(selected){
            cell.className="TableWidgetCellSelected"; 
           // cell.style.backgroundColor=tableBackgroundColorSelected; 
        }                                  
        else{
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.setValue = function(newValue){
        for(elementIndex in this.elements){
            var element = this.elements[elementIndex];
            if(element.value==newValue){
               element.checked = true
            }
            else
                element.checked = false;
        }
    }
    this.getUpdateEvent = function(){
        return this.valueChangeEventE;
    }
}
/**
 *  BasicRadioCellRendererContainer
 * @constructor
 */
function BasicRadioCellRendererContainer(name, options){
    this.getCellRenderer = function(value, cell, width){
        return new BasicRadioCellRenderer(name, options, value, cell, width);
    }
}
/**
 *  BasicCellRenderer
 * @constructor
 */
function BasicCellRenderer(type, name){ 
    this.getCellRenderer = function(value, cell, width){
        var renderClass = CELL_RENDERERS[type];
        var renderer = new renderClass(value, cell, width);
        //log(renderer);
        return renderer; 
    }
}
/**
 *  DefaultCellRenderer
 * @constructor
 */
function DefaultCellRenderer(value, cell, width){
    this.render = function(){
        cell.innerHTML = value;
    }
    this.getValue = function(){
        return cell.innerHTML;
    }
    this.renderEditor = function(){
        
    }
    this.setSelected = function(selected){ 
        if(selected){
            cell.className="TableWidgetCellSelected"; 
           // cell.style.backgroundColor=tableBackgroundColorSelected; 
        }                                  
        else{
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.setValue = function(newValue){
        value = newValue;
    }
    this.getUpdateEvent = function(){
        return F.receiverE();
    }
}
/**
 *  BooleanCellRenderer
 * @constructor
 */
function BooleanCellRenderer(value, cell, width){    
    var value = (value!=undefined&&(value=="1"||value==true||value=="true"))?true:false;
    var checkbox = document.createElement("input");
    checkbox.type='checkbox';
    checkbox.checked = value;  
    cell.className="TableWidgetBooleanCell";
    checkbox.disabled = true; 
    
    this.render = function(){
        cell.removeChildren();
        checkbox.disabled = true; 
        cell.appendChild(checkbox);
        //jQuery(cell).fj('extEvtE', 'click').mapE(function(x){userChangeE.sendEvent()});
    }
    this.renderEditor = function(){
        cell.removeChildren();
        checkbox.disabled = false;
        cell.appendChild(checkbox);
    }
    this.setSelected = function(selected){
        //log("Chaning boolean "+selected);
        if(selected){
            cell.className="TableWidgetBooleanCellSelected";
            //cell.style.backgroundColor=tableBackgroundColorSelected;  
        }
        else  {
            cell.className="TableWidgetBooleanCell"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
    }
    this.getValue = function(){
        return checkbox.checked;
    }
    this.setValue = function(newValue){
        checkbox.checked = newValue;
    }
    this.getUpdateEvent = function(){
        return F.extractValueE(checkbox);
    }
}
/**
 *  ReadWriteColumn
 * @constructor
 */
function ReadWriteColumn(value, cell, width){
    value = (value==undefined||value==null||value=="")?"":value;
    var select = document.createElement("select");
    
noneOption=document.createElement("OPTION");
    noneOption.appendChild(document.createTextNode("--"));
    noneOption.value = "";
    select.appendChild(noneOption)

readOption=document.createElement("OPTION");
    readOption.appendChild(document.createTextNode("Read"));
    readOption.value = "R";
    select.appendChild(readOption);

    writeOption=document.createElement("OPTION");
    writeOption.appendChild(document.createTextNode("Write"));
    writeOption.value = "W";
    select.appendChild(writeOption)

rwOption=document.createElement("OPTION");
    rwOption.appendChild(document.createTextNode("Read+Write"));
    rwOption.value = "RW";
    select.appendChild(rwOption); 
    select.className="TableWidgetPermissionsCell";
    select.value = value;
     cell.className="TableWidgetCell"; 
           
    this.render = function(){
        cell.removeChildren();
        select.disabled = true; 
        cell.appendChild(select);
    }
    this.renderEditor = function(){
        cell.removeChildren();
        cell.appendChild(select);
        select.disabled = false;            
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
        else                                                         {
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
    this.getUpdateEvent = function(){
        return F.extractValueE(select);
    }
}
/**
 *  GenderColumn
 * @constructor
 */
function GenderColumn(value, cell, width){
    value = (value==undefined||value==null||value=="")?"M":value;
    var select = document.createElement("select");
    maleOption=document.createElement("OPTION");
    maleOption.appendChild(document.createTextNode("Male"));
    maleOption.value = "M";
    femaleOption=document.createElement("OPTION");
    femaleOption.appendChild(document.createTextNode("Female"));
    femaleOption.value = "F";
    select.appendChild(maleOption);
    select.appendChild(femaleOption); 
    select.className="TableWidgetGenderCell";
    select.value = value;
     cell.className="TableWidgetCell"; 
           
    this.render = function(){
        cell.removeChildren();
        select.disabled = true; 
        cell.appendChild(select);
    }
    this.renderEditor = function(){
        cell.removeChildren();
        cell.appendChild(select);
        select.disabled = false;            
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
        else                                                         {
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.getValue = function(){
        return select.value;
    }
    this.setValue = function(newValue){
        select.value = newValue;
    }
    this.getUpdateEvent = function(){
        return F.extractValueE(select);
    }
}
/**
 *  DateColumn
 * @constructor
 */
function DateColumn(value, cell, width){
   value = (value==undefined||value==null||value=="")?"2012-01-01":value;
    var div = document.createElement("div");
    cell.className="TableWidgetCell"; 
           
    var input = document.createElement("input");
    input.type = "text";
    //input.className = "TableWidgetStringCellRenderTextBox";
    this.render = function(){
        jQuery(input).datepicker("destroy");
        div.innerHTML = value;
        //jQuery(input).datepicker("setDate", value); 
        cell.removeChildren(); 
        cell.appendChild(div);
        
    }
    this.renderEditor = function(){     
        cell.removeChildren(); 
        cell.appendChild(input);
        //input.className = "TableWidgetStringCellTextBox";
        input.value = value;
        jQuery(input).datepicker({ dateFormat: 'yy-mm-dd', changeMonth: false,changeYear: true, yearRange: '1910:2100', showButtonPanel: false});
        jQuery(input).datepicker("setDate", value); 
        //jQuery(input).datepicker("show");           
    }
    this.setSelected = function(selected){
        if(selected){
            cell.className="TableWidgetCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected; 
        }
        else                                                         {
            cell.className="TableWidgetCell"; 
           // cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.getValue = function(){
        date = jQuery.datepicker.formatDate('yy-mm-dd',jQuery(input).datepicker("getDate"));
        //date = jQuery(input).datepicker("getDate");
        return date;
    }
    this.setValue = function(newValue){
        jQuery(input).datepicker("setDate", newValue);
    }
    this.getUpdateEvent = function(){
        return jQuery(input).datepicker().fj('jQueryBind', 'change');
    }
}        
/**
 *  StringCellRenderer
 * @constructor
 */
function StringCellRenderer(value, cell, width){
    value = (value==undefined||value==null)?"":value;
    var displayDom = document.createElement("div");
    displayDom.className = "TableWidgetStringCellText";
    cell.className="TableWidgetStringCell";
    var textbox = document.createElement("input");
    textbox.className = "TableWidgetStringCellTextBox";
    textbox.type='text';
    textbox.value = value;
    //textbox.disabled = true;                 
    this.render = function(){ 
            displayDom.innerHTML = textbox.value; 
            cell.removeChildren(); 
            cell.appendChild(displayDom);
    }
    this.renderEditor = function(){
            var scrollWidth = (cell.scrollWidth==0)?cell.style.width:cell.scrollWidth+"px";
            if(width!=undefined){
                textbox.style.width = width+"px";
            }    
            cell.removeChildren();
            cell.appendChild(textbox);
    }                                         
    this.setSelected = function(selected){
        
        if(selected){
            cell.className="TableWidgetStringCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected;
        }
        else{
            cell.className="TableWidgetStringCell"; 
            ///cell.style.backgroundColor=tableBackgroundColor;
        }
    }
    this.getValue = function(){
        return textbox.value;
    }
    this.setValue = function(newValue){
        textbox.value = newValue;
    }
    this.getUpdateEvent = function(){
        return F.extractValueE(textbox);
    }
}
/**
 *  IntegerCellRenderer
 * @constructor
 */
function IntegerCellRenderer(value, cell, width){
    value = (value==undefined||value==null)?"":value;
    var displayDom = document.createElement("div");
    displayDom.className = "TableWidgetStringCellText";     //TableWidgetIntegerCellText
    cell.className="TableWidgetStringCell";
    var textbox = document.createElement("input");
//    textbox.className = "TableWidgetStringCellTextBox";       //TableWidgetIntegerCellTextBox
    textbox.type='text';
    textbox.value = value;
    //textbox.disabled = true;                 
    this.render = function(){ 
            displayDom.innerHTML = textbox.value; 
            cell.removeChildren(); 
            cell.appendChild(displayDom);
    }
    this.renderEditor = function(){
            var scrollWidth = (cell.scrollWidth==0)?cell.style.width:cell.scrollWidth+"px";
            if(width!=undefined){
                textbox.style.width = width+"px";
            }    
            cell.removeChildren();
            cell.appendChild(textbox);
    }                                         
    this.setSelected = function(selected){
        
        if(selected){
            cell.className="TableWidgetStringCellSelected"; 
            //cell.style.backgroundColor=tableBackgroundColorSelected;
        }
        else{
            cell.className="TableWidgetStringCell"; 
            ///cell.style.backgroundColor=tableBackgroundColor;
        }
    }
    this.getValue = function(){
        var val = textbox.value;
        if(val.length==0)
            val = 0;
        return parseFloat(val);
    }
    this.setValue = function(newValue){
        textbox.value = newValue;
    }
    this.getUpdateEvent = function(){
        return F.extractValueE(textbox);
    }
}

/**                            
 *  TableWidgetB
 * @constructor
 */
function TableWidgetB(instanceId, widgetData, dataB){
    if(arguments.length!=3)
        log("Error TableWidgetB called with wrong argument count");
    var table = document.createElement("table");
    table.id = instanceId+"_table";
    table.className = "TableWidget";
    this.table = table;
    var confirmChanges = (widgetData!=undefined&&widgetData.confirmChanges!=undefined)?widgetData.confirmChanges:true;
    var confirmChangesB = F.constantB(confirmChanges);
   //Control Bar Buttons
    var saveButton = createIcon(window['SETTINGS']['theme'].path+"save.png");
    var cancelButton = createIcon(window['SETTINGS']['theme'].path+"cancel.png");
    var addRowButton = createIcon(window['SETTINGS']['theme'].path+"add.png");
    var deleteRowButton = createIcon(window['SETTINGS']['theme'].path+"delete.png"); 
    
    var addRow = document.createElement("tr");
    var controlsRow = document.createElement("tr");
    var controlsCell = document.createElement("td");
            
            controlsCell.className = "TableWidgetControlBar";
            controlsCell.appendChild(saveButton);
            controlsCell.appendChild(cancelButton); 
            controlsCell.appendChild(addRowButton);
            controlsCell.appendChild(deleteRowButton);
            controlsRow.appendChild(controlsCell);
    
    var width = (widgetData.placeholder!=undefined&&widgetData.placeholder.style.width!=undefined)?widgetData.placeholder.style.width:undefined;
    var height = (widgetData.placeholder!=undefined&&widgetData.placeholder.style.height!=undefined)?widgetData.placeholder.style.height:undefined;
    var containerId = instanceId+"_cont";
    
    //Build Heading Row
    //Events
    var userEventE = F.receiverE();
    var userEventB = userEventE.startsWith("view");
    
    var triggerSaveE = F.receiverE();
    var saveButtonPressedE = F.mergeE(triggerSaveE, F.extractEventE(saveButton,'click'));
    var cancelButtonPressedE = F.extractEventE(cancelButton,'click');   
    var addButtonPressedE = F.extractEventE(addRowButton,'click');
   var deleteButtonPressedE = F.extractEventE(deleteRowButton,'click');
    
    var sortingDOMColumnE = F.receiverE();
    var sortingDOMColumnB = sortingDOMColumnE.startsWith(NOT_READY);
    
    var sortedTableB = F.liftBI(function(sortingDOMColumn, table){
        //log("sortedTableB");
        if(table==NOT_READY){
            return NOT_READY;
        }
        if(sortingDOMColumn!=NOT_READY){
            var columns = table["COLUMNS"];
            var count = 0;
            for(index in columns){
                if(count==sortingDOMColumn&&columns[index]['visible']){
                    if(table['TABLEMETADATA']['sortColumn']==index){
                        table['TABLEMETADATA']['sortOrder'] = (table['TABLEMETADATA']['sortOrder']=="ASC")?"DESC":"ASC";    
                    }
                    table['TABLEMETADATA']['sortColumn'] = index;
                }
                if(columns[index]['visible']){
                    count++;
                }               
            }
        }
        
        return table;
    },function(value){
        return [NOT_READY, value];
    }, sortingDOMColumnB, dataB);
    
    //extractEventE(table,"click")                   jQuery(table).fj('extEvtE', 'click')
    var tableRowClickedE = F.extractEventE(table,"click").mapE(function(ev){
        stopEventBubble(ev);
        //ev.preventDefault();
        //return NOT_READY;
       // log("Row clicked");
        var target = (ev.target==undefined)?ev.srcElement:ev.target;
        jQuery(target).focus();
        if(target.tagName=="TH"){
            sortingDOMColumnE.sendEvent(jQuery(target).parent().children().index(target));  
            return NOT_READY;
        }
        var cell = findParentNodeWithTag(target, "td");
        var row = findParentNodeWithTag(cell, "tr");
        var table =findParentNodeWithTag(row, "table");
            if(row!=undefined){
                var clickedIndex = jQuery(row).prevAll().length;
                if(clickedIndex<=0 || (table.rows.length-1)==clickedIndex){
                    return NOT_READY;
                }
                return {clickedIndex: clickedIndex, shiftKey: ev.shiftKey, ctrlKey: ev.ctrlKey, target: target};
            }
        return NOT_READY;
    }).filterE(function(v){return v!=NOT_READY;});
    
    var tableBlurE = jQuery(document).fj('extEvtE', 'click').mapE(function(x){return NOT_READY;});    
    var rowSelectionResetE = F.receiverE();
    var tableSelectionRowIndexE = F.mergeE(tableRowClickedE, rowSelectionResetE.mapE(function(v){return NOT_READY;}), tableBlurE);
    var rowSelectionsE = tableSelectionRowIndexE.collectE([],function(newElement,arr) {
        if(newElement==NOT_READY)
            return []; 
           // log("Col");
        var clickedIndex = newElement.clickedIndex;
        var shiftKey = newElement.shiftKey;
        var ctrlKey = newElement.ctrlKey;
        if(ctrlKey){        
            if(arrayContains(arr, clickedIndex)){
                arr = jQuery.grep(arr, function(value) {return value != clickedIndex;});
            }
            else {
                arr[arr.length] = clickedIndex;
            }
        }
        else if(shiftKey){
            var min = Array.max(arr);
            var max = Array.min(arr);
            if(clickedIndex<min){
                for(i=clickedIndex;i<min;i++)
                    arr[arr.length] = i;    
            }
            else if(clickedIndex>max){
                for(i=max+1;i<=clickedIndex;i++)
                    arr[arr.length] = i; 
            }
        }
        else{
            if(arr.length==1&&arrayContains(arr, clickedIndex)){
                arr = [];
            }
            else{
                arr = [clickedIndex];
            }
        }
        
           
        return arr;
    });
    var rowSelectionsB = rowSelectionsE.startsWith([]);
    
    
    
    
    
    var showAddRowsResetE = F.receiverE();
    
    var showAddRowsB = F.mergeE(addButtonPressedE, showAddRowsResetE).collectE(false,function(newVal,lastVal){if(newVal==NOT_READY)return false;return !lastVal; }).startsWith(false);
           
    
    var pageRenderedB = F.liftBI(function(tableData){
        //log("pageRenderedB");
        table.removeChildren();
        addRow.removeChildren();
        //If not ready, show a loading icon
        if(tableData==NOT_READY){
            var element = document.createElement("td");
            element.className = "TableWidgetCell";
            jQuery(element).attr('colspan',visibleColumnCount);                                         
            element.style.textAlign="center";
            element.innerHTML = "<img src=\""+window['SETTINGS']['theme'].path+"loading.gif\" alt=\"\"/>";
            table.appendChild(element);
            return [new Array(), table, new Array(), document.createElement("div"), F.zeroE()];
        }  
        else if(tableData==NO_PERMISSION){
            var element = document.createElement("td");
            element.className = "TableWidgetCell";
            jQuery(element).attr('colspan',visibleColumnCount);                                         
            element.style.textAlign="center";
            element.innerHTML = "<img src=\""+window['SETTINGS']['theme'].path+"noperm.png\" alt=\"\"/><br />No Permission";
            table.appendChild(element);
            return [new Array(), table, new Array(), document.createElement("div"), F.zeroE()];
        }  
        //log(tableData);
        var headingTableRow = document.createElement("tr");
        var visibleColumnCount = 0;
       /* if(tableData['COLUMNS']==undefined){
            for (property in tableData){
                alert(property);
            }
            return;
        }  */
        
        
        var columns = tableData['COLUMNS'];
        var columnClicks = [];
        jQuery(controlsCell).attr('colspan',columns.length); 
        for(index in columns){ 
            var col = columns[index];
            //log(col);
            if(col.visible){
                var cell = document.createElement("th");
                if(col.width!=undefined){
                    cell.width = col.width;
                }
                cell.innerHTML = col.display;
                headingTableRow.appendChild(cell);
                visibleColumnCount++;
                columnClicks.push(F.extractEventE(cell, 'click'));
            }
        }
        var columnClicksE = F.mergeE.apply(this, columnClicks);
        table.appendChild(headingTableRow);
        
        
        //If ready render the table
        var tableMetaData = tableData['TABLEMETADATA'];
        var tablePermissions = (tableMetaData!=undefined&&tableMetaData['permissions']!=undefined&&tableMetaData['permissions']['canEdit']!=undefined)?tableMetaData['permissions']['canEdit']:true; 
      //  log("SortColumn: "+tableMetaData['sortColumn']);
        if(tableMetaData!=undefined&&tableMetaData['sortColumn']!=undefined){
            var sortCol = tableMetaData['sortColumn'];
        //    log(sortCol);
            if(sortCol!=undefined){
              //  log("INIF");
                var sortOrder = (tableMetaData['sortOrder']==undefined)?"DESC":tableMetaData['sortOrder'];
               // log(sortOrder);
                tableData['DATA'].sort(((tableData['COLUMNMETADATA'][sortCol]!=undefined&&tableData['COLUMNMETADATA'][sortCol]['sorter']!=undefined)?tableData['COLUMNMETADATA'][sortCol]['sorter']:function(row1, row2){return (typeof row1[sortCol] === 'string')?row1[sortCol].localeCompare( row2[sortCol]):row1[sortCol] - row2[sortCol];}));    
                if(sortOrder=="ASC"){
                    tableData['DATA'].reverse();
                }
                //return row1[filenameIndex].localeCompare(row2[filenameIndex]); 
            }
        } 
        
        var data = tableData['DATA'];
        renderedTable = new Array(); 
        for(index in data){
            var domRow = document.createElement("tr");
            var dataRow = data[index];
            var rowMetaData = tableData['ROWMETADATA'][index];
            var rowPermissions = (rowMetaData!=undefined&&rowMetaData['permissions']!=undefined)?rowMetaData['permissions']:"RW";
            if(renderedTable[index]==undefined)
                renderedTable[index] = new Array();
            for(cellIndex in columns){
                var columnMetaData = tableData['COLUMNMETADATA'][cellIndex];
                var columnPermissions = columnMetaData==undefined||columnMetaData['permissions']==undefined?"RW":columnMetaData['permissions'];
                var cellMetaData = (tableData['CELLMETADATA']==undefined||tableData['CELLMETADATA'][index]==undefined)?undefined:tableData['CELLMETADATA'][index][cellIndex];
                var cellPermissions = cellMetaData==undefined||cellMetaData['permissions']==undefined?"RW":cellMetaData['permissions']; 
                var rowNumber = parseInt(cellIndex)+1;
                var cell = document.createElement("td");
                var column = columns[cellIndex];
		var customRenderer = (rowMetaData!=undefined&&rowMetaData["renderer"]!=undefined)?rowMetaData["renderer"]:(columnMetaData!=undefined&&columnMetaData["renderer"]!=undefined)?columnMetaData["renderer"]:(cellMetaData!=undefined&&cellMetaData["renderer"]!=undefined)?cellMetaData["renderer"]:undefined;

                if(customRenderer==undefined){
                    var renderClass = (CELL_RENDERERS[column.type]==undefined)?DefaultCellRenderer:CELL_RENDERERS[column.type];
                    var renderer = new renderClass(dataRow[cellIndex], cell, column.width);
                }
                else{
                    var renderer = customRenderer.getCellRenderer(dataRow[cellIndex], cell, column.width); 
                } 
                
		if(tablePermissions==true&&rowPermissions=="RW"&&columnPermissions=="RW"&&cellPermissions=="RW")
                    renderer.renderEditor();    
                else
                    renderer.render();
                if(renderedTable[index]==undefined)
                    renderedTable[index] = new Array();
                
                renderedTable[index][cellIndex] = {"renderer":renderer, "column":column,"domCell":cell,"domRow":domRow,"validator":null,"rowIndex":index,"colIndex":cellIndex};          
                if(column.visible){                                
                    domRow.appendChild(cell);
                }
            }                                                                                           
            table.appendChild(domRow);    
        }
            
            newRowsRenderedTable = new Array();
            for(cellIndex in columns){
                var columnMetaData = tableData['COLUMNMETADATA'][cellIndex];
                var columnPermissions = columnMetaData==undefined?"RW":columnMetaData.permissions;
                
                var rowNumber = parseInt(cellIndex)+1;
                var cell = document.createElement("td");
                var column = columns[cellIndex];
                var customRenderer = (columnMetaData!=undefined&&columnMetaData["renderer"]!=undefined)?columnMetaData["renderer"]:undefined;	
		if(customRenderer==undefined){                           
			var renderClass = (CELL_RENDERERS[column.type]!=undefined)?CELL_RENDERERS[column.type]:DefaultCellRenderer;
                    	renderer = new renderClass(undefined, cell, column.width);
                }
                else{                   
			renderer = customRenderer.getCellRenderer(undefined, cell, column.width);  
                }
                renderer.renderEditor();
                if(newRowsRenderedTable[0]==undefined)
                    newRowsRenderedTable[0] = new Array();
                newRowsRenderedTable[0][cellIndex] = {"renderer":renderer, "column":column,"domCell":cell,"domRow":domRow,"validator":null,"rowIndex":0,"colIndex":cellIndex};
                if(columns[cellIndex].visible){    
                    addRow.appendChild(cell);
                }
            }                                                                                           
            table.appendChild(addRow); 
            table.appendChild(controlsRow);
        return [renderedTable, table, tableData, newRowsRenderedTable, columnClicksE];
        // Table of Cell Renderers, The Dom Table, the raw table data
    },function(value){
        return [value];
    }, sortedTableB);
    
    
    var renderedTableB = F.liftB(function(pageRendered){
        return pageRendered[0];
    }, pageRenderedB); 
    
    var domTableB = F.liftB(function(pageRendered){
        return pageRendered[1];
    }, pageRenderedB);
    
    var newRowsRenderedTableB = F.liftB(function(pageRendered){
        return pageRendered[3];
    }, pageRenderedB);  
    
    var columnClickedE = pageRenderedB.changes().mapE(function(pageRendered){
        return (pageRendered[4]);
    }).switchE();
    var columnClickedB = columnClickedE.startsWith(NOT_READY);
    
    
    
    
   /* var sortColumnB = F.liftB(function(columnClicked, data){
        if(!good()){
            return NOT_READY;
        }    
        var target = (columnClicked.target==undefined)?columnClicked.srcElement:columnClicked.target;
        var col = jQuery(target).parent().children().index(target);
        var columns = data["COLUMNS"];
        var count = 0;
        for(index in columns){
            if(count==col&&columns[index]['visible']){
                log(columns[index]['reference']);
                data['TABLEMETADATA']['sortColumn'] = columns[index]['reference'];
                return data;
            }
            if(columns[index]['visible']){
                count++;
            }               
        }
        return NOT_READY;
    }, columnClickedB, dataB);

    sortColumnB.changes().mapE(function(sortColumn){
        log("Sorting Column");
        dataB.sendEvent(sortColumn);
    });   */
    
    var filteredRowSelectionsB = F.liftB(function(rowSelections, renderedTable, newRowsRenderedTable){
            for(index in rowSelections){
                var targetIndex = rowSelections[index];
                if(targetIndex>renderedTable.length){
                    arrayCut(rowSelections, index);
                }                                               
            }
        return rowSelections;
    }, rowSelectionsB, renderedTableB, newRowsRenderedTableB); 
   var rowSelectionsEmptyB = filteredRowSelectionsB.liftB(function(rowSelections){return rowSelections.length==0;});      
    
    
    var renderedRowSelectionsB = F.liftB(function(renderedTable, rowSelections){
        if(renderedTable==NOT_READY||rowSelections==NOT_READY){
            return NOT_READY; 
        }
        var c = document.createElement("div");
            for(index in renderedTable){   
                var isSelected = arrayContains(rowSelections, parseInt(index)+1);
                for(cellIndex in renderedTable[index]){
                    //log("Setting Selected");
                    renderedTable[index][cellIndex]["renderer"].setSelected(isSelected);
                }
            }
    }, renderedTableB, rowSelectionsB);
    
    
       
    
    var tableAllowsAddB = dataB.liftB(function(tableData){
	//log("tableAllowsAddB");
	return (tableData["TABLEMETADATA"]!=undefined&&tableData["TABLEMETADATA"]['permissions']!=undefined&&tableData["TABLEMETADATA"]['permissions']['canAdd']!=undefined)?tableData["TABLEMETADATA"]['permissions']['canAdd']:true;
    });
    var tableAllowsDeleteB = dataB.liftB(function(tableData){
	//log(tableAllowsDeleteB);
	return (tableData["TABLEMETADATA"]!=undefined&&tableData["TABLEMETADATA"]['permissions']!=undefined&&tableData["TABLEMETADATA"]['permissions']['canDelete']!=undefined)?tableData["TABLEMETADATA"]['permissions']['canDelete']:true;
    });
    
    var tableDataChangedB = F.liftB(function(rendererTable, domTable){
        if(rendererTable==NOT_READY||rendererTable.length==0||domTable==NOT_READY)
            return F.receiverE().startsWith(NOT_READY);
//	log("tableDataChangedB");
        var updateEvents = new Array();
        for(var rowIndex in rendererTable){
            for(var colIndex in rendererTable[rowIndex]){
                
                updateE = rendererTable[rowIndex][colIndex]["renderer"].getUpdateEvent();
                updateEvents.push(updateE);
            }
        }                                                             
        //log("ZZZ");
        return F.mergeE.apply(this, updateEvents).startsWith(false);   
    },
    renderedTableB, domTableB).switchB();
    
   var userDataChangeB = F.orB(tableDataChangedB.changes().snapshotE(pageRenderedB).mapE(function(renderedData){
        // Table of Cell Renderers, The Dom Table, the raw table data
       // log("Checking Change");
        var rendererTable = renderedData[0];
        
        var domTable = renderedData[1];
        var columns = renderedData[2]["COLUMNS"];
        var dataTable = renderedData[2]["DATA"];
        /*var newRenderTable = renderedData[3]; */       
        for(var rowIndex in rendererTable){
            for(var colIndex in rendererTable[rowIndex]){
                var renderCell = rendererTable[rowIndex][colIndex];
                var dataCell = dataTable[rowIndex][colIndex];
                //log("Getting Renderer Value");
                
                if(columns[colIndex].visible&&(renderCell["renderer"]).getValue()!=dataCell){
                    
   /*                log("DIFF");
                    log(renderCell["renderer"].getValue()+" != "+dataCell);
                log(renderCell["renderer"]);
                log(typeof(rowIndex)+" "+typeof(colIndex));
                log(rowIndex+" "+colIndex);
                log(renderCell);
                log(dataCell);
                log(dataTable);
                log("/DIFF"); */
                    return true; 
                
                }
            } 
        }
        return false;
    }).startsWith(false), showAddRowsB); 
    
    F.liftB(function(userDataChange, confirmChanges){
        //log(userDataChange+" "+confirmChanges);
        if(userDataChange==NOT_READY||confirmChanges==NOT_READY){
            return NOT_READY;
        }
        
        if(userDataChange&&(!confirmChanges)){
            //log("Sending Update");
            triggerSaveE.sendEvent("ChangeEvent");
        }
    }, userDataChangeB, confirmChangesB);
    
    
    
    /*
    Gui Updates                     
    */
    F.insertValueB(F.ifB(F.andB(userDataChangeB, confirmChangesB), 'inline', 'none'),saveButton, 'style', 'display');
    F.insertValueB(F.ifB(F.andB(userDataChangeB, confirmChangesB), 'inline', 'none'),cancelButton, 'style', 'display');
    
    F.insertValueB(F.ifB(showAddRowsB, 'table-row', 'none'),addRow, 'style', 'display');
  
    F.insertValueB(F.ifB(F.andB(F.notB(showAddRowsB), tableAllowsAddB), 'inline', 'none'),addRowButton, 'style', 'display');
    F.insertValueB(F.ifB(rowSelectionsEmptyB, 'auto', 'pointer'),deleteRowButton, 'style', 'cursor');
    F.insertValueB(F.ifB(tableAllowsDeleteB, 'inline', 'none'),deleteRowButton, 'style', 'display');
    F.insertValueB(F.ifB(F.notB(rowSelectionsEmptyB), window['SETTINGS']['theme'].path+'delete.png', window['SETTINGS']['theme'].path+'delete_disabled.png'),deleteRowButton, 'src'); 

    /*
    Save Rows
    */
    cancelButtonPressedE.snapshotE(dataB).mapE(function(data){
        showAddRowsResetE.sendEvent(NOT_READY);
        dataB.sendEvent(data); 
    });
    saveButtonPressedE.snapshotE(F.liftB(function(pageRendered, showAddRows){return [pageRendered, showAddRows]}, pageRenderedB,showAddRowsB)).mapE(function(data){
//log("saveButtonPressedE");    
    //log("save pressed");    
	var renderedTable = data[0][0];
        var dataTable = data[0][2]["DATA"];
        var columns = data[0][2]["COLUMNS"];
        var newRenderedTable = data[0][3];  
        var renderRowIndex = renderedTable.length-1;
        var showAddRows = data[1];
        //log(data[2][0]);
        //log("ABOVE:"+data[2][0].length);                               
        if(renderedTable.length>dataTable.length){
        var dataRowIndex = dataTable.length;
        dataTable[dataRowIndex] = Array();
            for(c=0;c<renderedTable[renderRowIndex].length;c++){
                var cell = renderedTable[renderRowIndex][c];
               //log("Save Button Get Renderer ");
                var value = cell["renderer"].getValue();
                dataTable[dataRowIndex][c] = value;
            }
        }
        else{
            r=0;
                for(r=0;r<renderedTable.length;r++){
              //  log("Row "+r);
                    for(c=0;c<renderedTable[r].length;c++){
                        //log();
                        var cell = renderedTable[r][c];
                        //log("Save Button Get Renderer "); 
                        var value = cell["renderer"].getValue();
                        dataTable[r][c] = value;
                    }
                }
                if(showAddRows){
                for(rowIndex=0;rowIndex<newRenderedTable.length;rowIndex++){
                    for(c=0;c<newRenderedTable[rowIndex].length;c++){
                        var cell = newRenderedTable[rowIndex][c];
                        //log("Save Button Get Renderer "); 
                        var value = cell["renderer"].getValue();
                        if(dataTable[rowIndex+r]==undefined)
                            dataTable[rowIndex+r] = new Array();
                        dataTable[rowIndex+r][c] = value;
                    }
                }
            }    
        }
        pageRenderedB.sendEvent(data[0][2]);  
        showAddRowsResetE.sendEvent(NOT_READY);    
    });      
    
    
    /*
    Delete Rows
    */
    var pageDataAndRowSelectionsB = F.liftB(function(renderedData, rowSelections){
    if(renderedData==NOT_READY||rowSelections==NOT_READY){
        return NOT_READY;                         
    }
          //  log("Page and row selections");
        return {renderedData: renderedData, rowSelections: rowSelections};
    }, pageRenderedB, rowSelectionsB);
    var deleteTableRowsB = deleteButtonPressedE.snapshotE(pageDataAndRowSelectionsB).startsWith(NOT_READY);
    
    deleteTableRowsB.liftB(function(data){
        if(data==NOT_READY || data.rowSelections.length==0){
            return;
        }
        var rowSelections = data.rowSelections.reverse(); 
        var renderedTable = data.renderedData[0];
        var dataTable = data.renderedData[2]["DATA"];
        var columns = data.renderedData[2]["COLUMNS"];
        for(index=0;index<rowSelections.length;index++){
            arrayCut(data.renderedData[2]["DATA"], (rowSelections[index]-1));
        }      
        UI.confirm("Delete Rows", "Are you sure you wish to delete these "+rowSelections.length+" row(s)", "Yes", function(val){
            rowSelectionResetE.sendEvent(true);
            pageRenderedB.sendEvent(data.renderedData[2]);
        }, "No",
        function(val){
            rowSelectionResetE.sendEvent(true);
        }); 
    });
    
    domTableB.delayB(1000).liftB(function(domTable){
        /*jQuery(domTable).colResizable({
            liveDrag:true, 
            gripInnerHtml:"<div class='grip'></div>", 
            draggingClass:"dragging", 
            onResize:function(resize){
                log(resize);
            }}); */
    });
    return domTableB
}
function getTableRowId(table, rowIndex){
    if(table.TABLEMETADATA!=undefined&&table.TABLEMETADATA['idColumn']!=undefined){
        var idColumnStr = table.TABLEMETADATA['idColumn'];
        var colIndex = getColumnIndex(table, idColumnStr);
        if(colIndex==null)
            return null;
        return table["DATA"][rowIndex][colIndex];
    }
    else
        log("Error, no id column specified in table meta data");
}
function getTableValue(table, rowIndex, columnName){
	var colIndex = getColumnIndex(table, columnName);
    if(colIndex==null)
        return null;
    return table["DATA"][rowIndex][colIndex];
}
function getColumnIndex(table, columnName){
    for(colIndex in table["COLUMNS"]){
        if(table["COLUMNS"][colIndex]["reference"]==columnName){
            return colIndex;
        }
    }
    return null;
}
function JoinTableB(table1B, table2B, columnId){
    return F.liftBI(function(table1, table2){
        if(table1==NOT_READY||table2==NOT_READY){
            return NOT_READY;
        }
        var searchColIndex1 = columnId;
        for(colIndex in table1["COLUMNS"]){
            if(columnId==table1["COLUMNS"]["reference"]){
                searchColIndex = colIndex;
                break;
            }        
        }
        var searchColIndex2 = columnId;
        for(colIndex in table2["COLUMNS"]){
            if(columnId==table2["COLUMNS"]["reference"]){
                searchColIndex = colIndex;
                break;
            }        
        }
        
        /*for(property in table1){
            log(property);
            log(table1[property]);
        }*/  
        
        table1["COLUMNS"] = table1["COLUMNS"].concat(table2["COLUMNS"]);
        //table1["COLUMNMETADATA"] = table1["COLUMNMETADATA"].concat(table2["COLUMNMETADATA"]);
        for(rowIndex in table1["DATA"]){
            var searchCell1 = table1["DATA"][rowIndex][searchColIndex1];
            for(rowIndex2 in table2["DATA"]){
                var searchCell2 = table2["DATA"][rowIndex2][searchColIndex2];
                if(searchCell1==searchCell2){
                    for(colIndex2 in table2["DATA"][rowIndex2]){
                        table1["DATA"][rowIndex][table1["COLUMNS"].length+colIndex2] = table2["DATA"][rowIndex2][colIndex2];
                    }
                }    
            }
        }
        return table1;
    }, function(mergeTable){
    
        return [table1, table2];
    }, table1B, table2B);
}
function FileUploaderDragDropWidget(instanceId,data){
    var UPLOAD = new AuroraUploadManager(); 
    var parent = this;
    var multiFile = (data.multiFile==undefined)?false:data.multiFile;
    var acceptedTypes = (data.acceptedTypes==undefined)?[]:data.acceptedTypes;                      
    var textStatus = DOM.createDiv(instanceId+"_status", "Drop Files Here");
    textStatus.className = "auroraUpload_dropZoneProgress";
    
    
    var dropHoverHtml = data.dropHoverHtml;
    
    
    var dropZone = DOM.createDiv(instanceId+"_dropZone"); 
    if(data.dropHtml!=undefined){
    	dropZone.innerHTML = data.dropHtml;
    }
    else{
    	dropZone.appendChild(textStatus);
    	dropZone.className = 'UploadDropZone';
    }
    
    //dropZone.style.display = 'inline-block';
    var width = data.placeholder.getAttribute('width');
    if(width==undefined){
    	width = data.placeholder.style.width.replace('px', '');
    }
    var height = data.placeholder.getAttribute('height');
    if(height==undefined){
    	height = data.placeholder.style.height.replace('px', '');
    }
    
    dropZone.style.width = width+'px';
    dropZone.style.height = height+'px';
    this.getDropZone = function(){return dropZone;};
    this.getPanel = function(){return textStatus;};
    this.loader=function(){     
        var dr = DOM.get((data.targetId!=undefined)?data.targetId:dropZone.id);
        //dr.style.backgroundColor = "#FF0000";
        var dropE = F.extractEventE(dr, 'drop').mapE(function(event){
            DOM.stopEvent(event); 
            //log(event);
            if(DOM.get(dropZone.id)){
                    DOM.get(dropZone.id).className = "UploadDropZone";
            }
            return event;    
        }); 
        this.dropE = dropE;
        var dragOverE = F.extractEventE(dr, 'dragover').mapE(function(event){
            DOM.stopEvent(event); 
            
            event.dataTransfer.dropEffect = 'move';
            
            if(data.dropHoverHtml!=undefined){
            	DOM.get(dropZone.id).innerHTML = data.dropHoverHtml;
            }
            else if(DOM.get(dropZone.id)){
                DOM.get(dropZone.id).className = "UploadDropZoneHover";
            }
            return event;
        });
        
        var dragEnterE = F.extractEventE(dr, 'dragenter').mapE(function(event){
            DOM.stopEvent(event); 
            
            if(data.dropHoverHtml!=undefined){
            	DOM.get(dropZone.id).innerHTML = data.dropHoverHtml;
            }
            else if(DOM.get(dropZone.id)){
                DOM.get(dropZone.id).className = "UploadDropZoneEnter";
            }
            return event;
        });
        
        var dragExitE = F.extractEventE(dr, 'dragleave').mapE(function(event){
            DOM.stopEvent(event); 
            if(data.dropHtml!=undefined){
            	DOM.get(dropZone.id).innerHTML = data.dropHtml;
            }
            else if(DOM.get(dropZone.id)){
                    DOM.get(dropZone.id).className = "UploadDropZone";
            }
            return event;
        });               
    
        var filesDropE = dropE.mapE(function(event){ 
            var files = event.target.files || event.dataTransfer.files;  
            var totalBytes = 0;
            var fileArray = [];
            for(fileIndex in files){
                if(files[fileIndex].size!=undefined){
               
                    if(files[fileIndex].type!=""){
                        totalBytes+=files[fileIndex].size;
                        UPLOAD.add(files[fileIndex]);
                    }
                    else{
                        log("Unable to upload directories skipping "+files[fileIndex].type);
                    }
                }
            }
            return {size: totalBytes, files:files};
        });
        this.filesDropE = filesDropE;
        this.uploadCompleteE = UPLOAD.uploadCompleteE;
        this.allUploadsCompleteE = UPLOAD.allUploadsCompleteE;
        //UPLOAD.allUploadsCompleteE;  
    
        var sendLoadStartE = UPLOAD.getUploader().sendLoadStartE.mapE(function(data){
            DOM.get(textStatus.id).innerHTML = "Uploading..."; 
        });
              
        var sendProgressE = UPLOAD.progressUpdateB.changes().filterE(function(val){return val!=NOT_READY;}).mapE(function(progress){
            // {total:totalSize, loaded:totalTransfered, currentTotal:progressUpdate.total, currentLoaded:progressUpdate.loaded};  
               var total = progress.currentTotal;
               var loaded = progress.currentLoaded;
               var currentPercentage = (loaded/total)*100;  
               
               var total = progress.total;
               var loaded = progress.loaded;
               var queuePercentage = (loaded/total)*100; 
               if(queuePercentage<0){
                queuePercentage = 0;
               }    
               else if(queuePercentage>100){
                queuePercentage = 100;
               }
                 
               /*if(DOM.get(textStatus.id)){
                DOM.get(textStatus.id).innerHTML = percentage+"%";
               }    */
             return {filePercentageComplete:currentPercentage, queuePercentageComplete:queuePercentage,currentFile:progress.currentFile, rate:progress.rate, queue:progress.queue, formattedTotal:progress.formattedTotal}; 
        });      

        this.sendProgressE = sendProgressE;
        // totalProgressB               filePercentageComplete  queuePercentageComplete currentFile
        this.totalProgressB = F.liftB(function(progress){
            if(!good()){
                return NOT_READY;
            }
            return progress;
        }, sendProgressE.startsWith(NOT_READY));
        
    }
    this.build=function(){
        if(!data.targetId){ 
            return dropZone.outerHTML;
        }
        //textStatus.innerHTML = "";
        return textStatus.outerHTML;
    }
    this.destroy=function(){
        /*log('Destroying FileUploader');
        document.getElementById(id).removeEventListener('drop', this.dragDrop);
        document.getElementById(id).removeEventListener('dragover', this.dragOver);
        */
    }
}
  
     
function FirstFileE(fileE){
    return fileE.mapE(function(event){ 
        var files = event.target.files || event.dataTransfer.files;    
        return files[0];
    });
}
function AuroraBlankFileUpload(fileE, url){
        this.sendLoadStartE = F.zeroE();     
        this.sendProgressE = F.zeroE();     
        this.uploadCompleteE = F.zeroE();                       
}  
function AuroraFileUpload(fileE, url){
    var uploadRequestE = fileE.mapE(function(fileData){
    	var file = fileData.file;
    	var path = fileData.path;
        var xhrObj = new XMLHttpRequest();  
        var upload = (xhrObj.upload!=undefined)?xhrObj.upload:xhrObj;
        var sendLoadStartE = F.extractEventE(upload, 'loadstart');     
        var sendProgressE = F.extractEventE(upload, 'progress');     
        var uploadCompleteE = F.receiverE();
            
        var parent = this;
        xhrObj.onreadystatechange = function(){
                    if (xhrObj.readyState == 4) {
                        if (xhrObj.status == 200) {                                                                                   
                            uploadCompleteE.sendEvent(jQuery.parseJSON(xhrObj.responseText));
                        }
                    }
        };
            if(file==NOT_READY){
                return;
            }
            if(file.currentFile!=undefined){
                file = file.currentFile;
            } 
        
            
        if(path!=undefined && path!=""){
        	path = "?path="+path;
        }
        else{
        	path = "";
        }
        
        xhrObj.open("POST", url+path, true);  
        xhrObj.setRequestHeader("Content-type", file.type);  
        xhrObj.setRequestHeader("X_FILE_NAME", file.name);  
        xhrObj.send(file);                 
        return {sendLoadStartE: sendLoadStartE, sendProgressE: sendProgressE, uploadCompleteE: uploadCompleteE};     
    });
        //Not happy about this recreate xmlhttpreq and then switch, but i had problems with reusing one xmlhttprequest object
    this.uploadCompleteE = uploadRequestE.mapE(function(uploadRequest){return uploadRequest.uploadCompleteE}).switchE();
    this.sendLoadStartE = uploadRequestE.mapE(function(uploadRequest){return uploadRequest.sendLoadStartE}).switchE();
    this.sendProgressE = uploadRequestE.mapE(function(uploadRequest){return uploadRequest.sendProgressE}).switchE();
}  
WIDGETS.register("FileUploaderDragDropWidget", FileUploaderDragDropWidget);

function AuroraFileBrowserWidget(instanceId,data){
    data.targetId = instanceId+"_dropZone";
    var uploadWidget = new FileUploaderDragDropWidget(instanceId+"_dnd",data); 
    this.loader=function(){ 
          uploadWidget.loader();
         var directoryR = DATA.getRemote("aurora_directory", "resources/upload/"+window['SETTINGS']['user']['id']+"/", NOT_READY, POLL_RATES.SLOW);  //, NOT_READY, POLL_RATES.SLOW 
         var directoryB = directoryR.behaviour;
         
         var tableResetE = F.receiverE();
         
         uploadTotalProgressB = F.mergeE(uploadWidget.totalProgressB.changes().blindE(500), tableResetE).startsWith(NOT_READY);
         
         var filesTableB = F.liftBI(function(table, progress){
            if(table==NOT_READY){
                return NOT_READY;
            }     
            var currentMatch = false;
            if(progress!=NOT_READY&&progress!=undefined){ 
                var queue = progress.queue;
                var currentFile = progress.currentFile;  
                var progressIndex = getColumnIndex(table, "uploadprogress"); 
                var newTable = table["DATA"];
                if(queue.length>0){
                    currentMatch = false;
                    for(var queueIndex in queue){
                        var queueItem = queue[queueIndex]; 
                        var match = false;
                        for(var tableIndex in newTable){
                            var tableRow = newTable[tableIndex];
                            var filename = tableRow[getColumnIndex(table, "filename")];
                            var currentProgress = tableRow[progressIndex];
                            if(filename==queueItem.name && (currentProgress!=""&& currentProgress!=undefined)){
                                match = true;
                            }       
                            
                            //TODO: sometimes FF will crash with lots of files
                            if(currentProgress!=""&&currentProgress!=undefined){
                            
                                if(currentFile.name==filename){
                                    newTable[tableIndex] = [currentFile.type, currentFile.name, currentFile.name, "", currentFile.size, currentFile.type, Math.ceil(progress.filePercentageComplete)];
                                    currentMatch = true;
                                    
                                }
                                else if(!isNaN(table["DATA"][tableIndex][progressIndex])){
                                    table["DATA"][tableIndex][progressIndex] = 100;    
                                }
                            }                                                   
                        }
                        if(!match){
                            newTable.push([queueItem.type, queueItem.name, queueItem.name, "", queueItem.size, queueItem.type, (queueItem.name==currentFile.name)?Math.ceil(progress.filePercentageComplete):"Waiting..."]);
                        }
                    }
                    if(!currentMatch){
                        newTable.push([currentFile.type, currentFile.name, currentFile.name, "", currentFile.size, currentFile.type, Math.ceil(progress.filePercentageComplete)]);
                    }              
                    
                    
                }
                else{
                    var match = false;
                    for(var tableIndex in newTable){
                        var tableRow = newTable[tableIndex];
                        var filename = tableRow[getColumnIndex(table, "filename")];
                        var currentProgress = tableRow[progressIndex];
                        if(currentProgress!=""&& currentProgress!=undefined){
                            if(filename==currentFile.name){
                                newTable[tableIndex] = [currentFile.type, currentFile.name, currentFile.name, "", currentFile.size, currentFile.type, Math.ceil(progress.filePercentageComplete)];
                                match = true;
                            }      
                            else if(!isNaN(table["DATA"][tableIndex][progressIndex])){
                                    table["DATA"][tableIndex][progressIndex] = 100;    
                            }
                        }
                    }
                    if(!match){
                        newTable.push([currentFile.type, currentFile.name, currentFile.name, "", currentFile.size, currentFile.type, Math.ceil(progress.filePercentageComplete)]); 
                    }
                    
                }   
                //Remove old uploads
                for(var tableIndex in newTable){
                    var tableRow = newTable[tableIndex];
                    var currentProgress = tableRow[getColumnIndex(newTable, "uploadprogress")]; 
                    if(currentProgress!="" && currentProgress!=undefined){
                        var match = false; 
                        for(var queueIndex in queue){
                            var queueItem = queue[queueIndex];
                            if(filename==queueItem.name){
                                match = true;
                                break;
                            }
                        }
                        if(!match || Math.ceil(currentProgress)==100){
                            tableRow = tableRow.splice(tableIndex, 1);         
                        }
                    }
                } 
            } 
            else{
                for(var rowIndex in table["DATA"]){   
                    table["DATA"][rowIndex][progressIndex] = "";
                } 
            }  
              
            var filenameIndex = getColumnIndex(table, "filename");
            var typeIndex = getColumnIndex(table, "type");
            var filesizeIndex = getColumnIndex(table, "filesize");
            var uploadProgressIndex = progressIndex;
            
            
            
            var filenameSorter = function(row1, row2){
                if((row1[typeIndex]=="directory"||row2[typeIndex]=="directory") && (row1[typeIndex]!=row2[typeIndex])){   //XOR
                    return (row1[typeIndex]=="directory")?-1:1;
                }
                return row1[filenameIndex].localeCompare(row2[filenameIndex]);
            };
            table.TABLEMETADATA['sortColumn'] = filenameIndex;
            table.TABLEMETADATA['sortOrder'] = "DESC";
            if(table.COLUMNMETADATA[filenameIndex]==undefined){
                table.COLUMNMETADATA[filenameIndex] = {"sorter":filenameSorter};
            }
            else{
                table.COLUMNMETADATA[filenameIndex]["sorter"] = filenameSorter;   
            }
            if(table.COLUMNMETADATA[filesizeIndex]==undefined){
                table.COLUMNMETADATA[filesizeIndex] = {"renderer":new FileSizeRendererColumn()};
            }
            else{  
                table.COLUMNMETADATA[filesizeIndex]["renderer"] = new FileSizeRendererColumn();
            }
            if(table.COLUMNMETADATA[typeIndex]==undefined){
                table.COLUMNMETADATA[typeIndex] = {"renderer":new FileTypeRendererColumn()};
            }
            else{ 
                table.COLUMNMETADATA[typeIndex]["renderer"] = new FileTypeRendererColumn();
            }
            
            if(table.COLUMNMETADATA[uploadProgressIndex]==undefined){
                table.COLUMNMETADATA[uploadProgressIndex] = {"renderer":new UploadProgressColumnRenderer()};
            }
            else{ 
                table.COLUMNMETADATA[uploadProgressIndex]["renderer"] = new UploadProgressColumnRenderer();
            }
            return table;   
         },
         function(table){
            return [table, NOT_READY];
         }, directoryB, uploadTotalProgressB);         
         tableBI = TableWidgetB(instanceId+"_table", data, filesTableB);      
         F.insertDomB(tableBI, instanceId+"_container");  
        
         tableBI.liftB(function(table){
            if(!good()){
                return NOT_READY;
            }
            var width = table.scrollWidth;
            DOM.get(instanceId+"_downloadQueue").style.width=width+"px";
         }); 
         
         uploadWidget.totalProgressB.liftB(function(uploadProgress){
            if(!good()){
                return NOT_READY;
            }                                              
            var updateCallback = function(){
                jQuery("#"+instanceId+"_totalProgress").progressbar("value", uploadProgress.queuePercentageComplete).children('.ui-progressbar-value').html("("+uploadProgress.queuePercentageComplete.toPrecision(3)+"%)").css("display", "block"); 
                
            };

            if(DOM.get(instanceId+"_downloadQueue").style.display=="none"){
                jQuery("#"+instanceId+"_totalProgress").progressbar({value:0});
                jQuery("#"+instanceId+"_downloadQueue").slideDown(300, updateCallback);
            }
            else{
                updateCallback();
            }
         });  
         
         uploadWidget.totalProgressB.blindB(1000).liftB(function(uploadProgress){
            if(!good()){
                return NOT_READY;
            }   
            DOM.get(instanceId+"_currentFile").innerHTML = "";                                            
            if(uploadProgress.rate!="0"){
                
            DOM.get(instanceId+"_rate").innerHTML = "Transferring "+uploadProgress.formattedTotal+" at "+uploadProgress.rate;
            }
         });
         uploadWidget.allUploadsCompleteE.mapE(function(uploadComplete){
            jQuery("#"+instanceId+"_totalProgress").progressbar("value", 100);   
            DOM.get(instanceId+"_currentFile").innerHTML = "Upload Complete";
            tableResetE.sendEvent(NOT_READY);
         }).delayE(3000).mapE(function(){jQuery("#"+instanceId+"_downloadQueue").slideUp(1000);});
         
         
         uploadWidget.dropE.mapE(function(drop){   

         }); 
         
          
    }
    this.build=function(){
        
        return "<div id=\"logger\"></div><span id=\""+instanceId+"_dropZone\" style=\"background-color: #FF0000;\"><span id=\""+instanceId+"_container\">&nbsp;</span><div id=\""+instanceId+"_downloadQueue\" style=\"display:none\"><div id=\""+instanceId+"_innerDownloadQueue\" class=\"auroraUploadQueue\"><div id=\""+instanceId+"_currentFile\"></div><div id=\""+instanceId+"_rate\"></div><div id=\""+instanceId+"_fileProgress\"></div><div id=\""+instanceId+"_totalProgress\"></div></div><span style=\"clear: both;\"></span></div></span>";  
    }
    this.destroy=function(){
        uploadWidget.destroy(); 
    }
}
WIDGETS.register("AuroraFileBrowserWidget", AuroraFileBrowserWidget);

function AuroraUploadManager(args){
   
    // sendLoadStartE sendProgressE  uploadCompleteE
    var queue = new AuroraTaskQueue();
    var uploader = new AuroraFileUpload(queue.dequeueEventE, window['SETTINGS']['scriptPath']+"request/aurora.uploader");     
    this.getUploader = function(){
        return uploader;
    };
    this.add = function(upload, path){
    	if(path==undefined&&args!=undefined&&args.path!=undefined){
    		path = args.path;
    	}
        queue.enqueue({file: upload, path: path});
    };
    this.progressUpdateE = uploader.sendProgressE.mapE(function(progress){
        return progress;
    });
    this.uploadCompleteE = uploader.uploadCompleteE.mapE(function(upload){
        queue.next();
        return upload;
    });
    this.allUploadsCompleteE = queue.finishedE.mapE(function(complete){
        return complete;
    });
    
    
    this.uploadStartedE = queue.kickstartE;   
    
    this.dequeueEventE = queue.dequeueEventE;    
    var lastStamp = undefined;
    var lastBytes = undefined;  
    this.progressUpdateB = F.liftB(function(allQueue, queue, progressUpdate, currentItem){
        if(!good()){
            return NOT_READY;                             
        }   
        var currentFile = currentItem.file;
        var path = currentFile.path;
        log(currentItem);
        var totalSize = 0;
        var totalTransfered = progressUpdate.loaded;
        for(index in allQueue){    
            var file = allQueue[index].file;  
            var name = file.name;
            var size = file.size;
            totalSize+=size;
            if(name==currentFile.name){
                continue;
            } 
            var match = false;
            for(index in queue){
                if(queue[index].file.name == name){
                    match=true;
                    break;
                }
            }
            if(!match){
                totalTransfered+=size;    
            }
        }
    stamp = new Date().getTime();
    var rate = 0;
    
    
    if(lastStamp!=undefined){
        var timeDiff = (stamp-lastStamp)/1000;
        var bytesDiff = (totalTransfered-lastBytes);
        if(bytesDiff>0){
            rate = (bytesDiff*8)/timeDiff;
            
            if(rate>1000000000000){
                rate = (rate/1000000000000).toFixed(2)+" Tbps";    
            }
            else if(rate>1000000000){
                rate = (rate/1000000000).toFixed(2)+" Gbps";    
            }
            else if(rate>1000000){
                rate = (rate/1000000).toFixed(2)+" Mbps";    
            }
            else if(rate>1000){
                rate = (rate/1000).toFixed(2)+" Kbps";    
            }
            else rare = rate+" Bps"
        }
    }    
    var formattedTotal = totalSize;
            if(totalSize>1000000000000){
                formattedTotal = (totalSize/1000000000000).toFixed(2)+" TB";    
            }
            else if(totalSize>1000000000){
                formattedTotal = (totalSize/1000000000).toFixed(2)+" GB";    
            }
            else if(totalSize>1000000){
                formattedTotal = (totalSize/1000000).toFixed(2)+" MB";    
            }
            else if(totalSize>1000){
                formattedTotal = (totalSize/1000).toFixed(2)+" KB";    
            }
            else formattedTotal = totalSize+" Bps";
            
    lastBytes = totalTransfered;
    lastStamp = stamp;
    var ob = {total:totalSize, loaded:totalTransfered, currentTotal:progressUpdate.total, currentLoaded:progressUpdate.loaded, currentFile:currentFile, rate: rate, queue:queue, formattedTotal:formattedTotal};
    return ob;
    }, queue.jobQueueE.startsWith(NOT_READY), queue.queueB, this.progressUpdateE.startsWith(NOT_READY), this.dequeueEventE.startsWith(NOT_READY));
    
    
}




/**
 *  FileSizeRendererColumn
 * @constructor
 */
function UploadProgressColumnRenderer(){
    this.getCellRenderer = function(value, cell, width){
        if(cell==undefined){
            return null;
        }       
        return new UploadProgressCellRenderer(value, cell, width);    
    }
}
/**
 *  UploadProgressCellRenderer
 * @constructor
 */
function UploadProgressCellRenderer(value, cell, width){    
    var rValue = value; 
    var container = DOM.createDiv(undefined,undefined,"UploadProgressCellRenderer");
    cell.appendChild(container);
    
    this.render = function(){         
        if(rValue=="" || isNaN(rValue)){
            container.innerHTML = rValue;
        }
        else{
            jQuery(container).each(function() {
                jQuery(this).progressbar({
                    value: rValue
                }).children('.ui-progressbar-value').html("("+rValue.toPrecision(3)+"%)").css("display", "block");

            });
        }  
    }
    this.render();
    this.getValue = function(){
        return rValue;
    }
    this.renderEditor = function(){
         
    }
    this.setSelected = function(selected){ 
        if(selected){
            cell.className="TableWidgetCellSelected"; 
           // cell.style.backgroundColor=tableBackgroundColorSelected; 
        }                                  
        else{
            cell.className="TableWidgetCell"; 
            //cell.style.backgroundColor=tableBackgroundColor; 
        }
    }
    this.setValue = function(newValue){
        rValue = newValue;
        this.render();
    }
    this.getUpdateEvent = function(){
        return F.zeroE();
    }
     
}
function pushToValidationGroupBehaviour(key, validationGroupB, val){                    
    log(arguments);
	if(val==NOT_READY)
        return;
    var validationGroup = validationGroupB.valueNow();
    validationGroup[key] = val;
    validationGroupB.sendEvent(validationGroup);
}
function PhoneNumbersWidget(instanceId, data){
    this.instanceId = instanceId;
    this.loader=function(){  
    	var valueName = (data.name==undefined)?"ContactNumbers":data.name;
    	var line = "<input type=\"text\" /><select><option>Mobile</option><option>Home</option><option>Work</option></select><span class=\"button\">Add Number</span>";
    	var columns = [{"reference": "behaviour", "display": "Number", "type": "string", "visible":true, "readOnly": false},
    	               {"reference": "behaviour", "display": "Type", "type": "string", "visible":true, "readOnly": false}];
    	var tableB = F.receiverE().startsWith({"DATA": [["",""]], "COLUMNS": columns, "TABLEMETADATA": {"permissions": {"canAdd": true, "canDelete": true, "canEdit": true}}, "ROWMETADATA": [], "CELLMETADATA": [[]], "COLUMNMETADATA": []});
    	var tableBI = F.liftBI(function(table){
             var renderer = new BasicSelectCellRendererContainer([{"display": "Mobile", value: "Mobile"}, {"display": "Home", "value": "Home"}, {"display": "Work", "value": "Work"}]);
             table.COLUMNMETADATA[1] = {"renderer": renderer};  
    		return table;
    	}, function(table){return [table];}, tableB);
    	F.insertDomB(TableWidgetB(instanceId+"_table", data, tableBI), instanceId+"_container");
    	
    	var formGroupB = DATA.get(data.formGroup, undefined, {});
        var widgetValueB = F.liftB(function(table){
            if(!good()){
            	return {value: table.DATA, valid: false, name: valueName};
            }
            return {value: table, valid: (table.DATA.length>0&&table.DATA[0].length>0&&table.DATA[0][0].length>0), name: valueName};
        },tableBI);
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB); 
    }                    
    this.build=function(){
        return "<div id=\""+instanceId+"_container\"></div>";   //"+scriptPath+"themes/"+theme+"/loading_s.gif
    }
} 
function EmailConfirmer(instanceId, data){
    var id = "emailConfirmer_"+instanceId;     
    this.instanceId = instanceId;
    this.loader=function(){  
    	var manualSetB = DATA.getB(data.name+"_man");
    	var userDefault = (data.userDefault==undefined)?false:data.userDefault;
    	var valueName = (data.name==undefined)?"Email":data.name;
    	var allowBlank = (data.allowBlank==undefined)?false:data.allowBlank;
        
        if(userDefault){
        	var currentUserB = DATA.getRemote("aurora_current_user").behaviour; 
        	currentUserB.liftB(function(user){
				if(!good()){
					return NOT_READY;
				}
				DOM.get(data.target).value = user.email;
				manualSetB.sendEvent({value: user.email, valid: true, name: valueName});
			});
        	
        }
        
        var emailBlurE = F.extractEventE(data.target, 'blur');
        var emailValueB = F.extractValueB(data.target);
        var emailRequestB = emailBlurE.snapshotE(emailValueB).mapE(function(text){return {email: ""+text};}).startsWith(NOT_READY);
        var emailValidE = getAjaxRequestB(emailRequestB, SETTINGS['scriptPath']+"request/form_validator_check_email/").mapE(function(data){return data.valid;});
        var emailValidB = emailValidE.startsWith(NOT_READY);
        var formGroupB = DATA.get(data.formGroup, undefined, {});
        var widgetValueB = F.liftB(function(emailValid, emailValue, manualSet){
        	if((emailValue==NOT_READY&&manualSet!=NOT_READY)||(manualSetB.firedAfter(emailValueB))){
        		return manualSet;
            }
            if(allowBlank&&emailValue==''){
            	return {value: emailValue, valid: true, name: valueName};	
            }
        	if(emailValid==NOT_READY){
        		return NOT_READY;
        	}
            return {value: emailValue, valid: emailValid, name: valueName};
        },emailValidB, emailValueB, manualSetB);
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB); 
        
        widgetValueB.liftB(function(widgetValueB){
        	if(widgetValueB==NOT_READY){
        		document.getElementById(data.target).className = 'form_validator_validInput';
                
        	}
        	else {
        		document.getElementById(data.target).className = (widgetValueB.valid)?'form_validator_validInput':'form_validator_invalidInput';
        		document.getElementById(id).src = (widgetValueB.valid)?window['SETTINGS']['theme']['path']+'tick.png':window['SETTINGS']['theme']['path']+'cross.png';
        	}
            }); 
        emailBlurE.mapE(function(){document.getElementById(id).src=SETTINGS['themeDir']+'loading_s.gif';});                                                                           
    }                    
    this.build=function(){
        return "<img src=\"/resources/trans.png\" alt=\"\" class=\"loadingSpinner\" id=\""+id+"\" />";   //"+scriptPath+"themes/"+theme+"/loading_s.gif
    }
}        
function ValidatedSubmitButton(instanceId, data){
    this.elementId = instanceId+'_submit';  
    this.loader=function(){
        var formGroupB = DATA.get(data.formGroup, undefined, {});
        var groupValidB = formGroupB.liftB(function(validationMap){
            //seperate validation behaviour from value beahviour
            return F.liftB.apply(this,[function(){
            	var trueCount=0;
            	log("Submit Buton");
            	log(arguments);
                for(index in arguments){
                	if(!arguments[index].valid){
                        
                        return false;
                    }
                    else{
                        //log("TRUE");
                    }
                    trueCount++;
                }
                return true;
            }].concat(getObjectValues(validationMap)));
        }).switchB();
        //var groupValidB = F.receiverE().startsWith(NOT_READY);
        var elementId = this.elementId;
        jQuery("#"+elementId).button();
        groupValidB.liftB(function(valid){
        	jQuery("#"+elementId).button((valid)?'enable':'disable');
        });
    }
    this.build=function(){
        return "<input type=\"submit\" value=\"Submit\" id=\""+this.elementId+"\" />";       
    }    
}
function ValidatedTextBox(instanceId, data){;
    this.instanceId = instanceId;
    this.loader=function(){    
    	var manualSetB = DATA.getB(data.name+"_man");
    	var valueName = (data.name==undefined)?"Email":data.name; 
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var txtValueB = F.extractValueB(this.instanceId);
       
        var validB = txtValueB.liftB(function(text){
            if(data.minChars && text.length<data.minChars)
                return false;
            if(data.maxChars && text.length>data.maxChars)
                return false;
            return true;
        });
        var widgetResponseB = F.liftB(function(valid, text, manualSet){//
        	if((text==NOT_READY&&manualSet!=NOT_READY)||(manualSetB.firedAfter(txtValueB))){
        		return manualSet;
             }
        	if(valid==NOT_READY||text==NOT_READY||text==null){
            	return NOT_READY;
            }
            
            document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {value: text, valid: valid, name: valueName};
        }, validB, txtValueB, manualSetB);//  
        
        //pushToValidationGroupBehaviour(instanceId, validationGroupB, validB);
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetResponseB);  
    }      
    this.build=function(){
        var size = (data.size==undefined)?"":" size=\""+data.size+"\"";
        return "<input type=\"text\" value=\"\" id=\""+this.instanceId+"\" "+size+" />";                   //disabled=\"disabled\"
    }
}     

function ValidatedSelectField(instanceId, data){;
    this.instanceId = instanceId;
    this.loader=function(){    
        var valueName = (data.name==undefined)?"SelectField":data.name; 
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var selectValueB = F.extractValueB(this.instanceId);
        var validB = selectValueB.liftB(function(text){
            return true;
        });
        var widgetResponseB = F.liftB(function(valid, text){
            if(!good()||text==null){
                return NOT_READY;
            }
            document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {value: text, valid: valid, name: valueName};
        }, validB, selectValueB);  
        
        //pushToValidationGroupBehaviour(instanceId, validationGroupB, validB);
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetResponseB);  
    }      
    this.build=function(){
        var select = DOM.create('select');
        select.id = this.instanceId;
        for(index in data.options){
            select.appendChild(DOM.createOption(this.instanceId+"_"+index, undefined, data.options[index]+"", index+""));
        }
        return select;         
    }
} 
                                  
function ValidatedTextArea(instanceId, data){
    this.instanceId = instanceId;
    this.loader=function(){      
    	//log("TEXTAREA");
    	var valueName = (data.name==undefined)?"TextArea":data.name;
    	//log(valueName);
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var txtValueB = F.extractValueB(this.instanceId);
        
        var manualSetB = DATA.getB(data.name+"_man");
        manualSetB.liftB(function(manualSet){
        	
        	//log("manualSetB CHANGE ");
        	//log(manualSet);
        });
        
        
        
        var validB = txtValueB.liftB(function(text){
            if(data.minChars && text.length<data.minChars)
                return false;
            if(data.maxChars && text.length>data.maxChars)
                return false;
            return true;
        });
        var widgetValueB = F.liftB(function(valid, text, manualSet){
        	if(manualSetB.firedAfter(txtValueB)){
        		return manualSet;
            }
        	if(text==NOT_READY||text==null||valid==NOT_READY){
                return NOT_READY;
            }
            
            document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {valid: valid, value: text, name: valueName};
        }, validB,txtValueB,manualSetB);  
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);    
    }      
    this.build=function(){
        var cols = 10;
        if(data.cols)
            cols = data.cols;
        var rows = 5;
        if(data.rows)
            rows = data.rows;
        return "<textarea type=\"text\" id=\""+this.instanceId+"\" rows=\""+rows+"\" cols=\""+cols+"\"></textarea>";       
    }
}                                              
function ValidatedCheckBox(instanceId, data){   
    this.instanceId = instanceId;
    this.loader=function(){
        var valueName = (data.name==undefined)?"Checkbox":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var validB = jQuery("#"+instanceId+"_checkbox").fj('jQueryBind', 'change').mapE(function(event){
            return DOM.get(instanceId+"_checkbox").checked;
        }).startsWith(false);
        var widgetValueB = F.liftB(function(valid){
            if(!good()){
                return NOT_READY;
            }
            //DOM.get(instanceId).className = ((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {valid: valid, value: valid, name: valueName};
        },validB);  
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);   
    }      
    this.build=function(){
        return "<span id=\""+instanceId+"\"><input type=\"checkbox\" id=\""+this.instanceId+"_checkbox\" /></span>";       
    }
}

function ValidatedPasswordWidget(instanceId, data){
    this.instanceId = instanceId;
    this.loader=function(){       
        
    	var manualSetB = DATA.getB(data.name+"_man");
    	
    	var valueName = (data.name==undefined)?"Password":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var txtValue1B = F.extractValueB(this.instanceId+"_pass1");
        var txtValue2B = F.extractValueB(this.instanceId+"_pass2");
        
        var validB = F.liftB(function(text1, text2){
            if(!good()||(text1.length==0||text2.length==0)){
                return NOT_READY;
            }
            if(data.minChars && text1.length<data.minChars)
                return false;
            if(data.maxChars && text1.length>data.maxChars)
                return false;
            if(data.minChars && text2.length<data.minChars)
                return false;
            if(data.maxChars && text2.length>data.maxChars)
                return false;
            if(text1!=text2)
                return false;
            return true;
        }, txtValue1B, txtValue2B);
        var widgetValueB = F.liftB(function(valid, text, manualSet){
        	if((txtValue1B==NOT_READY&&manualSet!=NOT_READY)||(manualSetB.firedAfter(txtValue1B))){
        		return manualSet;
             }
        	if(!good()||text==null){
                return {valid: false, value: "", name: valueName};
            }
            document.getElementById(instanceId+"_pass1").className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            document.getElementById(instanceId+"_pass2").className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput'); 
            document.getElementById(instanceId+"_tick").src = (valid)?window['SETTINGS']['theme']['path']+'tick.png':window['SETTINGS']['theme']['path']+'cross.png';
            //log({valid: valid, value: text, name: valueName});
            return {valid: valid, value: text, name: valueName};
        },validB,txtValue1B, manualSetB);  
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);    
    }             
    this.build=function(){
        return "<input type=\"password\" id=\""+this.instanceId+"_pass1\" />&nbsp;<img src=\"/resources/trans.png\" alt=\"\" class=\"loadingSpinner\" id=\""+this.instanceId+"_tick\" /><br /><input type=\"password\" id=\""+this.instanceId+"_pass2\" />";       
    }
}
function ValidatedCalendar(instanceId, data){
    this.instanceId = instanceId;
    this.inputId = instanceId+"_input"   
    
    this.loader=function(){       
        var formGroupB = DATA.get(data.formGroup, undefined, {});  
        var valueName = (data.name==undefined)?"Email":data.name;
        var dateE = F.receiverE();
        var dateB = dateE.startsWith(null);
        var validB = dateB.liftB(function(val){return val!=null});
        jQuery("#"+instanceId).datepicker({changeYear: true,yearRange:"-110:+0", onSelect: function(dateText, inst) {dateE.sendEvent(dateText);}});    
        
        
        var widgetValueB = F.liftB(function(valid, text){
            if(!good()||text==null){
                return NOT_READY;
            }
            
            document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {valid: valid, value: text, name: valueName};
        },validB,dateB);  
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);  
    }      
    this.build=function(){
        return "<span id=\""+instanceId+"\"></span>";//"<input id=\""+this.inputId+"\" type=\"text\">";         
    }
}

        //.onSelect = function(x){alert(x);dateE.sendEvent(x);};
        //jQuery.datepicker._defaults.onSelect = function(text, inst){alert(text)};
       //jQuery("#"+instanceId).fj('jQueryBind', 'change').mapE(function(e){showObj(e);});
        //{onSelect: function(dateText, inst) {formGroup.push(data.name,dateText);}}
        //jQuery("#"+instanceId).fj('jQueryBind', 'onSelect').mapE(function(x){alert(x);});
        //jQuery("#"+instanceId).fj('jQueryBind', 'dateSelected').mapE(function(x){showObj(x);});
        //var calendarB = jQuery("#"+instanceId).fj('extEvtE', 'onSelect').mapE(function(x){alert(x);});
        //var calendarB = jQuery("#"+instanceId).fj('extValB').liftB(function(x){alert(x);});

//widgetTypes['contactFormSubmitButton']=ContactFormSubmitButton;
                                  
WIDGETS.register("ValidatedPasswordWidget", ValidatedPasswordWidget); 
WIDGETS.register("ValidatedSubmitButton", ValidatedSubmitButton);
WIDGETS.register("ValidatedCalendar", ValidatedCalendar);
WIDGETS.register("ValidatedTextArea", ValidatedTextArea);
WIDGETS.register("ValidatedTextBox", ValidatedTextBox);
WIDGETS.register("EmailConfirmer", EmailConfirmer);
WIDGETS.register("ValidatedSelectField", ValidatedSelectField);
WIDGETS.register("ValidatedCheckBox", ValidatedCheckBox);  
WIDGETS.register("PhoneNumbersWidget", PhoneNumbersWidget);  

var minChars = 1;
var maxChars = 30;
function checkCharLength(text){
    if(text.length<1)
        return false;
    if(text.length>30)
        return false;
    return true;
}     
function ValidatedContactForm(instanceId, data){
    var widgetId = instanceId+"_txtArea";                         
    this.instanceId = instanceId;
    this.loader=function(){ 
        var fullnameValidB = F.extractValueB('fullname').liftB(checkCharLength);
        var messageValidB = F.extractValueB('message').liftB(checkCharLength);
        
        var emailBlurE = F.extractEventE('email', 'blur');
        var emailTextChangedB = F.extractValueB('email');
        var emailRequestB = emailBlurE.snapshotE(emailTextChangedB).mapE(function(text){
            return {email: ""+text};
        });
        var emailValidB = getAjaxRequestB(emailRequestB, scriptPath+"request/form_validator_check_email/").mapE(function(data){
            return data.valid;    
        }).startsWith(false);   
          
        var allFieldsValid = F.liftB(function(fullname, message, email){
            return fullname&&message&&email;
        }, fullnameValidB, messageValidB, emailValidB);
        
         var submitClickedE = F.extractEventE('submit', 'click').snapshotE(allFieldsValid).mapE(function(valid){
            if(valid)
                alert("Submit clicked! All fields are valid!");
        });                
                                                                                             
        //Gui Reaction
        F.insertValueB(ifB(fullnameValidB, '#00FF00', '#FF0000'),'fullname', 'style', 'borderColor');
        F.insertValueB(ifB(messageValidB, '#00FF00', '#FF0000'),'message', 'style', 'borderColor');
        F.insertValueB(ifB(emailValidB, '#00FF00', '#FF0000'),'email', 'style', 'borderColor');
        F.insertValueB(ifB(emailValidB, scriptPath+'plugins/form_validator/tick.png', scriptPath+'plugins/form_validator/cross.png'),'emailTick', 'src')
        F.insertValueB(notB(allFieldsValid),'submit', 'disabled');
    }
    this.build=function(){
        return "<table><tr><td>Full Name:</td><td><input type=\"text\" alt=\"\" id=\"fullname\" /></td></tr><tr><td>Email Address:</td><td><input type=\"text\" alt=\"\" id=\"email\" /><img src=\"/resources/trans.png\" id=\"emailTick\" alt=\"\" style=\"vertical-align: middle;\" /></td></tr><tr><td>Message</td><td><textarea alt=\"\" id=\"message\" rows=\"6\" cols=\"45\"></textarea></td></tr><tr><td>&nbsp;</td><td><input type=\"submit\" value=\"Submit\" alt=\"\" id=\"submit\" /></td></tr></table>";
    }
}                 

/*function ValidatedContactFormConfigurator(){
    var id = "IntegerTableWidgetCont";
    this['load'] = function(newData){}
    this['build'] = function(newData){
        var targetName = (newData!=undefined&&newData['targetName']!=undefined)?newData['targetName']:"";
        return "Target Name: <input type=\"text\" id=\""+id+"\" value=\""+targetName+"\" />";  
    }
    this['getData'] = function(){
        return {"targetName": document.getElementById(id).value};
    }
    this['getName'] = function(){
        return "Integer TableWidget";
    }
    this['getDescription'] = function(){
        return "A one or two-dimensional table of integers. WIth controls to add, edit or delete data.";
    }
    this['getPackage'] = function(){
        return "Table";
    }
    //this['getImage'] = function(){
    //    var img = document.createElement("img");
    //    img.src = "plugins/aviat.csrDemo/table.png";
    //    img.alt = "";
    //    return img;
    //}
}  */
WIDGETS.register("ValidatedContactForm", ValidatedContactForm/*, ValidatedContactFormConfigurator*/);




function GenderSelectionWidget(instanceId, data){   
    this.instanceId = instanceId;
    this.loader=function(){
        var valueName = (data.name==undefined)?"Checkbox":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var genderB = F.mergeE(jQuery("#"+instanceId+"_male").fj('jQueryBind', 'change'), jQuery("#"+instanceId+"_female").fj('jQueryBind', 'change')).mapE(function(event){
            return (DOM.get(instanceId+"_male").checked)?"Male":"Female";
        }).startsWith(NOT_READY);
        var validB = genderB.liftB(function(gender){
            return gender!=NOT_READY;
        });
        var widgetValueB = F.liftB(function(valid, gender){
            if(!good()){
                return NOT_READY;
            }
            //DOM.get(instanceId).className = ((valid)?'form_validator_validInput':'form_validator_invalidInput');
            return {valid: valid, value: gender, name: valueName};
        },validB, genderB);  
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);   
    }      
    this.build=function(){
        return "<span id=\""+instanceId+"\">Male: <input type=\"radio\" id=\""+this.instanceId+"_male\" name=\""+this.instanceId+"_radio\" />&nbsp;Female: <input type=\"radio\" id=\""+this.instanceId+"_female\" name=\""+this.instanceId+"_radio\" /></span>";       
    }
}
WIDGETS.register("GenderSelectionWidget", GenderSelectionWidget);

function CreditCardInputWidget(instanceId, data){   
    this.instanceId = instanceId;
    this.loader=function(){
        var valueName = (data.name==undefined)?"CardData":data.name;
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 

        var cc1B = F.extractValueE(instanceId+"_cc1").startsWith(NOT_READY);       
        var cc1NumericB = cc1B.liftB(function(cc1){return jQuery.isNumeric(cc1);});
        var cc2B = F.extractValueE(instanceId+"_cc2").startsWith(NOT_READY);
        var cc2NumericB = cc2B.liftB(function(cc2){return jQuery.isNumeric(cc2);});
        var cc3B = F.extractValueE(instanceId+"_cc3").startsWith(NOT_READY);
        var cc3NumericB = cc3B.liftB(function(cc3){return jQuery.isNumeric(cc3);});
        var cc4B = F.extractValueE(instanceId+"_cc4").startsWith(NOT_READY);
        var cc4NumericB = cc4B.liftB(function(cc4){return jQuery.isNumeric(cc4);});
        
        F.insertValueB(F.ifB(cc1NumericB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_cc1", 'className');
        F.insertValueB(F.ifB(cc2NumericB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_cc2", 'className');
        F.insertValueB(F.ifB(cc3NumericB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_cc3", 'className');
        F.insertValueB(F.ifB(cc4NumericB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_cc4", 'className');
        
        var visaClickedB = F.extractEventE(instanceId+"_visa", "click").startsWith(NOT_READY);
        var masterCardClickedB = F.extractEventE(instanceId+"_mastercard", "click").startsWith(NOT_READY);
        var cardTypeB = F.liftB(function(visaClicked, masterCardClicked){
        	if(visaClicked==NOT_READY && masterCardClicked==NOT_READY){
        		return NOT_READY;
        	}
        	else if(visaClicked!=NOT_READY && masterCardClickedB==NOT_READY || visaClickedB.firedBefore(masterCardClickedB)){
        		return "Visa";
        	}
        	return "MasterCard";
        }, visaClickedB, masterCardClickedB);
        
        var expiryMonthB = F.extractValueE(instanceId+"_expiry_month").startsWith(NOT_READY);
        var expiryYearB = F.extractValueE(instanceId+"_expiry_year").startsWith(NOT_READY);
        
        var cscNumberB = F.extractValueE(instanceId+"_csc").startsWith(NOT_READY);
        var cscNumberValidB = cscNumberB.liftB(function(cscNumber){return jQuery.isNumeric(cscNumber);});
        F.insertValueB(F.ifB(cscNumberValidB, 'form_validator_validInput', 'form_validator_invalidInput'),instanceId+"_csc", 'className');
        
        var widgetValueB = F.liftB(function(cc1, cc2, cc3, cc4, cardType, expiryMonth, expiryYear, cscNumber){
        	if(!good()){
        		return NOT_READY;
        	}
        	var valid = (jQuery.isNumeric(cscNumber)) && (jQuery.isNumeric(expiryMonth)) && (jQuery.isNumeric(expiryYear)) && (jQuery.isNumeric(cc1)&&cc1.length==4) && (jQuery.isNumeric(cc2)&&cc2.length==4) && (jQuery.isNumeric(cc3)&&cc3.length==4) && (jQuery.isNumeric(cc4)&&cc4.length==4);
        	return {valid: valid, value: cardType+" "+cc1+cc2+cc3+cc4+" "+expiryMonth+"/"+expiryYear+" "+cscNumber, name: valueName};
        }, cc1B, cc2B, cc3B, cc4B, cardTypeB, expiryMonthB, expiryYearB, cscNumberB);
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);   
    }      
    var getSelectBoxRange = function(id, start, len, addFirstStr){
    	var html = "<select id=\""+id+"\">";
    	if(addFirstStr!=undefined){
    		html+="<option value=\""+addFirstStr+"\">"+addFirstStr+"</option>";
    	}
    	for(i=start;i<start+len;i++){
    		html+="<option value=\""+i+"\">"+i+"</option>";
    	}
    	html+="</select>";
    	return html;
    }
    this.build=function(){
        return "Card Type<br />" +
        		"Visa <input type=\"radio\" id=\""+instanceId+"_visa\" name=\""+instanceId+"_radio\" /><br />" +
        		"Mastercard <input type=\"radio\" id=\""+instanceId+"_mastercard\" name=\""+instanceId+"_radio\" /><br />" +
        		"<input id=\""+instanceId+"_cc1\" type=\"\" maxlength=\"4\" size=\"4\" /><input id=\""+instanceId+"_cc2\" type=\"\" maxlength=\"4\" size=\"4\" /><input id=\""+instanceId+"_cc3\" type=\"\" maxlength=\"4\" size=\"4\" /><input id=\""+instanceId+"_cc4\" type=\"\" maxlength=\"4\" size=\"4\" /><br />" +
        		"Expiry "+getSelectBoxRange(instanceId+"_expiry_month", 1, 12, "--")+"/"+getSelectBoxRange(instanceId+"_expiry_year", 2012, 5, "--")+"<br />" +
        		"CSC Number <input type=\"text\" id=\""+instanceId+"_csc\" size=\"5\" maxlength=\"5\" />";
    }
}
WIDGETS.register("CreditCardInputWidget", CreditCardInputWidget);



/*Object {username: "Zysen", firstname: "Jay", lastname: "Shepherd", group_id: "3", email: "jay@zylex.net.nz"…}
avatar: ""
email: "jay@zylex.net.nz"
firstname: "Jay"
group_id: "3"
lastname: "Shepherd"
username: "Zysen"*/



function ValidatedUserWidget(instanceId, data){
	var id = instanceId+"_container";
	var valueName = "user";
	this.loader=function(){       
		if(data.targetId!=undefined){
			display = DOM.get(data.targetId).style.display;
		}
        var formGroupB = DATA.get(data.formGroup, undefined, {});  
        var widgetValueB = F.liftB(function(user){
            if(!good()){
                return NOT_READY;
            }
            if(data.targetId!=undefined){
            	DOM.get(data.targetId).style.display=(user.group_id==1)?'':'none';
            }
            return {valid: user.group_id!=1, value: "USER", name: valueName};
        },userB);  
        //pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);  
    }      
    this.build=function(){
        return "<span id=\""+instanceId+"\"></span>";      
    }
}
WIDGETS.register("ValidatedUserWidget", ValidatedUserWidget);

function UserFullNameInput(instanceId, data){
    this.instanceId = instanceId;
    this.inputId = instanceId+"_input"   
    var visible = (data.visible==undefined)?true:data.visible;
    this.loader=function(){       
        var formGroupB = DATA.get(data.formGroup, undefined, {});  
        var valueName = (data.name==undefined)?"SchoolName":data.name;
        
        
        var currentUserB = DATA.getRemote("aurora_current_user").behaviour;        

        var widgetValueB = currentUserB.liftB(function(user){
            if(!good()){
            	DOM.get(instanceId+"_input").className = 'form_validator_invalidInput';
                return {valid: false, value: "", name: valueName};
            }
            
            DOM.get(instanceId+"_input").className = 'form_validator_validInput';
            DOM.get(instanceId+"_input").value = user.firstname+" "+user.lastname;
            return {valid: true, value: user.firstname+" "+user.lastname, name: valueName};
        });  
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);  
    }      
    this.build=function(){
        return "<input id=\""+instanceId+"_input\" type=\""+(visible?'text':'hidden')+"\" />";//"<input id=\""+this.inputId+"\" type=\"text\">";         
    }
}
WIDGETS.register("UserFullNameInput", UserFullNameInput);

function UserEmailInput(instanceId, data){
    this.instanceId = instanceId;
    this.inputId = instanceId+"_input"   
    var visible = (data.visible==undefined)?true:data.visible;
    this.loader=function(){       
        var formGroupB = DATA.get(data.formGroup, undefined, {});  
        var valueName = (data.name==undefined)?"SchoolName":data.name;
        
        
        var currentUserB = DATA.getRemote("aurora_current_user").behaviour;        

        var widgetValueB = currentUserB.liftB(function(user){
            if(!good()){
            	DOM.get(instanceId+"_input").className = 'form_validator_invalidInput';
                return {valid: false, value: "", name: valueName};
            }
            
            DOM.get(instanceId+"_input").className = 'form_validator_validInput';
            DOM.get(instanceId+"_input").value = user.email;
            return {valid: true, value: user.email, name: valueName};
        });  
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);  
    }      
    this.build=function(){
        return "<input id=\""+instanceId+"_input\" type=\""+(visible?'text':'hidden')+"\" />";//"<input id=\""+this.inputId+"\" type=\"text\">";         
    }
}
WIDGETS.register("UserEmailInput", UserEmailInput);
function GoogleMapWidget(instanceId, data){
    var mapId = instanceId+"_map";
    var zoom = parseInt(data.zoom);
    this.zoomChangedE = F.receiverE();
    this.centerChangedE = F.receiverE();
    var parent = this;
    this.loader=function(addressB){
        //var scriptLoadedE = loadScriptE("http://maps.googleapis.com/maps/api/js?key=AIzaSyCP1Ej3uTUHUBkzi4Q6F4vujwyWd3ocVNA&sensor=false");
        var addressB = (addressB==undefined)?(data.address!=undefined?F.constantB(data.address):F.constantB({lat: data.lat, lng: data.lng})):addressB;
        var mapB = F.oneE().startsWith(NOT_READY).liftB(function(data){
            if(!good())
                return NOT_READY;
            var map = new google.maps.Map(DOM.get(mapId), {zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP});
            var marker = new google.maps.Marker({
			    position: map.getCenter(),
			    map: map,
			    title: 'Click to zoom'
			  });
            google.maps.event.addListener(map, 'zoom_changed', function() {
				parent.zoomChangedE.sendEvent(map.getZoom());
			});
			
			google.maps.event.addListener(map, 'center_changed', function() {
				parent.centerChangedE.sendEvent(map.getCenter().toString());
			});
			
			
            return map;
        });
        var locationB = geoCodeB(addressB);
        F.liftB(function(map, geocode){
            if(!good())
                return NOT_READY;
           if(geocode.results.length>0){
               if(DOM.get(mapId).style.display=='none'){
                    DOM.get(mapId).style.display = 'inline-block'; 
               }
               log(geocode.results[0].geometry.location.toString());
               
               
               map.panTo(geocode.results[0].geometry.location, zoom);
           }
           else if(geocode.results.lat){
           		map.panTo(new LatLng(geocode.results.lat, geocode.results.lng), zoom);
           }
           else{
           		map.panTo(new LatLng(-41.2864603, 174.77623600000004), zoom);
           }
        }, mapB, locationB);                
    }
    this.build=function(){   
        
        var d = (data.placeholder==undefined)?undefined:getPlaceholderDimensions(data.placeholder);
        var width = (data.placeholder==undefined)?"100%":d.width+d.wUnit;
        var height = (data.placeholder==undefined)?"300px":d.height+d.hUnit;
        return "<span id=\""+mapId+"\" style=\"margin: 0 auto; display: none; width: "+width+"; height: "+height+";\">&nbsp;</span>";
    }
    this.destroy=function(){
    }
}
function GoogleMapWidgetConfigurator(){
	var instanceId = "GoogleMapWidget1";
	var exampleWidget = new GoogleMapWidget(instanceId, {zoom: 10});//placeholder: mapContainer, 
    var addressId = "addressId";
    var parent = this;
    this['load'] = function(newData){
    	var addressB = F.extractValueB(addressId, 'innerHTML').calmB(1000);//F.constantB("26 manuka st, stokes valley, lower hutt")
    	exampleWidget.loader(addressB);
    	parent.zoomChangedB = exampleWidget.zoomChangedE.startsWith(10);
    	parent.centerChangedB = exampleWidget.centerChangedE.startsWith({x: -41.2864603, y:174.77623600000004});
    }
    this['build'] = function(newData){
    	var address = (newData!=undefined&&newData['address']!=undefined)?newData['address']:"";
        var zoom = (newData!=undefined&&newData['zoom']!=undefined)?newData['zoom']:"2";
    	return "<h2>Google Map Widget</h2>"+exampleWidget.build()+
        "<textarea type=\"text\" id=\""+addressId+"\" value=\""+address+"\" rows=\"8\" cols=\"80\">Wellington</textarea>"; 
    }
    this['getData'] = function(){
    	var location = parent.centerChangedB.valueNow().replace('(', '').replace(')', '').replace(' ', '').split(',');
        return {lat: location[0], lng: location[1],"zoom":parent.zoomChangedB.valueNow()};
    }
    this['getName'] = function(){
        return "Google Map";
    }
    this['getDescription'] = function(){
        return "GOogle Map";
    }
    this['getPackage'] = function(){
        return "Google";
    }
}  

function GoogleStreetViewWidget(instanceId, data){
    var mapId = instanceId+"_map";
    var geocoder = new google.maps.Geocoder();
    this.loader=function(){
       var pin = new google.maps.MVCObject();
        var address = data.address;
        var zoom = parseInt(data.zoom);
        var pitch = parseInt(data.pitch);
        var heading = parseInt(data.heading);
        geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
      
        panorama = new google.maps.StreetViewPanorama(document.getElementById(mapId), {
       //navigationControl: false,
       enableCloseButton: false,
       addressControl: false,
       linksControl: false,
       visible: true,
       pov: {heading:heading,pitch:pitch,zoom:zoom},
       position: results[0].geometry.location
      });
      
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });              
    }
    this.build=function(){
       /* return "<div style=\"width: "+data.placeholder.style.width+"; height: "+data.placeholder.style.height+";\" class=\"googleMapSVSurround\"><div id=\""+mapId+"\" class=\"map_canvas\"></div></div>";              */
       return "<div id=\""+mapId+"\" style=\"width: 400px; height: 400px;\">MAP</div>";
    }
    this.destroy=function(){
    }
}  
/**
 *  IntegerTableWidgetConfigurator
 * @constructor
 */
function GoogleStreetViewWidgetConfigurator(){
    var addressId = "addressId";
    var headingId = "headingId";
    var pitchId = "pitchId";
    var zoomId = "zoomId";
    this['load'] = function(newData){}
    this['build'] = function(newData){
        var address = (newData!=undefined&&newData['address']!=undefined)?newData['address']:"";
        var heading = (newData!=undefined&&newData['heading']!=undefined)?newData['heading']:"0";
        var pitch = (newData!=undefined&&newData['pitch']!=undefined)?newData['pitch']:"0";
        var zoom = (newData!=undefined&&newData['zoom']!=undefined)?newData['zoom']:"2";
        return "Address: <input type=\"text\" id=\""+addressId+"\" value=\""+address+"\" /><br />"+
        "Heading: <input type=\"text\" id=\""+headingId+"\" value=\""+heading+"\" /><br />"+
        "Pitch: <input type=\"text\" id=\""+pitchId+"\" value=\""+pitch+"\" /><br />"+
        "Zoom: <input type=\"text\" id=\""+zoomId+"\" value=\""+zoom+"\" /><br />";  
    }
    this['getData'] = function(){
        return {"address": document.getElementById(addressId).value, "heading":document.getElementById(headingId).value, "pitch":document.getElementById(pitchId).value, "zoom":document.getElementById(zoomId).value};
    }
    this['getName'] = function(){
        return "Google Street View";
    }
    this['getDescription'] = function(){
        return "Street View";
    }
    this['getPackage'] = function(){
        return "Google";
    }
}         
WIDGETS.register("googleMapWidget", GoogleMapWidget, GoogleMapWidgetConfigurator);
WIDGETS.register("googleStreetViewWidget", GoogleStreetViewWidget, GoogleStreetViewWidgetConfigurator);                



function geoCodeB(addressB){
    var rec = F.receiverE();
    addressB.liftB(function(address){  
        if(!good())
            return NOT_READY;
        log("Geocoding: "+address);
        if(typeof(address)=='string'){
	        var geocoder = new google.maps.Geocoder();
	        geocoder.geocode( { 'address': address}, function(results, status) {
	            log(status);
	            log(results);
	            rec.sendEvent({results: results, status: status});
	        });
        }
        else{
        	rec.sendEvent({results: address, status: 1});
        }
    });
    
    return rec.startsWith(NOT_READY); 
}

function ImageWidget(instanceId, data, galleryD, galleryB){
    allWidgets[instanceId] = this;
    this.deleteE = receiverE();
    var imageId = instanceId+"_img";
    var img = document.createElement('img');    
    
    this.loader=function(){
        this.deleteE.snapshotE(galleryB).mapE(function(galleries){
            for(index in galleries){                                                                                                                                                                                    
                for(imageId in galleries[index].images){
                    if(galleries[index].images[imageId].upload_id==data.upload_id){
                        galleries[index].images[imageId].deleted=true;
                        galleryD.set(galleries);
                        return;
                    } 
                }
            }

        });
        if(data.rights)
            jQuery(img).contextmenu({'menu':{'Delete':'javascript:allWidgets[\''+instanceId+'\'].deleteE.sendEvent(true);'}});
        if(data.fadeIn!=undefined){
            //var imgLoadedE = extractEventE(img, 'load');
            //var imageFadedE = jFadeInE(imgLoadedE, imageId, data.fadeIn);
            jQuery(document.getElementById(imageId)).fadeIn(data.fadeIn, function(){});
        }//fadeInE(getElement(imageId));
    }
    this.build=function(){
        img.id = imageId;
        //img.style.display=(data.fadeIn!=undefined)?'none':'block';
        img.src = (data.src!=undefined)?data.src:data.placeholder.src;
        
        img.width = (data.width!=undefined)?data.width:data.placeholder.style.width.replace('px', '');
        img.height = (data.height!=undefined)?data.height:data.placeholder.style.height.replace('px', '');
        
        var anchor = document.createElement('a');
        anchor.className = data.className;
        anchor.href=SETTINGS.scriptPath+"content/imagegallery/"+data.upload_id+"_medium"; 
        anchor.appendChild(img);
        return anchor;
    }
    this.destroy=function(){
        allWidgets[instanceId] = null;
        delete allWidgets[instanceId];
    }
}
function ImageGalleryWidget(instanceId,data){
    var dragHere = document.createElement('div');
                    dragHere.innerHTML = "Empty Gallery<br />Drag Images Here";
                    dragHere.className = "imageGallery_fileDragBox";
                    
    var width = (data.placeholder==null)?data.width:data.placeholder.style.width.replace('px', '');
    var height = (data.placeholder==null)?data.height:data.placeholder.style.height.replace('px', '');
    var widgets = new Array();
    var widgetId = instanceId+"_MAIN";
    var tableDivId = instanceId+"_table";
    var parent = this;
    this.loader=function(){
        
        var dragDropW = new FileUploaderDragDropWidget(instanceId+"_dragDrop", {targetId:widgetId});
        //if(imagegalleryRights)
            dragDropW.loader();
        
        var uploadCompleteE = dragDropW.uploadCompleteE();
        var galleriesD = DATA.getRemote("imageGallery_galleryList", data.gallery);
        var galleriesB = galleriesD.event.startsWith(null);
        var renderHTMLGalleriesB = galleriesB.liftB(function(galleries){
            parent.destroyChildWidgets();
            if(galleries==null)
                return "";//show loading or something.
            widgets = new Array();
            widgets.length=0;
            var galleriesDiv = document.createElement('div');
            for(index in galleries){                                                                                                                                                       
                var gallery = galleries[index];
                var galleryDiv = document.createElement('div');
                galleryDiv.appendChild(dragHere);
                var galleryId = instanceId+"_"+gallery.galleryId;
                galleryDiv.id = galleryId;
                galleryDiv.className = 'imageGallery_gallery';                
                var gallery = galleries[index];                                          
                for(imageId in gallery.images){
                    var image = gallery.images[imageId];
                    if(image.deleted)
                        continue;
                    image.src = SETTINGS.scriptPath+'content/imagegallery/'+image.upload_id+"_small";
                    var newImage = new ImageWidget(instanceId+"_"+imageId, {src:image.src, width: data.thumbWidth, height: data.thumbHeight, fadeIn:500, rights: image.rights, upload_id: image.upload_id, className: "galleryLink"}, galleriesD, galleriesB);
                    widgets.push(newImage);
                    var rar = newImage.build();
                    galleryDiv.appendChild(rar);
                }
                
                if(gallery.images.length==0)
                    dragHere.style.display = 'block';    
                else
                    dragHere.style.display = 'none'; 
                galleriesDiv.appendChild(galleryDiv);
                break;
            }
            return galleriesDiv;               
        });
        F.insertDomB(renderHTMLGalleriesB, tableDivId);
        uploadCompleteE.snapshotE(liftB(function(uploadData, galleries){if(uploadData==null||galleries==null)return null;return {uploadData:uploadData, galleries:galleries};},uploadCompleteE.startsWith(null), galleriesB)).mapE(function(data){
            var gallery = data.galleries[0];
            var uploadData = data.uploadData;
            gallery.images[gallery.images.length] = {upload_id: data.uploadData.files[0].id, caption: "", rights: true};
            galleriesD.set(data.galleries);   
        });
        renderHTMLGalleriesB.liftB(function(x){if(x!=""){parent.loadChildWidgets();jQuery('a.galleryLink').lightBox();}/*parent.inflateEditorAreas();*/});
    }
    this.destroyChildWidgets = function(){
        for(index in widgets)
            widgets[index].destroy();
        widgets = new Array();
    }
    this.loadChildWidgets = function(){
        for(index in widgets){
            widgets[index].loader();
        }
    }
    this.destroy=function(){
        this.destroyChildWidgets();
        database.deregister("aurora_settings", data.plugin);
    }
    this.build=function(){
        return "<div id=\""+widgetId+"\" style=\"display: block; width: "+width+"px; height: "+height+"px;\" ><div id=\""+tableDivId+"\"></div></div>";
    }
}
WIDGETS.register("imageWidget", ImageWidget);
WIDGETS.register("imageGallery", ImageGalleryWidget);

/*function UploadableImageWidget(instanceId, data){    
	var width = data.placeholder.getAttribute("width");
    width=(width==null?data.placeholder.style.width.replace('px', ''):width);
	var height = data.placeholder.getAttribute("height");
	height=(height==null?data.placeholder.style.height.replace('px', ''):height);
    this.imageLoadE = F.receiverE();
    
    var parent = this;
    data.acceptedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
    data.targetId = instanceId+"_container";
    
    var uploadWidget = new FileUploaderDragDropWidget(instanceId+"_dnd",data);   
                         
    this.loader=function(widgetRefB){
    	DOM.get(instanceId+"_img").onload = function(event){
        	DOM.get(instanceId+"_container").style.width = DOM.get(instanceId+"_img").clientWidth+"px";
        	DOM.get(instanceId+"_container").style.height = DOM.get(instanceId+"_img").clientHeight+"px";
        	parent.imageLoadE.sendEvent(DOM.get(instanceId+"_img"));
        }
    	uploadWidget.loader();
        var thumbPathB = widgetRefB.liftB(function(widgetRef){
            if(!good())
                return NOT_READY;
            return window['SETTINGS']['scriptPath']+"resources/upload/public/imagegallery/thumbs/"+widgetRef+".png";
        });
        var imageExistsB = thumbPathB.liftB(function(imagePath){
        	var imageFrame = DOM.get(instanceId+"_img");
        	if(!good())
                return NOT_READY;
        	imageFrame.style.display = 'none';
            imageFrame.src = imagePath+"?time="+(new Date()).getTime();
            return UrlExists(imagePath);
        });
        
        imageExistsB.liftB(function(imageExists){
            if(!good())
                return NOT_READY;
            var dropZone = (!imageExists)?uploadWidget.getDropZone().outerHTML:uploadWidget.getPanel().outerHTML;
            DOM.get(instanceId+"_dz").innerHTML = dropZone;
            if(imageExists){
                DOM.get(uploadWidget.getPanel().id).innerHTML = "";
            }                                  
            
        });
        
        uploadWidget.sendProgressE.mapE(function(progress){
        	jQuery(DOM.get(instanceId+"_progress")).progressbar({value: Math.ceil(progress.queuePercentageComplete)});
        });
        
        var uploadCompleteB = uploadWidget.uploadCompleteE.mapE(function(response){
            return {path: response.path, width: width, height: height}; 
        }).startsWith(NOT_READY);
        
        var processRequestB = F.liftB(function(request, widgetRef){                                                                                                    
            if(!good())
                return NOT_READY;
            request.id = widgetRef;
            return request;
        }, uploadCompleteB, widgetRefB);
            
        var imageProcessedE = getAjaxRequestB(processRequestB, window['SETTINGS']['scriptPath']+"/request/IG_processImage").mapE(function(ret){
            if(ret==NOT_READY)
                return NOT_READY;
            var container = DOM.get(instanceId+"_container");
            var image = DOM.get(instanceId+"_img");
            log(image.clientWidth+" "+image.clientHeight);
            var progress = DOM.get(instanceId+"_progress"); 
            jQuery(DOM.get(instanceId+"_progress")).progressbar("destroy");
            //progress.innerHTML = uploadWidget.getPanel().outerHTML;
            image.src = ret.path+"?time="+(new Date()).getTime();
            DOM.get(uploadWidget.getPanel().id).innerHTML = "";
        });                                                                 
    }      
    this.hide = function(){
        DOM.get(instanceId+"_container").style.display = 'none';
    }              
    this.show = function(){
        DOM.get(instanceId+"_container").style.display = 'block';
    }                                
    this.build=function(){
        log("School Logo Widget BUILD");
    	return "<div id=\""+instanceId+"_container\" style=\"margin: 0 auto; text-align: center; width: "+width+"px; height: "+height+"px;\">"+DOM.createImg(instanceId+"_img", "UploadableImageWidget", "/resources/trans.png").outerHTML+"<div id=\""+instanceId+"_dz\"></div><div id=\""+instanceId+"_progress\"></div></div>";   
    }
    this.destroy=function(){
        uploadWidget.destroy();
    }
    
}*/




function UploadableImageWidget(instanceId, data){  
	var UPLOAD = new AuroraUploadManager(data); 
	var parent = this;
	var acceptedTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
	//Configure Dimensions 
	
	var dropHtml = data.dropHtml;
	var dropHoverHtml = data.dropHoverHtml;
	
	var width = data.placeholder.getAttribute("width");
    width=(width==null?data.placeholder.style.width.replace('px', ''):width);
	var height = data.placeholder.getAttribute("height");
	height=(height==null?data.placeholder.style.height.replace('px', ''):height);
	
    this.loader=function(widgetRefB){
    	widgetRefB = widgetRefB==undefined?F.constantB(data.widgetRef):widgetRefB;
    	var imageZone = DOM.get(instanceId+"_imagezone");
    	var imageElement = DOM.get(instanceId+"_imagezone");
    	parent.dropE = F.mergeE(F.extractEventE(imageZone, 'drop'), F.extractEventE(imageElement, 'dragenter')).cancelDOMBubbleE();
        parent.dragOverE = F.mergeE(F.extractEventE(imageZone, 'dragover'), F.extractEventE(imageElement, 'dragenter')).cancelDOMBubbleE().mapE(function(event){
        	event.dataTransfer.dropEffect = 'move';
            if(imageZone.innerHTML==dropHtml){
            	imageZone.innerHTML = dropHoverHtml;
            }
            return event;
        });
        
        parent.dragEnterE = F.mergeE(F.extractEventE(imageZone, 'dragenter'), F.extractEventE(imageElement, 'dragenter')).mapE(function(event){
        	if(imageZone.innerHTML==dropHtml){
        		imageZone.innerHTML = dropHoverHtml;
        	}
            return event;
        });
        
        parent.dragExitE = F.mergeE(F.extractEventE(imageZone, 'dragleave'), F.extractEventE(imageElement, 'dragenter')).mapE(function(event){
        	if(imageZone.innerHTML==dropHoverHtml){
        		imageZone.innerHTML = dropHtml;
        	}
            return event;
        });     
        parent.dragExitE = F.mergeE(F.extractEventE(imageZone, 'dragend'), F.extractEventE(imageElement, 'dragenter')).mapE(function(event){
        	if(imageZone.innerHTML==dropHoverHtml){
        		imageZone.innerHTML = dropHtml;
        	}
            return event;
        });
    
        parent.filesDropE = parent.dropE.filterE(function(event){
        	var files = event.target.files || event.dataTransfer.files; 
        	if(files!=undefined && files.length>1){
        		UI.showMessage("Upload Error", "Unable to process multiple images, please upload a single image.");
        		return false;
            }
        	return files!=undefined;
        	
        }).mapE(function(event){ 
        	var files = event.target.files || event.dataTransfer.files;  
            var totalBytes = 0;
            var fileArray = [];
            if(files[0]!=undefined && files[0].size!=undefined){
                if(files[0].type!="" && arrayContains(acceptedTypes, files[0].type)){
                    totalBytes=files[0].size;
                    UPLOAD.add(files[0]);
                }
                else{
                    log("Unable to upload directories skipping "+files[0].type);
                }
            }
            return {size: totalBytes, files:files};
        }).filterE(function(fileData){
        	return fileData.size>0;
        });
        parent.uploadCompleteE = UPLOAD.uploadCompleteE;
        parent.allUploadsCompleteE = UPLOAD.allUploadsCompleteE;
              
        var sendProgressE = UPLOAD.progressUpdateB.changes().filterE(function(val){return val!=NOT_READY;}).mapE(function(progress){              
               var total = progress.total;
               var loaded = progress.loaded;
               var queuePercentage = (loaded/total)*100; 
               queuePercentage = queuePercentage<0?0:(queuePercentage>100?100:queuePercentage); 
               DOM.get(instanceId+"_status").innerHTML = "Uploading "+Math.ceil(queuePercentage)+"%";
               jQuery(DOM.get(instanceId+"_progress")).progressbar({value: Math.ceil(queuePercentage)});
               return {filePercentageComplete:queuePercentage, queuePercentageComplete:queuePercentage,currentFile:progress.currentFile, rate:progress.rate, queue:progress.queue, formattedTotal:progress.formattedTotal}; 
        });     
        
        var thumbPathB=widgetRefB.liftB(function(ref){log(ref);if(!good()){return NOT_READY;}return window['SETTINGS']['scriptPath']+"resources/upload/public/imagegallery/thumbs/"+ref+".png";});
        
        imageElement.onload = function(){
        	imageElement.style.width = imageElement.clientWidth+"px";
        	imageElement.style.height = imageElement.clientHeight+"px";
        }
        
        var imageExistsB = thumbPathB.liftB(function(imagePath){
        	if(!good())
                return NOT_READY;
            if(UrlExists(imagePath)){
            	DOM.get(instanceId+"_img").src = imagePath+"?time="+(new Date()).getTime();
            	return true;
            }
            else if(dropHtml!=undefined){
            	DOM.get(instanceId+"_imagezone").innerHTML = dropHtml;
            }
            else{
            	DOM.get(instanceId+"_imagezone").innerHTML = "<div style=\"width:"+width+"px;height:"+height+"px\">Drop an image here</div>";
            }
            return false;
        });
        
        var processRequestB = F.liftB(function(uploadRequest, ref){                                                                                                    
            if(!good())
                return NOT_READY;
            return {id: ref, path: uploadRequest.path, width: width, height: height};
        }, parent.uploadCompleteE.filterE(function(res){
        	if(res.status==NO_PERMISSION){
        		log("Permission Error, You do not have permission to upload to this path");
        		UI.showMessage("Permission Error","You do not have permission to upload to this path");
        	}
        	return res.status==1;}).startsWith(NOT_READY), widgetRefB);
            
        var imageProcessedE = getAjaxRequestB(processRequestB, window['SETTINGS']['scriptPath']+"/request/IG_processImage").mapE(function(ret){
            if(ret==NOT_READY)
                return NOT_READY;
            DOM.get(instanceId+"_imagezone").innerHTML = "<img src=\""+ret.path+"?time="+(new Date()).getTime()+"\" alt=\"\" />";
            DOM.get(instanceId+"_status").innerHTML = "";
            jQuery(DOM.get(instanceId+"_progress")).progressbar("destroy");
        });                                                                 
    }      
    this.hide = function(){
        DOM.get(instanceId+"_container").style.display = 'none';
    }              
    this.show = function(){
        DOM.get(instanceId+"_container").style.display = 'block';
    }                                
    this.build=function(){
    	return "<div id=\""+instanceId+"_container\" style=\"margin: 0 auto; width: "+width+"px;\"><div id=\""+instanceId+"_imagezone\"><img id=\""+instanceId+"_img\" alt=\"\" /></div><div id=\""+instanceId+"_progress\"></div><div id=\""+instanceId+"_status\" style=\"position: relative; top: -25px;\" class=\"imageGallery_status\"></div></div>";   
    }
    this.destroy=function(){

    }
}





function UploadableImageWidgetConfigurator(){
    this['requiresRef'] = true;
	this['load'] = function(newData){}
    this['build'] = function(newData){}
    this['getData'] = function(){}
    this['getName'] = function(){
        return "Image Uploader Widget";
    }
    this['getDescription'] = function(){
        return "A blank image which can be changed using drag and drop";
    }
    this['getPackage'] = function(){
        return "Image Gallery";
    }
} 
WIDGETS.register("UploadableImageWidget", UploadableImageWidget, UploadableImageWidgetConfigurator);


(function ($, flapjax) {
    var methods = {
        'clicksE': function () {
            if (!(this instanceof $)) { return; }
            var events = [];

            var i;
            for (i = 0; i < this.length; i += 1) {
                var elm = this[i];
                events.push(flapjax.clicksE(elm));
            }

            return flapjax.mergeE.apply({}, events);
        },
        'extEvtE': function (eventName) {
            if (!(this instanceof $)) { return; }
            var events = [];

            var i;
            for (i = 0; i < this.length; i += 1) {
                var elm = this[i];
                events.push(flapjax.extractEventE(elm, eventName));
            }

            return flapjax.mergeE.apply({}, events);
        },
        'extValB': function () {
            if (!(this instanceof $) || this.length < 1) { return; }
            return flapjax.extractValueB(this.get(0));
        },
        'extValE': function () {  
            if (!(this instanceof $)) { return; }
            var events = [];

            var i;
            for (i = 0; i < this.length; i += 1) {
                var elm = this[i]; 
                events.push(flapjax.extractValueE(elm));
            }

            return flapjax.mergeE.apply({}, events);
        },
        'jQueryBind': function (eventName) {       
            if (!(this instanceof $)) { return; }
            var eventStream = F.receiverE();
            //alert('Binding to: '+eventName);
            this.bind(eventName, function (e) {
               //alert('BIND');
                eventStream.sendEvent(arguments.length > 1 ? arguments : e);
            });
            
            return eventStream;
        },
        'liftB': function (fn) {
            if (!(this instanceof $) || this.length < 1) { return; }
            return this.fj('extValB').liftB(fn);
        },
        'liftBArr': function (fn) {
            return this.map(function () {
                return flapjax.extractValueB(this).liftB(fn);
            });
        }
    };

    jQuery.fn.fj = function (method) {
        var args = Array.prototype.slice.call(arguments, 1);
        return methods[method].apply(this, args);
    };
})(jQuery, F);



//Example usage: <img src="/resources/noWidget.png" alt="{[{id: '1', text: 'Bla'}, {id: '2', text: 'Yo ho'}]}" class="widget_PayPalOptionButton" />

function PayPalOptionButton(instanceId, data){
	var paypalUrl = (data.sandboxMode!=undefined&&(data.sandboxMode==true||data.sandboxMode=="true"))?"https://www.sandbox.paypal.com/cgi-bin/webscr":"https://www.paypal.com/cgi-bin/webscr";
	var productId = data.productId;
    var products = data.products;
    var buttonText = (data.buttonText!=undefined)?data.buttonText:"Purchase";
    //var products = [{id: 2, text: "Bla"}, {id: 2, text: "Bla"}];
    
    var autoSubmit = (data.autoSubmit!=undefined)?data.autoSubmit:true;
    var showButton = (data.showButton!=undefined)?data.showButton:true;
    this.invoiceE = undefined;
    var requestInvoiceE = F.receiverE();
    this.loader=function(){
    	var quantityB = DOM.get(instanceId+"_quantity")==undefined?F.constantB(1):F.extractValueE(instanceId+"_quantity").startsWith(1);
    	var productSelectedB = F.extractValueE(instanceId+"_products").startsWith(DOM.get(instanceId+"_products").value);
		
		productSelectedB.liftB(function(productSelected){
			jQuery("."+instanceId+"_options").hide();
			jQuery("#"+instanceId+"_"+productSelected).show();
		});
		
		
		var paypalHTMLVariablesB = F.liftB(function(optionSelected, quantity){
			return {productId: optionSelected, quantity: quantity};
		}, productSelectedB, quantityB);
    	var buttonClickedE = F.extractEventE(instanceId+"_button", "click").snapshotE(paypalHTMLVariablesB).mapE(function(variables){
        	DOM.get(instanceId+"_productId").value = variables.productId;	
        	DOM.get(instanceId+"_quantityField").value = variables.quantity;	
        	
        	for(var index in products){
    			var product = products[index];
    			if(product.id==variables.productId&&product.optionName!=undefined&&product.options!=undefined){
    				DOM.get(instanceId+"_form").innerHTML+="<input type='hidden' name='on0' value='"+product.optionName+"' /><input type='hidden' name='os0' value='"+DOM.get(instanceId+"_"+variables.productId).value+"' />";	
    			}
    		}
    		
        	return {};
        });   
        this.invoiceE = getAjaxRequestE(F.mergeE(requestInvoiceE, buttonClickedE.mapE(function(){return true;})), "/request/products_createInvoice").mapE(function(invoice){
        	DOM.get(instanceId+"_form").innerHTML+="<input type='hidden' name='invoice' value='"+invoice.invoiceId+"' />";
        	if(autoSubmit){
        		//log(DOM.get(instanceId+"_form"));
        		DOM.get(instanceId+"_form").submit();
        	}
        	return invoice;
        });  
    }
    this.setOptionValue = function(value){
    	DOM.get(instanceId+"_option").value = value;
    };
    this.requestInvoice = function(option){
    	requestInvoiceE.sendEvent((option==undefined?true:option));
    };
    this.getForm = function(){
    	return DOM.get(instanceId+"_form");
    };
    this.submit = function(){
    	DOM.get(instanceId+"_form").submit();
    	/*this.requestInvoice();
    	autoSubmit = true;*/
    }
    this.build=function(){
    	var quantity = "&nbsp;&nbsp;<span class=\"payPal_quantityField\">Quantity: <select id=\""+instanceId+"_quantity\">";
    	if((data.showQuantity!=undefined&&data.showQuantity)||(data.maxQuantity!=undefined)){
	    	var maxQuantity = (data.maxQuantity!=undefined&&typeof(data.maxQuantity)=='number'?data.maxQuantity:50)
	    	for(var i=1;i<=maxQuantity;i++){
	    		 quantity+="<option value=\""+i+"\">"+i+"</option>";
	    	}
	    	quantity+="</select></span>";
    	}
    	else{
    		quantity = "";
    	}
    	var options = "";
    	var productsSelect = "<select id=\""+instanceId+"_products\" style=\"display: "+((data.hideSingle!=undefined&&data.hideSingle&&products.length==1)?"none":"")+"\">";
    	for(var index in products){
    		var product = products[index];
    		 productsSelect+="<option value=\""+product.id+"\">"+product.text+"</option>";
    		 if(product.options!=undefined){
    		 	options+="<select id=\""+instanceId+"_"+product.id+"\" class=\""+instanceId+"_options\">";
    		 	for(var index in product.options){
    		 		var option = product.options[index];
    		 		var text = option[1];
    		 		var optionValue = option[0];
    		 		options+="<option value=\""+optionValue+"\">"+text+"</option>";
    		 	}
    		 	options+="</select>";
    		 }
    	}
    	if(options.length>0){
    		options = "<br />"+options;
    	}
    	productsSelect+="</select>";
        var html = ""+
"<form id=\""+instanceId+"_form\" action=\""+paypalUrl+"\" method=\"post\" style=\"display: none;\">"+
"<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">"+ 
//"<input type=\"hidden\" name=\"custom\" value=\""+SETTINGS['user']['id']+"\">"+  
"<input type=\"hidden\" id=\""+instanceId+"_quantityField\" name=\"quantity\" value=\"\">"+
"<input type=\"hidden\" id=\""+instanceId+"_productId\" name=\"hosted_button_id\" value=\"\">"+
"<input type=\"image\" src=\"https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">"+
"<img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">"+
"</form>"+productsSelect+options+quantity+"<br /><br /><span id=\""+instanceId+"_button\" style=\"margin: 0 auto; "+(showButton?"":"display:none;")+"\" class=\"button\">"+buttonText+"</span>";   
        return html;
    }
    this.destroy=function(){
    }                                                    
}
WIDGETS.register("PayPalOptionButton", PayPalOptionButton); 

function PayPalBuyNowWidget(instanceId, data){
	var paypalUrl = (data.sandboxMode!=undefined&&(data.sandboxMode==true||data.sandboxMode=="true"))?"https://www.sandbox.paypal.com/cgi-bin/webscr":"https://www.paypal.com/cgi-bin/webscr";
	var productId = data.productId;
    var options = (data.optionName==undefined)?"":"<input type=\"hidden\"name=\"on0\" value=\""+data.optionName+"\"><input type=\"hidden\" id=\""+instanceId+"_option\" name=\"os0\" value=\""+data.optionValue+"\" />";
    var buttonText = data.text==undefined||data.text.length===0?"Purchase Now":data.text; 
    var autoSubmit = (data.autoSubmit!=undefined)?data.autoSubmit:true;
    var showButton = (data.showButton!=undefined)?data.showButton:true;
    this.invoiceE = undefined;
    var requestInvoiceE = F.receiverE();
    this.loader=function(){
    	var buttonClickedE = F.extractEventE(instanceId+"_button", "click").mapE(function(){return {};});  
        this.invoiceE = getAjaxRequestE(F.mergeE(requestInvoiceE, buttonClickedE.mapE(function(){return true;})), "/request/products_createInvoice").mapE(function(invoice){
        	DOM.get(instanceId+"_form").innerHTML+="<input type='hidden' name='invoice' value='"+invoice.invoiceId+"' />";
        	if(autoSubmit){
        		DOM.get(instanceId+"_form").submit();
        	}
        	return invoice;
        });  
    }
    this.setOptionValue = function(value){
    	DOM.get(instanceId+"_option").value = value;
    };
    this.requestInvoice = function(option){
    	requestInvoiceE.sendEvent((option==undefined?true:option));
    };
    this.getForm = function(){
    	return DOM.get(instanceId+"_form");
    };
    this.submit = function(){
    	DOM.get(instanceId+"_form").submit();
    	/*this.requestInvoice();
    	autoSubmit = true;*/
    }
    this.build=function(){
        var html = ""+
"<form id=\""+instanceId+"_form\" action=\""+paypalUrl+"\" method=\"post\" style=\"display: none;\">"+
"<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">"+ 
//"<input type=\"hidden\" name=\"custom\" value=\""+SETTINGS['user']['id']+"\">"+  
"<input type=\"hidden\" name=\"hosted_button_id\" value=\""+productId+"\">"+options+
"<input type=\"image\" src=\"https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">"+
"<img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">"+
"</form><br /><span id=\""+instanceId+"_button\" style=\"margin: 0 auto; "+(showButton?"":"display:none;")+"\" class=\"button\">"+buttonText+"</span>";   
        return html;
    }
    this.destroy=function(){
    }                                                    
}





/**
 *  ProductSelectionWidgetConfigurator
 * @constructor
 */                                                      
function PayPalBuyNowWidgetConfigurator(){
    var id = "PayPalBuyNowWidgetConfigurator";
    this['load'] = function(newData){}
    this['build'] = function(newData){
        var productId = "";
        var optionName = ""; 
        var text = "";    
        if(newData!=undefined){
            productId = newData['productId'];
            optionName = newData['optionName']; 
            text = newData['text'];   
        }
        return "Product Id: <input type=\"text\" id=\""+id+"_productId\" value=\""+productId+"\" /><br />"+
        "Option Name: <input type=\"text\" id=\""+id+"_optionName\" value=\""+optionName+"\" />"+
        "Text: <input type=\"text\" value=\""+text+"\" id=\""+id+"_text\" />";    
              
        //   productId      optionName
    }
    this['getData'] = function(){
        return {"productId": document.getElementById(id+'_productId').value, "optionName": document.getElementById(id+'_optionName').value, "text": document.getElementById(id+'_text').value};
    }
    this['getName'] = function(){
        return "PayPay Buy Now Button";
    }
    this['getDescription'] = function(){
        return "A Pay Pal Widget With HTML Option Selector";
    }
    this['getPackage'] = function(){
        return "Products";
    }
} 
WIDGETS.register("PayPalBuyNowWidget", PayPalBuyNowWidget, PayPalBuyNowWidgetConfigurator); 





function PayPalOrderStatusChecker(instanceId, data){
    this.loader = function(){
	    if(getVars.tx!=undefined){
	    	var transactionId = getVars.tx;
	    	var serverResponseE = getAjaxRequestE(F.oneE().mapE(function(){return {tx: transactionId}}), "/request/paypal_paymentreturn").mapE(function(response){
		    	log("Server Response");
		    	log(response);
		    });
    	}
    }
    this.build=function(){}
    this.destroy=function(){
    }                                                    
}
WIDGETS.register("PayPalOrderStatusChecker", PayPalOrderStatusChecker); 
window['CKEDITOR_BASEPATH'] = window['SETTINGS']['scriptPath']+'plugins/ckeditor/ckeditor/';
pageDataB.calmB().liftB(function(pageData){
    if(pageData==NOT_READY){
        return NOT_READY;
    }
 //getElementById("content")
 var element = document.createElement("span");
if(window['SETTINGS']['page']['permissions']['canEdit'] || window['SETTINGS']['page']['permissions']['canDelete']){
    var adminPanel = document.createElement("span");
    adminPanel.id = "aurora_adminPanel";
    adminPanel.style.position = 'absolute';
    adminPanel.style.top = '0px';
    adminPanel.style.right = '0px';
    
    //adminPanel.style = "position: absolute; top: 0px; right: 0px;";
    if(window['SETTINGS']['page']['permissions']['canEdit']){
        adminPanel.innerHTML += "<a href=\"javascript:editPage();\"><img style=\"width: 20px; height: 20px;\" src=\""+window['SETTINGS']['scriptPath']+"plugins/ckeditor/edit.png\" alt=\"\" /></a>";   
    }
    if(window['SETTINGS']['page']['permissions']['canDelete']){
        adminPanel.innerHTML += "<a href=\"javascript:deletePage();\"><img style=\"width: 20px; height: 20px;\" src=\""+window['SETTINGS']['scriptPath']+"plugins/ckeditor/delete.png\" alt=\"\" /></a>";   
    }
    document['body'].appendChild(adminPanel);                                                  
}
 
 });                                                                         
           
     
function findLinks(parent,callback){
    child = parent.firstChild;
    while(child){
        if(child.nodeName.toLowerCase()=="a"){
            callback(child);
        }
        if(child.hasChildNodes()){               
            //parent.replaceChild(replaceLinkPaths(child, search, replace), child);
            child = findLinks(child,callback);
        }
        if(child.nextSibling==null)  //Needed for weird old browser compatibility
            return parent;// parent;
        child = child.nextSibling;
    }
    return parent;
}   
function cleanUpHtml(html){
    var element = document.createElement("div");
    element.innerHTML = html;
    findLinks(element, function(child){
        var pageName = child.href.replaceAll(window['SETTINGS']['scriptPath'], "");
        child.href = child.href.replaceAll(window['SETTINGS']['scriptPath'], "page://");
        log('Hurr2');  
        child.onclick = function(){loadPage(pageName)};
    });
    return element.innerHTML;
}
            
            
function cleanDownHtml(html){
    var element = document.createElement("div");
    element.innerHTML = html;
    element = findLinks(element, function(child){
    var pageName = child.href.replaceAll("page://", "");
        child.href = child.href.replaceAll("page://", window['SETTINGS']['scriptPath']);
        log('Hurr');
        child.onclick = function(){loadPage(pageName);return false;};
    });
    return element.innerHTML;
}
              
 function showBodyEditor(theme, page){
    editorOpen = true; 
    
    theme = cleanUpHtml(theme);
    page = cleanUpHtml(page);
                                    
    document.getElementById("body").innerHTML = theme;
    document.getElementById("content").innerHTML = page;
    
    var editor = CKEDITOR.replace('body', {'customConfig': window['SETTINGS']['scriptPath']+'themes/'+window['SETTINGS']['theme']['name']+'/auroraPageBodyConfig.js', 'extraPlugins' : 'ajaxSave,auroraWidgets,auroraCancel' });               
    CKEDITOR.on('instanceReady',function() {editor.execCommand('maximize');});
    }
function showContentEditor(data){
    editorOpen = true;
    data = cleanUpHtml(data); 
    
    var outerContent = document.createElement("div");
    var content =  document.getElementById("content");
    content.parentNode.replaceChild(outerContent,content); 
    outerContent.appendChild(content);
    
    document.getElementById("content").innerHTML = data;
    //function() {jQuery.scrollTo(outerContent, 1000);jQuery("#aurora_adminPanel").hide();}
    CKEDITOR.replace('content', {'customConfig': window['SETTINGS']['scriptPath']+'themes/'+window['SETTINGS']['theme']['name']+'/auroraPageConfig.js', 'extraPlugins' : 'ajaxSave,auroraWidgets,auroraCancel' });               
    CKEDITOR.on('instanceReady',function() {
        if(typeof jQuery!='undefined'){
            jQuery.scrollTo(outerContent, 1000);
            jQuery("#aurora_adminPanel").hide();
        }
        else{
            var pos = getPos(outerContent);
            window.scrollTo(0, pos.y);
            document.getElementById('aurora_adminPanel').style.display = 'none';
        }
    });
} 
window['ckeditor_ajaxSave'] = function(editor){
    var data = cleanDownHtml(editor.getData());
    if(isBase()){
        var sendData;
        sendData = seperateContentFromTheme(data);
        if(sendData.content.length==0)
            alert("Error - Your template MUST contain a div with an id of 'content'");
        else{
            commitPageChanges(sendData, editor);
        }
    }
    else{
        var groupsHTML = "";
        for(index in window['SETTINGS']['groups']){
            var group = window['SETTINGS']['groups'][index];
            var checked = checkPermission(group['group_id'])?" checked=\"yes\"":"";
            groupsHTML+="<input type=\"checkbox\" name=\""+group['group_id']+"\" id=\"groupcheck_"+group['group_id']+"\" "+checked+" />&nbsp;"+group['name']+"<br />";    
        }                                  
        UI.showMessage("Who can view this page?", groupsHTML, function(){
            var groupsAllowed = new Object();
            for(index in window['SETTINGS']['groups']){
                groupsAllowed[window['SETTINGS']['groups'][index]['group_id']] = document.getElementById("groupcheck_"+window['SETTINGS']['groups'][index]['group_id']).checked;
            }
            sendData = {"content": data, "pageName": window['SETTINGS']['page']['name']+"", "permissions": groupsAllowed};
            commitPageChanges(sendData, editor);
        }); 
    }
    editorOpen = false;
};
function seperateContentFromTheme(data){
    var element = document.createElement('div');
    element.innerHTML = data;    
    divs = element.getElementsByTagName('div');
    var contentHTML = "";
    for (i=0;i<divs.length;i++){
        var div = divs[i];//.childNodes[0].nodeValue; 
        if(div.id=="content"){
            contentHTML = div.innerHTML; 
            div.innerHTML = "<PAGE_CONTENT>";
        }
        else if(div.id=="aurora_adminPanel"){
            div.parentNode.removeChild(div);
        }
    } 
    return {"content": contentHTML, "template": element.innerHTML, "pageName": window['SETTINGS']['page']['name']+""};
} 
function removeAdminPanel(data){
    var element = document.createElement('div');
    element.innerHTML = data;    
    divs = element.getElementsByTagName('div');
    var contentHTML = "";
    for (i=0;i<divs.length;i++){
        var div = divs[i];
        if(div.id=="aurora_adminPanel")
            div.parentNode.removeChild(div);
    } 
    return element.innerHTML;
}                                      
window['afterCommit'] = function(data, editor){
    (editor['destroy'])();
    window.location=window['SETTINGS']['scriptPath']+window['SETTINGS']['page']['name'];
};
window['cancelPageEdit'] = function(){
    window.location=window['SETTINGS']['scriptPath']+window['SETTINGS']['page']['name'];
};

window['editPage'] = function(){
    if(isBase())
        showBodyEditor(window['SETTINGS']['theme']['html'], window['SETTINGS']['page']['html']);
    else
        showContentEditor(window['SETTINGS']['page']['html']);
};
window['deletePage'] = function(){
    UI.confirm("Delete Page", "Are you sure you wish to delete this page?", "Yes", function(val){
            ajax({"type": "post",
                "url": window['SETTINGS']['scriptPath'] +"request/deletePage",
                "data": {"pageName": window['SETTINGS']['page']['name']+""},
                "success": function(data){window['location']=window['SETTINGS']['scriptPath']+window['SETTINGS']['defaultPage'];}
                });  
        }, "No",
        function(val){
            
        });
};   
window['commitPageChanges'] = function(dataObj, editor){
    ajax({"type": "post",
        "url": window['SETTINGS']['scriptPath'] +"request/commitPage",
        "data": dataObj,
        "success": function(data){afterCommit(data, editor);}
        });
};
function ContactFormSubmitButton(instanceId, data){
    this.instanceId = instanceId;
    var loadingImId = this.instanceId+"_loading";
    var submitButton = new ValidatedSubmitButton(instanceId,data);
    this.loader=function(){           
        
        var formDataGroupB = DATA.get(data.formGroup, undefined, {}); 
        var formDataB = formDataGroupB.liftB(function(validationMap){
            return F.liftB.apply(this,[function(){
                var dataOb = {};
                for(index in arguments){         
                    if(arguments[index].valid){
                        dataOb[arguments[index].name] = arguments[index].value;                            
                    }
                }
                return dataOb;
            }].concat(getObjectValues(validationMap)));
        }).switchB();
        
        submitButton.loader();    
        var submitClickedE = jQuery("#"+submitButton.elementId).fj('extEvtE', 'click').snapshotE(formDataB).mapE(function(formData){
            if(data.subject!=undefined){
                	formData.subject = data.subject;
                }
            return formData;
        });
        var submitClickedB = submitClickedE.startsWith(NOT_READY);
         
        /*var submitClickedE = jQuery("#"+submitButton.elementId).fj('extEvtE', 'click').snapshotE(formDataB).mapE(function(formDataMap){
            alert("Submit clicked");
            return formDataB;
        });   */            
        getAjaxRequestB(submitClickedB, SETTINGS['scriptPath']+"request/contactForm_sendMessage/").mapE(function(valid){
            UI.showMessage('Contact Form', (data.text!=undefined?data.text:'Your request has been sent.'));
            return valid;    
        });  
        //groupValidB
        
        //var emailValidB = F.receiverE().startsWith(false);
        //F.insertValueB(emailValidB,loadingImId, 'src');
        //F.insertValueB(submitClickedE.mapE(function(){return SETTINGS['theme']['path']+'loading_s.gif';}),loadingImId, 'src');
    }
    this.build=function(){
        return ""+submitButton.build()+"<img id=\""+loadingImId+"\" class=\"loadingSpinner\" src=\"/resources/trans.png\" alt=\"\" />";                 
    }
}
WIDGETS.register("ContactFormSubmitButton", ContactFormSubmitButton);
/*! jQuery Dynatree Plugin - v1.2.4 - 2013-02-12
* http://dynatree.googlecode.com/
* Copyright (c) 2013 Martin Wendt; Licensed MIT, GPL */
function _log(e,t){if(!_canLog)return;var n=Array.prototype.slice.apply(arguments,[1]),r=new Date,i=r.getHours()+":"+r.getMinutes()+":"+r.getSeconds()+"."+r.getMilliseconds();n[0]=i+" - "+n[0];try{switch(e){case"info":window.console.info.apply(window.console,n);break;case"warn":window.console.warn.apply(window.console,n);break;default:window.console.log.apply(window.console,n)}}catch(s){window.console?s.number===-2146827850&&window.console.log(n.join(", ")):_canLog=!1}}function _checkBrowser(){function n(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||e.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}}var e,t;return e=n(navigator.userAgent),t={},e.browser&&(t[e.browser]=!0,t.version=e.version),t.chrome?t.webkit=!0:t.webkit&&(t.safari=!0),t}function logMsg(e){Array.prototype.unshift.apply(arguments,["debug"]),_log.apply(this,arguments)}var _canLog=!0,BROWSER=jQuery.browser||_checkBrowser(),getDynaTreePersistData=null,DTNodeStatus_Error=-1,DTNodeStatus_Loading=1,DTNodeStatus_Ok=0;(function($){function getDtNodeFromElement(e){return alert("getDtNodeFromElement is deprecated"),$.ui.dynatree.getNode(e)}function noop(){}function versionCompare(e,t){var n=(""+e).split("."),r=(""+t).split("."),i=Math.min(n.length,r.length),s,o,u;for(u=0;u<i;u++){s=parseInt(n[u],10),o=parseInt(r[u],10),isNaN(s)&&(s=n[u]),isNaN(o)&&(o=r[u]);if(s==o)continue;return s>o?1:s<o?-1:NaN}return n.length===r.length?0:n.length<r.length?-1:1}function _initDragAndDrop(e){var t=e.options.dnd||null;t&&(t.onDragStart||t.onDrop)&&_registerDnd(),t&&t.onDragStart&&e.$tree.draggable({addClasses:!1,appendTo:"body",containment:!1,delay:0,distance:4,revert:!1,scroll:!0,scrollSpeed:7,scrollSensitivity:10,connectToDynatree:!0,helper:function(e){var t=$.ui.dynatree.getNode(e.target);return t?t.tree._onDragEvent("helper",t,null,e,null,null):"<div></div>"},start:function(e,t){var n=t.helper.data("dtSourceNode");return!!n},_last:null}),t&&t.onDrop&&e.$tree.droppable({addClasses:!1,tolerance:"intersect",greedy:!1,_last:null})}var Class={create:function(){return function(){this.initialize.apply(this,arguments)}}},DynaTreeNode=Class.create();DynaTreeNode.prototype={initialize:function(e,t,n){this.parent=e,this.tree=t,typeof n=="string"&&(n={title:n}),n.key?n.key=""+n.key:n.key="_"+t._nodeCount++,this.data=$.extend({},$.ui.dynatree.nodedatadefaults,n),this.li=null,this.span=null,this.ul=null,this.childList=null,this._isLoading=!1,this.hasSubSel=!1,this.bExpanded=!1,this.bSelected=!1},toString:function(){return"DynaTreeNode<"+this.data.key+">: '"+this.data.title+"'"},toDict:function(e,t){var n=$.extend({},this.data);n.activate=this.tree.activeNode===this,n.focus=this.tree.focusNode===this,n.expand=this.bExpanded,n.select=this.bSelected,t&&t(n);if(e&&this.childList){n.children=[];for(var r=0,i=this.childList.length;r<i;r++)n.children.push(this.childList[r].toDict(!0,t))}else delete n.children;return n},fromDict:function(e){var t=e.children;if(t===undefined){this.data=$.extend(this.data,e),this.render();return}e=$.extend({},e),e.children=undefined,this.data=$.extend(this.data,e),this.removeChildren(),this.addChild(t)},_getInnerHtml:function(){var e=this.tree,t=e.options,n=e.cache,r=this.getLevel(),i=this.data,s="",o;r<t.minExpandLevel?r>1&&(s+=n.tagConnector):this.hasChildren()!==!1?s+=n.tagExpander:s+=n.tagConnector,t.checkbox&&i.hideCheckbox!==!0&&!i.isStatusNode&&(s+=n.tagCheckbox),i.icon?(i.icon.charAt(0)==="/"?o=i.icon:o=t.imagePath+i.icon,s+="<img src='"+o+"' alt='' />"):i.icon!==!1&&(i.iconClass?s+="<span class=' "+i.iconClass+"'></span>":s+=n.tagNodeIcon);var u="";t.onCustomRender&&(u=t.onCustomRender.call(e,this)||"");if(!u){var a=i.tooltip?' title="'+i.tooltip.replace(/\"/g,"&quot;")+'"':"",f=i.href||"#";t.noLink||i.noLink?u='<span style="display:inline-block;" class="'+t.classNames.title+'"'+a+">"+i.title+"</span>":u='<a href="'+f+'" class="'+t.classNames.title+'"'+a+">"+i.title+"</a>"}return s+=u,s},_fixOrder:function(){var e=this.childList;if(!e||!this.ul)return;var t=this.ul.firstChild;for(var n=0,r=e.length-1;n<r;n++){var i=e[n],s=t.dtnode;i!==s?(this.tree.logDebug("_fixOrder: mismatch at index "+n+": "+i+" != "+s),this.ul.insertBefore(i.li,s.li)):t=t.nextSibling}},render:function(e,t){var n=this.tree,r=this.parent,i=this.data,s=n.options,o=s.classNames,u=this.isLastSibling(),a=!1;if(!r&&!this.ul)this.li=this.span=null,this.ul=document.createElement("ul"),s.minExpandLevel>1?this.ul.className=o.container+" "+o.noConnector:this.ul.className=o.container;else if(r){this.li||(a=!0,this.li=document.createElement("li"),this.li.dtnode=this,i.key&&s.generateIds&&(this.li.id=s.idPrefix+i.key),this.span=document.createElement("span"),this.span.className=o.title,this.li.appendChild(this.span),r.ul||(r.ul=document.createElement("ul"),r.ul.style.display="none",r.li.appendChild(r.ul)),r.ul.appendChild(this.li)),this.span.innerHTML=this._getInnerHtml();var f=[];f.push(o.node),i.isFolder&&f.push(o.folder),this.bExpanded&&f.push(o.expanded),this.hasChildren()!==!1&&f.push(o.hasChildren),i.isLazy&&this.childList===null&&f.push(o.lazy),u&&f.push(o.lastsib),this.bSelected&&f.push(o.selected),this.hasSubSel&&f.push(o.partsel),n.activeNode===this&&f.push(o.active),i.addClass&&f.push(i.addClass),f.push(o.combinedExpanderPrefix+(this.bExpanded?"e":"c")+(i.isLazy&&this.childList===null?"d":"")+(u?"l":"")),f.push(o.combinedIconPrefix+(this.bExpanded?"e":"c")+(i.isFolder?"f":"")),this.span.className=f.join(" "),this.li.className=u?o.lastsib:"",a&&s.onCreate&&s.onCreate.call(n,this,this.span),s.onRender&&s.onRender.call(n,this,this.span)}if((this.bExpanded||t===!0)&&this.childList){for(var l=0,c=this.childList.length;l<c;l++)this.childList[l].render(!1,t);this._fixOrder()}if(this.ul){var h=this.ul.style.display==="none",p=!!this.bExpanded;if(e&&s.fx&&h===p){var d=s.fx.duration||200;$(this.ul).animate(s.fx,d)}else this.ul.style.display=this.bExpanded||!r?"":"none"}},getKeyPath:function(e){var t=[];return this.visitParents(function(e){e.parent&&t.unshift(e.data.key)},!e),"/"+t.join(this.tree.options.keyPathSeparator)},getParent:function(){return this.parent},getChildren:function(){return this.hasChildren()===undefined?undefined:this.childList},hasChildren:function(){if(this.data.isLazy)return this.childList===null||this.childList===undefined?undefined:this.childList.length===0?!1:this.childList.length===1&&this.childList[0].isStatusNode()?undefined:!0;return!!this.childList},isFirstSibling:function(){var e=this.parent;return!e||e.childList[0]===this},isLastSibling:function(){var e=this.parent;return!e||e.childList[e.childList.length-1]===this},isLoading:function(){return!!this._isLoading},getPrevSibling:function(){if(!this.parent)return null;var e=this.parent.childList;for(var t=1,n=e.length;t<n;t++)if(e[t]===this)return e[t-1];return null},getNextSibling:function(){if(!this.parent)return null;var e=this.parent.childList;for(var t=0,n=e.length-1;t<n;t++)if(e[t]===this)return e[t+1];return null},isStatusNode:function(){return this.data.isStatusNode===!0},isChildOf:function(e){return this.parent&&this.parent===e},isDescendantOf:function(e){if(!e)return!1;var t=this.parent;while(t){if(t===e)return!0;t=t.parent}return!1},countChildren:function(){var e=this.childList;if(!e)return 0;var t=e.length;for(var n=0,r=t;n<r;n++){var i=e[n];t+=i.countChildren()}return t},sortChildren:function(e,t){var n=this.childList;if(!n)return;e=e||function(e,t){var n=e.data.title.toLowerCase(),r=t.data.title.toLowerCase();return n===r?0:n>r?1:-1},n.sort(e);if(t)for(var r=0,i=n.length;r<i;r++)n[r].childList&&n[r].sortChildren(e,"$norender$");t!=="$norender$"&&this.render()},_setStatusNode:function(e){var t=this.childList?this.childList[0]:null;if(!e){if(t&&t.isStatusNode()){try{this.ul&&(this.ul.removeChild(t.li),t.li=null)}catch(n){}this.childList.length===1?this.childList=[]:this.childList.shift()}}else t?(e.isStatusNode=!0,e.key="_statusNode",t.data=e,t.render()):(e.isStatusNode=!0,e.key="_statusNode",t=this.addChild(e))},setLazyNodeStatus:function(e,t){var n=t&&t.tooltip?t.tooltip:null,r=t&&t.info?" ("+t.info+")":"";switch(e){case DTNodeStatus_Ok:this._setStatusNode(null),$(this.span).removeClass(this.tree.options.classNames.nodeLoading),this._isLoading=!1,this.tree.options.autoFocus&&(this===this.tree.tnRoot&&this.childList&&this.childList.length>0?this.childList[0].focus():this.focus());break;case DTNodeStatus_Loading:this._isLoading=!0,$(this.span).addClass(this.tree.options.classNames.nodeLoading),this.parent||this._setStatusNode({title:this.tree.options.strings.loading+r,tooltip:n,addClass:this.tree.options.classNames.nodeWait});break;case DTNodeStatus_Error:this._isLoading=!1,this._setStatusNode({title:this.tree.options.strings.loadError+r,tooltip:n,addClass:this.tree.options.classNames.nodeError});break;default:throw"Bad LazyNodeStatus: '"+e+"'."}},_parentList:function(e,t){var n=[],r=t?this:this.parent;while(r)(e||r.parent)&&n.unshift(r),r=r.parent;return n},getLevel:function(){var e=0,t=this.parent;while(t)e++,t=t.parent;return e},_getTypeForOuterNodeEvent:function(e){var t=this.tree.options.classNames,n=e.target;if(n.className.indexOf(t.node)<0)return null;var r=e.pageX-n.offsetLeft,i=e.pageY-n.offsetTop;for(var s=0,o=n.childNodes.length;s<o;s++){var u=n.childNodes[s],a=u.offsetLeft-n.offsetLeft,f=u.offsetTop-n.offsetTop,l=u.clientWidth,c=u.clientHeight;if(r>=a&&r<=a+l&&i>=f&&i<=f+c){if(u.className==t.title)return"title";if(u.className==t.expander)return"expander";if(u.className==t.checkbox)return"checkbox";if(u.className==t.nodeIcon)return"icon"}}return"prefix"},getEventTargetType:function(e){var t=e&&e.target?e.target.className:"",n=this.tree.options.classNames;return t===n.title?"title":t===n.expander?"expander":t===n.checkbox?"checkbox":t===n.nodeIcon?"icon":t===n.empty||t===n.vline||t===n.connector?"prefix":t.indexOf(n.node)>=0?this._getTypeForOuterNodeEvent(e):null},isVisible:function(){var e=this._parentList(!0,!1);for(var t=0,n=e.length;t<n;t++)if(!e[t].bExpanded)return!1;return!0},makeVisible:function(){var e=this._parentList(!0,!1);for(var t=0,n=e.length;t<n;t++)e[t]._expand(!0)},focus:function(){this.makeVisible();try{$(this.span).find(">a").focus()}catch(e){}},isFocused:function(){return this.tree.tnFocused===this},_activate:function(e,t){this.tree.logDebug("dtnode._activate(%o, fireEvents=%o) - %o",e,t,this);var n=this.tree.options;if(this.data.isStatusNode)return;if(t&&n.onQueryActivate&&n.onQueryActivate.call(this.tree,e,this)===!1)return;if(e){if(this.tree.activeNode){if(this.tree.activeNode===this)return;this.tree.activeNode.deactivate()}n.activeVisible&&this.makeVisible(),this.tree.activeNode=this,n.persist&&$.cookie(n.cookieId+"-active",this.data.key,n.cookie),this.tree.persistence.activeKey=this.data.key,$(this.span).addClass(n.classNames.active),t&&n.onActivate&&n.onActivate.call(this.tree,this)}else if(this.tree.activeNode===this){if(n.onQueryActivate&&n.onQueryActivate.call(this.tree,!1,this)===!1)return;$(this.span).removeClass(n.classNames.active),n.persist&&$.cookie(n.cookieId+"-active","",n.cookie),this.tree.persistence.activeKey=null,this.tree.activeNode=null,t&&n.onDeactivate&&n.onDeactivate.call(this.tree,this)}},activate:function(){this._activate(!0,!0)},activateSilently:function(){this._activate(!0,!1)},deactivate:function(){this._activate(!1,!0)},isActive:function(){return this.tree.activeNode===this},_userActivate:function(){var e=!0,t=!1;if(this.data.isFolder)switch(this.tree.options.clickFolderMode){case 2:e=!1,t=!0;break;case 3:e=t=!0}this.parent===null&&(t=!1),t&&(this.toggleExpand(),this.focus()),e&&this.activate()},_setSubSel:function(e){e?(this.hasSubSel=!0,$(this.span).addClass(this.tree.options.classNames.partsel)):(this.hasSubSel=!1,$(this.span).removeClass(this.tree.options.classNames.partsel))},_updatePartSelectionState:function(){var e;if(!this.hasChildren())return e=this.bSelected&&!this.data.unselectable&&!this.data.isStatusNode,this._setSubSel(!1),e;var t,n,r=this.childList,i=!0,s=!0;for(t=0,n=r.length;t<n;t++){var o=r[t],u=o._updatePartSelectionState();u!==!1&&(s=!1),u!==!0&&(i=!1)}return i?e=!0:s?e=!1:e=undefined,this._setSubSel(e===undefined),this.bSelected=e===!0,e},_fixSelectionState:function(){var e,t,n;if(this.bSelected){this.visit(function(e){e.parent._setSubSel(!0),e.data.unselectable||e._select(!0,!1,!1)}),e=this.parent;while(e){e._setSubSel(!0);var r=!0;for(t=0,n=e.childList.length;t<n;t++){var i=e.childList[t];if(!i.bSelected&&!i.data.isStatusNode&&!i.data.unselectable){r=!1;break}}r&&e._select(!0,!1,!1),e=e.parent}}else{this._setSubSel(!1),this.visit(function(e){e._setSubSel(!1),e._select(!1,!1,!1)}),e=this.parent;while(e){e._select(!1,!1,!1);var s=!1;for(t=0,n=e.childList.length;t<n;t++)if(e.childList[t].bSelected||e.childList[t].hasSubSel){s=!0;break}e._setSubSel(s),e=e.parent}}},_select:function(e,t,n){var r=this.tree.options;if(this.data.isStatusNode)return;if(this.bSelected===e)return;if(t&&r.onQuerySelect&&r.onQuerySelect.call(this.tree,e,this)===!1)return;r.selectMode==1&&e&&this.tree.visit(function(e){if(e.bSelected)return e._select(!1,!1,!1),!1}),this.bSelected=e,e?(r.persist&&this.tree.persistence.addSelect(this.data.key),$(this.span).addClass(r.classNames.selected),n&&r.selectMode===3&&this._fixSelectionState(),t&&r.onSelect&&r.onSelect.call(this.tree,!0,this)):(r.persist&&this.tree.persistence.clearSelect(this.data.key),$(this.span).removeClass(r.classNames.selected),n&&r.selectMode===3&&this._fixSelectionState(),t&&r.onSelect&&r.onSelect.call(this.tree,!1,this))},select:function(e){return this.data.unselectable?this.bSelected:this._select(e!==!1,!0,!0)},toggleSelect:function(){return this.select(!this.bSelected)},isSelected:function(){return this.bSelected},isLazy:function(){return!!this.data.isLazy},_loadContent:function(){try{var e=this.tree.options;this.tree.logDebug("_loadContent: start - %o",this),this.setLazyNodeStatus(DTNodeStatus_Loading),!0===e.onLazyRead.call(this.tree,this)&&(this.setLazyNodeStatus(DTNodeStatus_Ok),this.tree.logDebug("_loadContent: succeeded - %o",this))}catch(t){this.tree.logWarning("_loadContent: failed - %o",t),this.setLazyNodeStatus(DTNodeStatus_Error,{tooltip:""+t})}},_expand:function(e,t){if(this.bExpanded===e){this.tree.logDebug("dtnode._expand(%o) IGNORED - %o",e,this);return}this.tree.logDebug("dtnode._expand(%o) - %o",e,this);var n=this.tree.options;if(!e&&this.getLevel()<n.minExpandLevel){this.tree.logDebug("dtnode._expand(%o) prevented collapse - %o",e,this);return}if(n.onQueryExpand&&n.onQueryExpand.call(this.tree,e,this)===!1)return;this.bExpanded=e,n.persist&&(e?this.tree.persistence.addExpand(this.data.key):this.tree.persistence.clearExpand(this.data.key));var r=(!this.data.isLazy||this.childList!==null)&&!this._isLoading&&!t;this.render(r);if(this.bExpanded&&this.parent&&n.autoCollapse){var i=this._parentList(!1,!0);for(var s=0,o=i.length;s<o;s++)i[s].collapseSiblings()}n.activeVisible&&this.tree.activeNode&&!this.tree.activeNode.isVisible()&&this.tree.activeNode.deactivate();if(e&&this.data.isLazy&&this.childList===null&&!this._isLoading){this._loadContent();return}n.onExpand&&n.onExpand.call(this.tree,e,this)},isExpanded:function(){return this.bExpanded},expand:function(e){e=e!==!1;if(!this.childList&&!this.data.isLazy&&e)return;if(this.parent===null&&!e)return;this._expand(e)},scheduleAction:function(e,t){this.tree.timer&&(clearTimeout(this.tree.timer),this.tree.logDebug("clearTimeout(%o)",this.tree.timer));var n=this;switch(e){case"cancel":break;case"expand":this.tree.timer=setTimeout(function(){n.tree.logDebug("setTimeout: trigger expand"),n.expand(!0)},t);break;case"activate":this.tree.timer=setTimeout(function(){n.tree.logDebug("setTimeout: trigger activate"),n.activate()},t);break;default:throw"Invalid mode "+e}this.tree.logDebug("setTimeout(%s, %s): %s",e,t,this.tree.timer)},toggleExpand:function(){this.expand(!this.bExpanded)},collapseSiblings:function(){if(this.parent===null)return;var e=this.parent.childList;for(var t=0,n=e.length;t<n;t++)e[t]!==this&&e[t].bExpanded&&e[t]._expand(!1)},_onClick:function(e){var t=this.getEventTargetType(e);if(t==="expander")this.toggleExpand(),this.focus();else if(t==="checkbox")this.toggleSelect(),this.focus();else{this._userActivate();var n=this.span.getElementsByTagName("a");if(!n[0])return!0;BROWSER.msie&&parseInt(BROWSER.version,10)<9||n[0].focus()}e.preventDefault()},_onDblClick:function(e){},_onKeydown:function(e){var t=!0,n;switch(e.which){case 107:case 187:this.bExpanded||this.toggleExpand();break;case 109:case 189:this.bExpanded&&this.toggleExpand();break;case 32:this._userActivate();break;case 8:this.parent&&this.parent.focus();break;case 37:this.bExpanded?(this.toggleExpand(),this.focus()):this.parent&&this.parent.parent&&this.parent.focus();break;case 39:!this.bExpanded&&(this.childList||this.data.isLazy)?(this.toggleExpand(),this.focus()):this.childList&&this.childList[0].focus();break;case 38:n=this.getPrevSibling();while(n&&n.bExpanded&&n.childList)n=n.childList[n.childList.length-1];!n&&this.parent&&this.parent.parent&&(n=this.parent),n&&n.focus();break;case 40:if(this.bExpanded&&this.childList)n=this.childList[0];else{var r=this._parentList(!1,!0);for(var i=r.length-1;i>=0;i--){n=r[i].getNextSibling();if(n)break}}n&&n.focus();break;default:t=!1}t&&e.preventDefault()},_onKeypress:function(e){},_onFocus:function(e){var t=this.tree.options;if(e.type=="blur"||e.type=="focusout")t.onBlur&&t.onBlur.call(this.tree,this),this.tree.tnFocused&&$(this.tree.tnFocused.span).removeClass(t.classNames.focused),this.tree.tnFocused=null,t.persist&&$.cookie(t.cookieId+"-focus","",t.cookie);else if(e.type=="focus"||e.type=="focusin")this.tree.tnFocused&&this.tree.tnFocused!==this&&(this.tree.logDebug("dtnode.onFocus: out of sync: curFocus: %o",this.tree.tnFocused),$(this.tree.tnFocused.span).removeClass(t.classNames.focused)),this.tree.tnFocused=this,t.onFocus&&t.onFocus.call(this.tree,this),$(this.tree.tnFocused.span).addClass(t.classNames.focused),t.persist&&$.cookie(t.cookieId+"-focus",this.data.key,t.cookie)},visit:function(e,t){var n=!0;if(t===!0){n=e(this);if(n===!1||n=="skip")return n}if(this.childList)for(var r=0,i=this.childList.length;r<i;r++){n=this.childList[r].visit(e,!0);if(n===!1)break}return n},visitParents:function(e,t){if(t&&e(this)===!1)return!1;var n=this.parent;while(n){if(e(n)===!1)return!1;n=n.parent}return!0},remove:function(){if(this===this.tree.root)throw"Cannot remove system root";return this.parent.removeChild(this)},removeChild:function(e){var t=this.childList;if(t.length==1){if(e!==t[0])throw"removeChild: invalid child";return this.removeChildren()}e===this.tree.activeNode&&e.deactivate(),this.tree.options.persist&&(e.bSelected&&this.tree.persistence.clearSelect(e.data.key),e.bExpanded&&this.tree.persistence.clearExpand(e.data.key)),e.removeChildren(!0),this.ul&&this.ul.removeChild(e.li);for(var n=0,r=t.length;n<r;n++)if(t[n]===e){this.childList.splice(n,1);break}},removeChildren:function(e,t){this.tree.logDebug("%s.removeChildren(%o)",this,e);var n=this.tree,r=this.childList;if(r){for(var i=0,s=r.length;i<s;i++){var o=r[i];o===n.activeNode&&!t&&o.deactivate(),this.tree.options.persist&&!t&&(o.bSelected&&this.tree.persistence.clearSelect(o.data.key),o.bExpanded&&this.tree.persistence.clearExpand(o.data.key)),o.removeChildren(!0,t),this.ul&&$("li",$(this.ul)).remove()}this.childList=null}e||(this._isLoading=!1,this.render())},setTitle:function(e){this.fromDict({title:e})},reload:function(e){throw"Use reloadChildren() instead"},reloadChildren:function(e){if(this.parent===null)throw"Use tree.reload() instead";if(!this.data.isLazy)throw"node.reloadChildren() requires lazy nodes.";if(e){var t=this,n="nodeLoaded.dynatree."+this.tree.$tree.attr("id")+"."+this.data.key;this.tree.$tree.bind(n,function(r,i,s){t.tree.$tree.unbind(n),t.tree.logDebug("loaded %o, %o, %o",r,i,s);if(i!==t)throw"got invalid load event";e.call(t.tree,i,s)})}this.removeChildren(),this._loadContent()},_loadKeyPath:function(e,t){var n=this.tree;n.logDebug("%s._loadKeyPath(%s)",this,e);if(e==="")throw"Key path must not be empty";var r=e.split(n.options.keyPathSeparator);if(r[0]==="")throw"Key path must be relative (don't start with '/')";var i=r.shift();if(this.childList)for(var s=0,o=this.childList.length;s<o;s++){var u=this.childList[s];if(u.data.key===i){if(r.length===0)t.call(n,u,"ok");else if(!u.data.isLazy||u.childList!==null&&u.childList!==undefined)t.call(n,u,"loaded"),u._loadKeyPath(r.join(n.options.keyPathSeparator),t);else{n.logDebug("%s._loadKeyPath(%s) -> reloading %s...",this,e,u);var a=this;u.reloadChildren(function(i,s){s?(n.logDebug("%s._loadKeyPath(%s) -> reloaded %s.",i,e,i),t.call(n,u,"loaded"),i._loadKeyPath(r.join(n.options.keyPathSeparator),t)):(n.logWarning("%s._loadKeyPath(%s) -> reloadChildren() failed.",a,e),t.call(n,u,"error"))})}return}}t.call(n,undefined,"notfound",i,r.length===0),n.logWarning("Node not found: "+i);return},resetLazy:function(){if(this.parent===null)throw"Use tree.reload() instead";if(!this.data.isLazy)throw"node.resetLazy() requires lazy nodes.";this.expand(!1),this.removeChildren()},_addChildNode:function(e,t){var n=this.tree,r=n.options,i=n.persistence;e.parent=this,this.childList===null?this.childList=[]:t||this.childList.length>0&&$(this.childList[this.childList.length-1].span).removeClass(r.classNames.lastsib);if(t){var s=$.inArray(t,this.childList);if(s<0)throw"<beforeNode> must be a child of <this>";this.childList.splice(s,0,e)}else this.childList.push(e);var o=n.isInitializing();r.persist&&i.cookiesFound&&o?(i.activeKey===e.data.key&&(n.activeNode=e),i.focusedKey===e.data.key&&(n.focusNode=e),e.bExpanded=$.inArray(e.data.key,i.expandedKeyList)>=0,e.bSelected=$.inArray(e.data.key,i.selectedKeyList)>=0):(e.data.activate&&(n.activeNode=e,r.persist&&(i.activeKey=e.data.key)),e.data.focus&&(n.focusNode=e,r.persist&&(i.focusedKey=e.data.key)),e.bExpanded=e.data.expand===!0,e.bExpanded&&r.persist&&i.addExpand(e.data.key),e.bSelected=e.data.select===!0,e.bSelected&&r.persist&&i.addSelect(e.data.key)),r.minExpandLevel>=e.getLevel()&&(this.bExpanded=!0);if(e.bSelected&&r.selectMode==3){var u=this;while(u)u.hasSubSel||u._setSubSel(!0),u=u.parent}return n.bEnableUpdate&&this.render(),e},addChild:function(e,t){if(typeof e=="string")throw"Invalid data type for "+e;if(!e||e.length===0)return;if(e instanceof DynaTreeNode)return this._addChildNode(e,t);e.length||(e=[e]);var n=this.tree.enableUpdate(!1),r=null;for(var i=0,s=e.length;i<s;i++){var o=e[i],u=this._addChildNode(new DynaTreeNode(this,this.tree,o),t);r||(r=u),o.children&&u.addChild(o.children,null)}return this.tree.enableUpdate(n),r},append:function(e){return this.tree.logWarning("node.append() is deprecated (use node.addChild() instead)."),this.addChild(e,null)},appendAjax:function(e){var t=this;this.removeChildren(!1,!0),this.setLazyNodeStatus(DTNodeStatus_Loading);if(e.debugLazyDelay){var n=e.debugLazyDelay;e.debugLazyDelay=0,this.tree.logInfo("appendAjax: waiting for debugLazyDelay "+n),setTimeout(function(){t.appendAjax(e)},n);return}var r=e.success,i=e.error,s="nodeLoaded.dynatree."+this.tree.$tree.attr("id")+"."+this.data.key,o=$.extend({},this.tree.options.ajaxDefaults,e,{success:function(e,n,i){var u=t.tree.phase;t.tree.phase="init",o.postProcess?e=o.postProcess.call(this,e,this.dataType):e&&e.hasOwnProperty("d")&&(e=typeof e.d=="string"?$.parseJSON(e.d):e.d),(!$.isArray(e)||e.length!==0)&&t.addChild(e,null),t.tree.phase="postInit",r&&r.call(o,t,e,n),t.tree.logDebug("trigger "+s),t.tree.$tree.trigger(s,[t,!0]),t.tree.phase=u,t.setLazyNodeStatus(DTNodeStatus_Ok),$.isArray(e)&&e.length===0&&(t.childList=[],t.render())},error:function(e,n,r){t.tree.logWarning("appendAjax failed:",n,":\n",e,"\n",r),i&&i.call(o,t,e,n,r),t.tree.$tree.trigger(s,[t,!1]),t.setLazyNodeStatus(DTNodeStatus_Error,{info:n,tooltip:""+r})}});$.ajax(o)},move:function(e,t){var n;if(this===e)return;if(!this.parent)throw"Cannot move system root";if(t===undefined||t=="over")t="child";var r=this.parent,i=t==="child"?e:e.parent;if(i.isDescendantOf(this))throw"Cannot move a node to it's own descendant";if(this.parent.childList.length==1)this.parent.childList=this.parent.data.isLazy?[]:null,this.parent.bExpanded=!1;else{n=$.inArray(this,this.parent.childList);if(n<0)throw"Internal error";this.parent.childList.splice(n,1)}this.parent.ul&&this.parent.ul.removeChild(this.li),this.parent=i;if(i.hasChildren())switch(t){case"child":i.childList.push(this);break;case"before":n=$.inArray(e,i.childList);if(n<0)throw"Internal error";i.childList.splice(n,0,this);break;case"after":n=$.inArray(e,i.childList);if(n<0)throw"Internal error";i.childList.splice(n+1,0,this);break;default:throw"Invalid mode "+t}else i.childList=[this];i.ul||(i.ul=document.createElement("ul"),i.ul.style.display="none",i.li.appendChild(i.ul)),this.li&&i.ul.appendChild(this.li);if(this.tree!==e.tree)throw this.visit(function(t){t.tree=e.tree},null,!0),"Not yet implemented.";r.isDescendantOf(i)||r.render(),i.isDescendantOf(r)||i.render()},lastentry:undefined};var DynaTreeStatus=Class.create();DynaTreeStatus._getTreePersistData=function(e,t){var n=new DynaTreeStatus(e,t);return n.read(),n.toDict()},getDynaTreePersistData=DynaTreeStatus._getTreePersistData,DynaTreeStatus.prototype={initialize:function(e,t){e===undefined&&(e=$.ui.dynatree.prototype.options.cookieId),t=$.extend({},$.ui.dynatree.prototype.options.cookie,t),this.cookieId=e,this.cookieOpts=t,this.cookiesFound=undefined,this.activeKey=null,this.focusedKey=null,this.expandedKeyList=null,this.selectedKeyList=null},_log:function(e){Array.prototype.unshift.apply(arguments,["debug"]),_log.apply(this,arguments)},read:function(){this.cookiesFound=!1;var e=$.cookie(this.cookieId+"-active");this.activeKey=e===null?"":e,e!==null&&(this.cookiesFound=!0),e=$.cookie(this.cookieId+"-focus"),this.focusedKey=e===null?"":e,e!==null&&(this.cookiesFound=!0),e=$.cookie(this.cookieId+"-expand"),this.expandedKeyList=e===null?[]:e.split(","),e!==null&&(this.cookiesFound=!0),e=$.cookie(this.cookieId+"-select"),this.selectedKeyList=e===null?[]:e.split(","),e!==null&&(this.cookiesFound=!0)},write:function(){$.cookie(this.cookieId+"-active",this.activeKey===null?"":this.activeKey,this.cookieOpts),$.cookie(this.cookieId+"-focus",this.focusedKey===null?"":this.focusedKey,this.cookieOpts),$.cookie(this.cookieId+"-expand",this.expandedKeyList===null?"":this.expandedKeyList.join(","),this.cookieOpts),$.cookie(this.cookieId+"-select",this.selectedKeyList===null?"":this.selectedKeyList.join(","),this.cookieOpts)},addExpand:function(e){$.inArray(e,this.expandedKeyList)<0&&(this.expandedKeyList.push(e),$.cookie(this.cookieId+"-expand",this.expandedKeyList.join(","),this.cookieOpts))},clearExpand:function(e){var t=$.inArray(e,this.expandedKeyList);t>=0&&(this.expandedKeyList.splice(t,1),$.cookie(this.cookieId+"-expand",this.expandedKeyList.join(","),this.cookieOpts))},addSelect:function(e){$.inArray(e,this.selectedKeyList)<0&&(this.selectedKeyList.push(e),$.cookie(this.cookieId+"-select",this.selectedKeyList.join(","),this.cookieOpts))},clearSelect:function(e){var t=$.inArray(e,this.selectedKeyList);t>=0&&(this.selectedKeyList.splice(t,1),$.cookie(this.cookieId+"-select",this.selectedKeyList.join(","),this.cookieOpts))},isReloading:function(){return this.cookiesFound===!0},toDict:function(){return{cookiesFound:this.cookiesFound,activeKey:this.activeKey,focusedKey:this.activeKey,expandedKeyList:this.expandedKeyList,selectedKeyList:this.selectedKeyList}},lastentry:undefined};var DynaTree=Class.create();DynaTree.version="$Version:$",DynaTree.prototype={initialize:function(e){this.phase="init",this.$widget=e,this.options=e.options,this.$tree=e.element,this.timer=null,this.divTree=this.$tree.get(0),_initDragAndDrop(this)},_load:function(e){var t=this.$widget,n=this.options,r=this;this.bEnableUpdate=!0,this._nodeCount=1,this.activeNode=null,this.focusNode=null,n.rootVisible!==undefined&&this.logWarning("Option 'rootVisible' is no longer supported."),n.minExpandLevel<1&&(this.logWarning("Option 'minExpandLevel' must be >= 1."),n.minExpandLevel=1),n.classNames!==$.ui.dynatree.prototype.options.classNames&&(n.classNames=$.extend({},$.ui.dynatree.prototype.options.classNames,n.classNames)),n.ajaxDefaults!==$.ui.dynatree.prototype.options.ajaxDefaults&&(n.ajaxDefaults=$.extend({},$.ui.dynatree.prototype.options.ajaxDefaults,n.ajaxDefaults)),n.dnd!==$.ui.dynatree.prototype.options.dnd&&(n.dnd=$.extend({},$.ui.dynatree.prototype.options.dnd,n.dnd)),n.imagePath||$("script").each(function(){var e=/.*dynatree[^\/]*\.js$/i;if(this.src.search(e)>=0)return this.src.indexOf("/")>=0?n.imagePath=this.src.slice(0,this.src.lastIndexOf("/"))+"/skin/":n.imagePath="skin/",r.logDebug("Guessing imagePath from '%s': '%s'",this.src,n.imagePath),!1}),this.persistence=new DynaTreeStatus(n.cookieId,n.cookie),n.persist&&($.cookie||_log("warn","Please include jquery.cookie.js to use persistence."),this.persistence.read()),this.logDebug("DynaTree.persistence: %o",this.persistence.toDict()),this.cache={tagEmpty:"<span class='"+n.classNames.empty+"'></span>",tagVline:"<span class='"+n.classNames.vline+"'></span>",tagExpander:"<span class='"+n.classNames.expander+"'></span>",tagConnector:"<span class='"+n.classNames.connector+"'></span>",tagNodeIcon:"<span class='"+n.classNames.nodeIcon+"'></span>",tagCheckbox:"<span class='"+n.classNames.checkbox+"'></span>",lastentry:undefined},(n.children||n.initAjax&&n.initAjax.url||n.initId)&&$(this.divTree).empty();var i=this.$tree.find(">ul:first").hide();this.tnRoot=new DynaTreeNode(null,this,{}),this.tnRoot.bExpanded=!0,this.tnRoot.render(),this.divTree.appendChild(this.tnRoot.ul);var s=this.tnRoot,o=n.persist&&this.persistence.isReloading(),u=!1,a=this.enableUpdate(!1);this.logDebug("Dynatree._load(): read tree structure..."),n.children?s.addChild(n.children):n.initAjax&&n.initAjax.url?(u=!0,s.data.isLazy=!0,this._reloadAjax(e)):n.initId?this._createFromTag(s,$("#"+n.initId)):(this._createFromTag(s,i),i.remove()),this._checkConsistency(),!u&&n.selectMode==3&&s._updatePartSelectionState(),this.logDebug("Dynatree._load(): render nodes..."),this.enableUpdate(a),this.logDebug("Dynatree._load(): bind events..."),this.$widget.bind(),this.logDebug("Dynatree._load(): postInit..."),this.phase="postInit",n.persist&&this.persistence.write(),this.focusNode&&this.focusNode.isVisible()&&(this.logDebug("Focus on init: %o",this.focusNode),this.focusNode.focus()),u||(n.onPostInit&&n.onPostInit.call(this,o,!1),e&&e.call(this,"ok")),this.phase="idle"},_reloadAjax:function(e){var t=this.options;if(!t.initAjax||!t.initAjax.url)throw"tree.reload() requires 'initAjax' mode.";var n=this.persistence,r=$.extend({},t.initAjax);r.addActiveKey&&(r.data.activeKey=n.activeKey),r.addFocusedKey&&(r.data.focusedKey=n.focusedKey),r.addExpandedKeyList&&(r.data.expandedKeyList=n.expandedKeyList.join(",")),r.addSelectedKeyList&&(r.data.selectedKeyList=n.selectedKeyList.join(",")),r.success&&this.logWarning("initAjax: success callback is ignored; use onPostInit instead."),r.error&&this.logWarning("initAjax: error callback is ignored; use onPostInit instead.");var i=n.isReloading();r.success=function(n,r,s){t.selectMode==3&&n.tree.tnRoot._updatePartSelectionState(),t.onPostInit&&t.onPostInit.call(n.tree,i,!1),e&&e.call(n.tree,"ok")},r.error=function(n,r,s,o){t.onPostInit&&t.onPostInit.call(n.tree,i,!0,r,s,o),e&&e.call(n.tree,"error",r,s,o)},this.logDebug("Dynatree._init(): send Ajax request..."),this.tnRoot.appendAjax(r)},toString:function(){return"Dynatree '"+this.$tree.attr("id")+"'"},toDict:function(){return this.tnRoot.toDict(!0)},serializeArray:function(e){var t=this.getSelectedNodes(e),n=this.$tree.attr("name")||this.$tree.attr("id"),r=[];for(var i=0,s=t.length;i<s;i++)r.push({name:n,value:t[i].data.key});return r},getPersistData:function(){return this.persistence.toDict()},logDebug:function(e){this.options.debugLevel>=2&&(Array.prototype.unshift.apply(arguments,["debug"]),_log.apply(this,arguments))},logInfo:function(e){this.options.debugLevel>=1&&(Array.prototype.unshift.apply(arguments,["info"]),_log.apply(this,arguments))},logWarning:function(e){Array.prototype.unshift.apply(arguments,["warn"]),_log.apply(this,arguments)},isInitializing:function(){return this.phase=="init"||this.phase=="postInit"},isReloading:function(){return(this.phase=="init"||this.phase=="postInit")&&this.options.persist&&this.persistence.cookiesFound},isUserEvent:function(){return this.phase=="userEvent"},redraw:function(){this.tnRoot.render(!1,!1)},renderInvisibleNodes:function(){this.tnRoot.render(!1,!0)},reload:function(e){this._load(e)},getRoot:function(){return this.tnRoot},enable:function(){this.$widget.enable()},disable:function(){this.$widget.disable()},getNodeByKey:function(e){var t=document.getElementById(this.options.idPrefix+e);if(t)return t.dtnode?t.dtnode:null;var n=null;return this.visit(function(t){if(t.data.key===e)return n=t,!1},!0),n},getActiveNode:function(){return this.activeNode},reactivate:function(e){var t=this.activeNode;t&&(this.activeNode=null,t.activate(),e&&t.focus())},getSelectedNodes:function(e){var t=[];return this.tnRoot.visit(function(n){if(n.bSelected){t.push(n);if(e===!0)return"skip"}}),t},activateKey:function(e){var t=e===null?null:this.getNodeByKey(e);return t?(t.focus(),t.activate(),t):(this.activeNode&&this.activeNode.deactivate(),this.activeNode=null,null)},loadKeyPath:function(e,t){var n=e.split(this.options.keyPathSeparator);return n[0]===""&&n.shift(),n[0]==this.tnRoot.data.key&&(this.logDebug("Removed leading root key."),n.shift()),e=n.join(this.options.keyPathSeparator),this.tnRoot._loadKeyPath(e,t)},selectKey:function(e,t){var n=this.getNodeByKey(e);return n?(n.select(t),n):null},enableUpdate:function(e){return this.bEnableUpdate==e?e:(this.bEnableUpdate=e,e&&this.redraw(),!e)},count:function(){return this.tnRoot.countChildren()},visit:function(e,t){return this.tnRoot.visit(e,t)},_createFromTag:function(parentTreeNode,$ulParent){var self=this;$ulParent.find(">li").each(function(){var $li=$(this),$liSpan=$li.find(">span:first"),$liA=$li.find(">a:first"),title,href=null,target=null,tooltip;if($liSpan.length)title=$liSpan.html();else if($liA.length)title=$liA.html(),href=$liA.attr("href"),target=$liA.attr("target"),tooltip=$liA.attr("title");else{title=$li.html();var iPos=title.search(/<ul/i);iPos>=0?title=$.trim(title.substring(0,iPos)):title=$.trim(title)}var data={title:title,tooltip:tooltip,isFolder:$li.hasClass("folder"),isLazy:$li.hasClass("lazy"),expand:$li.hasClass("expanded"),select:$li.hasClass("selected"),activate:$li.hasClass("active"),focus:$li.hasClass("focused"),noLink:$li.hasClass("noLink")};href&&(data.href=href,data.target=target),$li.attr("title")&&(data.tooltip=$li.attr("title")),$li.attr("id")&&(data.key=""+$li.attr("id"));if($li.attr("data")){var dataAttr=$.trim($li.attr("data"));if(dataAttr){dataAttr.charAt(0)!="{"&&(dataAttr="{"+dataAttr+"}");try{$.extend(data,eval("("+dataAttr+")"))}catch(e){throw"Error parsing node data: "+e+"\ndata:\n'"+dataAttr+"'"}}}var childNode=parentTreeNode.addChild(data),$ul=$li.find(">ul:first");$ul.length&&self._createFromTag(childNode,$ul)})},_checkConsistency:function(){},_setDndStatus:function(e,t,n,r,i){var s=e?$(e.span):null,o=$(t.span);this.$dndMarker||(this.$dndMarker=$("<div id='dynatree-drop-marker'></div>").hide().css({"z-index":1e3}).prependTo($(this.divTree).parent()));if(r==="after"||r==="before"||r==="over"){var u="0 0";switch(r){case"before":this.$dndMarker.removeClass("dynatree-drop-after dynatree-drop-over"),this.$dndMarker.addClass("dynatree-drop-before"),u="0 -8";break;case"after":this.$dndMarker.removeClass("dynatree-drop-before dynatree-drop-over"),this.$dndMarker.addClass("dynatree-drop-after"),u="0 8";break;default:this.$dndMarker.removeClass("dynatree-drop-after dynatree-drop-before"),this.$dndMarker.addClass("dynatree-drop-over"),o.addClass("dynatree-drop-target"),u="8 0"}this.$dndMarker.show().position({my:"left top",at:"left top",of:o,offset:u})}else o.removeClass("dynatree-drop-target"),this.$dndMarker.hide();r==="after"?o.addClass("dynatree-drop-after"):o.removeClass("dynatree-drop-after"),r==="before"?o.addClass("dynatree-drop-before"):o.removeClass("dynatree-drop-before"),i===!0?(s&&s.addClass("dynatree-drop-accept"),o.addClass("dynatree-drop-accept"),n.addClass("dynatree-drop-accept")):(s&&s.removeClass("dynatree-drop-accept"),o.removeClass("dynatree-drop-accept"),n.removeClass("dynatree-drop-accept")),i===!1?(s&&s.addClass("dynatree-drop-reject"),o.addClass("dynatree-drop-reject"),n.addClass("dynatree-drop-reject")):(s&&s.removeClass("dynatree-drop-reject"),o.removeClass("dynatree-drop-reject"),n.removeClass("dynatree-drop-reject"))},_onDragEvent:function(e,t,n,r,i,s){var o=this.options,u=this.options.dnd,a=null,f=$(t.span),l,c;switch(e){case"helper":var h=$("<div class='dynatree-drag-helper'><span class='dynatree-drag-helper-img' /></div>").append($(r.target).closest(".dynatree-title").clone());$("ul.dynatree-container",t.tree.divTree).append(h),h.data("dtSourceNode",t),a=h;break;case"start":t.isStatusNode()?a=!1:u.onDragStart&&(a=u.onDragStart(t)),a===!1?(this.logDebug("tree.onDragStart() cancelled"),i.helper.trigger("mouseup"),i.helper.hide()):f.addClass("dynatree-drag-source");break;case"enter":a=u.onDragEnter?u.onDragEnter(t,n):null,a?a={over:a===!0||a==="over"||$.inArray("over",a)>=0,before:a===!0||a==="before"||$.inArray("before",a)>=0,after:a===!0||a==="after"||$.inArray("after",a)>=0}:a=!1,i.helper.data("enterResponse",a);break;case"over":c=i.helper.data("enterResponse"),l=null;if(c!==!1)if(typeof c=="string")l=c;else{var p=f.offset(),d={x:r.pageX-p.left,y:r.pageY-p.top},v={x:d.x/f.width(),y:d.y/f.height()};c.after&&v.y>.75?l="after":!c.over&&c.after&&v.y>.5?l="after":c.before&&v.y<=.25?l="before":!c.over&&c.before&&v.y<=.5?l="before":c.over&&(l="over"),u.preventVoidMoves&&(t===n?l=null:l==="before"&&n&&t===n.getNextSibling()?l=null:l==="after"&&n&&t===n.getPrevSibling()?l=null:l==="over"&&n&&n.parent===t&&n.isLastSibling()&&(l=null)),i.helper.data("hitMode",l)}l==="over"&&u.autoExpandMS&&t.hasChildren()!==!1&&!t.bExpanded&&t.scheduleAction("expand",u.autoExpandMS);if(l&&u.onDragOver){a=u.onDragOver(t,n,l);if(a==="over"||a==="before"||a==="after")l=a}this._setDndStatus(n,t,i.helper,l,a!==!1&&l!==null);break;case"drop":var m=i.helper.hasClass("dynatree-drop-reject");l=i.helper.data("hitMode"),l&&u.onDrop&&!m&&u.onDrop(t,n,l,i,s);break;case"leave":t.scheduleAction("cancel"),i.helper.data("enterResponse",null),i.helper.data("hitMode",null),this._setDndStatus(n,t,i.helper,"out",undefined),u.onDragLeave&&u.onDragLeave(t,n);break;case"stop":f.removeClass("dynatree-drag-source"),u.onDragStop&&u.onDragStop(t);break;default:throw"Unsupported drag event: "+e}return a},cancelDrag:function(){var e=$.ui.ddmanager.current;e&&e.cancel()},lastentry:undefined},$.widget("ui.dynatree",{_init:function(){if(versionCompare($.ui.version,"1.8")<0)return this.options.debugLevel>=0&&_log("warn","ui.dynatree._init() was called; you should upgrade to jquery.ui.core.js v1.8 or higher."),this._create();this.options.debugLevel>=2&&_log("debug","ui.dynatree._init() was called; no current default functionality.")},_create:function(){var e=this.options;e.debugLevel>=1&&logMsg("Dynatree._create(): version='%s', debugLevel=%o.",$.ui.dynatree.version,this.options.debugLevel),this.options.event+=".dynatree";var t=this.element.get(0);this.tree=new DynaTree(this),this.tree._load(),this.tree.logDebug("Dynatree._init(): done.")},bind:function(){function t(e){e=$.event.fix(e||window.event);var t=$.ui.dynatree.getNode(e.target);return t?t._onFocus(e):!1}this.unbind();var e="click.dynatree dblclick.dynatree";this.options.keyboard&&(e+=" keypress.dynatree keydown.dynatree"),this.element.bind(e,function(e){var t=$.ui.dynatree.getNode(e.target);if(!t)return!0;var n=t.tree,r=n.options;n.logDebug("event(%s): dtnode: %s",e.type,t);var i=n.phase;n.phase="userEvent";try{switch(e.type){case"click":return r.onClick&&r.onClick.call(n,t,e)===!1?!1:t._onClick(e);case"dblclick":return r.onDblClick&&r.onDblClick.call(n,t,e)===!1?!1:t._onDblClick(e);case"keydown":return r.onKeydown&&r.onKeydown.call(n,t,e)===!1?!1:t._onKeydown(e);case"keypress":return r.onKeypress&&r.onKeypress.call(n,t,e)===!1?!1:t._onKeypress(e)}}catch(s){var o=null;n.logWarning("bind(%o): dtnode: %o, error: %o",e,t,s)}finally{n.phase=i}});var n=this.tree.divTree;n.addEventListener?(n.addEventListener("focus",t,!0),n.addEventListener("blur",t,!0)):n.onfocusin=n.onfocusout=t},unbind:function(){this.element.unbind(".dynatree")},enable:function(){this.bind(),$.Widget.prototype.enable.apply(this,arguments)},disable:function(){this.unbind(),$.Widget.prototype.disable.apply(this,arguments)},getTree:function(){return this.tree},getRoot:function(){return this.tree.getRoot()},getActiveNode:function(){return this.tree.getActiveNode()},getSelectedNodes:function(){return this.tree.getSelectedNodes()},lastentry:undefined}),versionCompare($.ui.version,"1.8")<0&&($.ui.dynatree.getter="getTree getRoot getActiveNode getSelectedNodes"),$.ui.dynatree.version="$Version:$",$.ui.dynatree.getNode=function(e){if(e instanceof DynaTreeNode)return e;e.selector!==undefined&&(e=e[0]);while(e){if(e.dtnode)return e.dtnode;e=e.parentNode}return null},$.ui.dynatree.getPersistData=DynaTreeStatus._getTreePersistData,$.ui.dynatree.prototype.options={title:"Dynatree",minExpandLevel:1,imagePath:null,children:null,initId:null,initAjax:null,autoFocus:!0,keyboard:!0,persist:!1,autoCollapse:!1,clickFolderMode:3,activeVisible:!0,checkbox:!1,selectMode:2,fx:null,noLink:!1,onClick:null,onDblClick:null,onKeydown:null,onKeypress:null,onFocus:null,onBlur:null,onQueryActivate:null,onQuerySelect:null,onQueryExpand:null,onPostInit:null,onActivate:null,onDeactivate:null,onSelect:null,onExpand:null,onLazyRead:null,onCustomRender:null,onCreate:null,onRender:null,postProcess:null,dnd:{onDragStart:null,onDragStop:null,autoExpandMS:1e3,preventVoidMoves:!0,onDragEnter:null,onDragOver:null,onDrop:null,onDragLeave:null},ajaxDefaults:{cache:!1,timeout:0,dataType:"json"},strings:{loading:"Loading&#8230;",loadError:"Load error!"},generateIds:!1,idPrefix:"dynatree-id-",keyPathSeparator:"/",cookieId:"dynatree",cookie:{expires:null},classNames:{container:"dynatree-container",node:"dynatree-node",folder:"dynatree-folder",empty:"dynatree-empty",vline:"dynatree-vline",expander:"dynatree-expander",connector:"dynatree-connector",checkbox:"dynatree-checkbox",nodeIcon:"dynatree-icon",title:"dynatree-title",noConnector:"dynatree-no-connector",nodeError:"dynatree-statusnode-error",nodeWait:"dynatree-statusnode-wait",hidden:"dynatree-hidden",combinedExpanderPrefix:"dynatree-exp-",combinedIconPrefix:"dynatree-ico-",nodeLoading:"dynatree-loading",hasChildren:"dynatree-has-children",active:"dynatree-active",selected:"dynatree-selected",expanded:"dynatree-expanded",lazy:"dynatree-lazy",focused:"dynatree-focused",partsel:"dynatree-partsel",lastsib:"dynatree-lastsib"},debugLevel:2,lastentry:undefined},versionCompare($.ui.version,"1.8")<0&&($.ui.dynatree.defaults=$.ui.dynatree.prototype.options),$.ui.dynatree.nodedatadefaults={title:null,key:null,isFolder:!1,isLazy:!1,tooltip:null,href:null,icon:null,addClass:null,noLink:!1,activate:!1,focus:!1,expand:!1,select:!1,hideCheckbox:!1,unselectable:!1,children:null,lastentry:undefined};var didRegisterDnd=!1,_registerDnd=function(){if(didRegisterDnd)return;$.ui.plugin.add("draggable","connectToDynatree",{start:function(e,t){var n=$(this).data("ui-draggable")||$(this).data("draggable"),r=t.helper.data("dtSourceNode")||null;if(r)return n.offset.click.top=-2,n.offset.click.left=16,r.tree._onDragEvent("start",r,null,e,t,n)},drag:function(e,t){var n=$(this).data("ui-draggable")||$(this).data("draggable"),r=t.helper.data("dtSourceNode")||null,i=t.helper.data("dtTargetNode")||null,s=$.ui.dynatree.getNode(e.target);if(e.target&&!s){var o=$(e.target).closest("div.dynatree-drag-helper,#dynatree-drop-marker").length>0;if(o)return}t.helper.data("dtTargetNode",s),i&&i!==s&&i.tree._onDragEvent("leave",i,r,e,t,n),s&&(!s.tree.options.dnd.onDrop||(s===i?s.tree._onDragEvent("over",s,r,e,t,n):s.tree._onDragEvent("enter",s,r,e,t,n)))},stop:function(e,t){var n=$(this).data("ui-draggable")||$(this).data("draggable"),r=t.helper.data("dtSourceNode")||null,i=t.helper.data("dtTargetNode")||null,s=n._mouseDownEvent,o=e.type,u=o=="mouseup"&&e.which==1;logMsg("draggable-connectToDynatree.stop: targetNode(from event): %s, dtTargetNode: %s",i,t.helper.data("dtTargetNode")),u||logMsg("Drag was cancelled"),i&&(u&&i.tree._onDragEvent("drop",i,r,e,t,n),i.tree._onDragEvent("leave",i,r,e,t,n)),r&&r.tree._onDragEvent("stop",r,null,e,t,n)}}),didRegisterDnd=!0}})(jQuery);
/**
 *  KKUsersManagerWidget
 * @constructor
 */   
function KKAdminUsersManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("kk_userAdmin", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        var groupsR = DATA.getRemote("aurora_groups", "", NOT_READY, POLL_RATES.VERY_FAST); //, NOT_READY, POLL_RATES.SLOW
        var renderedTableB = F.liftBI(function(data, groups){
            if(data==NOT_READY||groups==NOT_READY)
                return NOT_READY;
            for(colIndex in data["COLUMNS"]){
                if(data["COLUMNS"][colIndex]["reference"]=="group"){
                    if(data["COLUMNMETADATA"][colIndex]==undefined)
                        data["COLUMNMETADATA"][colIndex] = {};
                    data["COLUMNMETADATA"][colIndex]["renderer"] = new AuroraUserGroupColumn(groups["DATA"]);
                }
            
            }
            //showObj(data);
            return data;
        },function(value){
            return [value, null];
        }, dataR.behaviour, groupsR.behaviour);
    
    tableB = TableWidgetB(instanceId+"_table", data, renderedTableB);    
    F.insertDomB(tableB, instanceId+"_container");
    
    }
    this.destroy=function(){
        DATA.deregister("kk_userAdmin", "");
        DATA.deregister("aurora_groups", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}
WIDGETS.register("KKAdminUsersManagerWidget", KKAdminUsersManagerWidget);  


function SchoolManagementWidget(instanceId, data){       
	this.loader=function(){
		   var schoolsAdminR = DATA.getRemote("konfidentkidz_allSchools", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
	        var renderedTableB = F.liftBI(function(data){
	            if(data==NOT_READY){
	                return NOT_READY;
	            }
	            return data;
	        },function(value){
	            return [value];
	        }, schoolsAdminR.behaviour);
	    
	    tableB = TableWidgetB(instanceId+"_table", data, renderedTableB);    
	    F.insertDomB(tableB, instanceId+"_container");
	    
    }    
    this.build=function(){
    	return "<div id=\""+instanceId+"_container\">Loading</div>";
    }
    this.destroy=function(){
    }
}

WIDGETS.register("SchoolManagementWidget", SchoolManagementWidget);







function SeminarSelectionField(instanceId, data){;
    this.instanceId = instanceId;
    var targetId = data.targetId;
    this.loader=function(){    
        var table = DOM.get(targetId);
        if(table==undefined){
        	return;
        }
        var lastTitle = "";
        for (var i = 0, row; row = table.rows[i]; i++) {
            var text = (row.cells[1].textContent || row.cells[1].innerText || "").trim();
            var title = (row.cells[0].textContent || row.cells[0].innerText || "").trim();
            lastTitle = (title!="")?title:lastTitle;
            var optionText = lastTitle+" "+text;
            
           DOM.get(this.instanceId).appendChild(DOM.createOption(this.instanceId+"_"+index, undefined, optionText, optionText));
        }
                  
        var valueName = (data.name==undefined)?"Seminar":data.name; 
        var formGroupB = DATA.get(data.formGroup, undefined, {}); 
        var selectValueB = F.extractValueB(this.instanceId);
        var validB = selectValueB.liftB(function(text){      
            return DOM.get(instanceId).selectedIndex!=0;
        });
        var widgetResponseB = F.liftB(function(valid, text){
            if(!good()||text==null){
                return NOT_READY;
            }
          /*  document.getElementById(instanceId).className = (text.length==0)?'':((valid)?'form_validator_validInput':'form_validator_invalidInput');    */
            return {value: text, valid: valid, name: valueName};
        }, validB, selectValueB);  
        
        //pushToValidationGroupBehaviour(instanceId, validationGroupB, validB);
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetResponseB);  
    }      
    this.build=function(){
        var select = DOM.create('select');
        select.id = this.instanceId;
        return select;         
    }
} 





WIDGETS.register("SeminarSelectionField", SeminarSelectionField); 
function KK_showLicensingTerms(callback){
    ajax({
        dataType: 'json',
        url: SETTINGS.scriptPath+"request/getPage/purchase/onlineterms/",
        success: function(data){
            var page = data.html;
            UI.showMessage("", page, callback, {modal: true,draggable:false, resizable: false, width: "70%", height: 500});
        },
        error: connectionError
    }); 
}
function KK_showPrivacyAgreement(callback){
     ajax({
        dataType: 'json',
        url: SETTINGS.scriptPath+"request/getPage/purchase/privacyagreement/",
        success: function(data){
            var page = data.html;
            UI.showMessage("", page, callback, {modal: true,draggable:false, resizable: false, width: "70%", height: 500});
        },
        error: connectionError
    });
}
function KK_showTermsOfUse(callback){
     ajax({
        dataType: 'json',
        url: SETTINGS.scriptPath+"request/getPage/purchase/termsofuse/",
        success: function(data){
            var page = data.html;
            UI.showMessage("", page, callback, {modal: true,draggable:false, resizable: false, width: "70%", height: 500});
        },
        error: connectionError
    }); 
}
function KK_rowClicked(row){
    document.getElementById(row).click();
} 
             
/*function PayPalBuyNowWidget(instanceId, data){
    var productId = data.productId; //WDFXB2W6XQWPC   
    var optionName = data.optionName;//"Number of Students";
    var agreeId = data.agreeId;
    var formGroup = data.formGroup;   
    this.loader=function(){
        var userLoggedInB = userB.liftB(function(user){
            if(user==NOT_READY)
                return NOT_READY;
            document.getElementById("contactTable").style.display = (user.group_id!=1)?'none':'';
            return user.group_id!=1;
        });
        var formGroupB = DATA.get(formGroup, undefined, {});
        var groupDataB = formGroupB.liftB(function(validationMap){
            return F.liftB.apply(this,[function(){
                var groupData = arguments;
                var dataObject = {};
                var valid = true;
                for(entryIndex in groupData){
                    var entry = groupData[entryIndex];
                    //log(entry);
                    dataObject[entry.name] = entry.value;
                    if(!entry.valid){
                        valid = false;
                    }
                }
                dataObject.valid = valid;
                return dataObject;
            }].concat(validationMap));
        }).switchB();            
        var allValidB = groupDataB.liftB(function(groupData){
            if(!good())
                return NOT_READY;
            return groupData.valid;
        });
        var productValidB = formGroupB.liftB(function(validationMap){
            return F.liftB.apply(this,[function(){
                for(entryIndex in arguments){
                    var entry = arguments[entryIndex];
                    if((entry.name=="terms"||entry.name=="product")&&entry.valid==false){
                        return false;
                    }
                }
                return true;
            }].concat(validationMap));
        }).switchB();          
        var checkedB = F.extractValueB(agreeId);
        var targetProductB = jQuery("input:radio[name=numstudents]").fj('extEvtE', 'click').mapE(function(e){
            return (e.originalTarget!=undefined)?e.originalTarget:e.target;
        }).startsWith(""); 
       
       
       
        //F.insertValueB(F.ifB(userLoggedInB, 'none', 'block'),"contactTable", 'style', 'display');
   
        var buttonClickedE = jQuery("#"+instanceId+"_button").fj('extEvtE', 'click').snapshotE(groupDataB);
        var registrationB = getAjaxRequestE(buttonClickedE, "/request/KK_registerUser").mapE(function(data){
            return data;
        }).startsWith(NOT_READY);  
        
        F.liftB(function(targetProduct, groupData, registration, loggedInAndProductValid){ 
            if(!good)
                return NOT_READY;     
            if(loggedInAndProductValid){
                groupData.valid = true;
            }                                            
            document.getElementById(instanceId+"_button").style.display=(groupData.valid?'block':'none');
            if(registration.valid){  //User creation Success
                log("Submiting Form");
                document.getElementById(instanceId+"_optionValue").value = targetProduct.value+" or under";
                document.getElementById(instanceId+"_buttonId").value = productId;
                document.getElementById(instanceId+"_userId").value = registration.userId;                        
                //document.getElementById(instanceId+"_form").submit();
            }    
        }, targetProductB, groupDataB, registrationB, F.andB(productValidB, userLoggedInB));
        
        
        
        var widgetValueB = F.liftB(function(targetProduct){
            return {valid: (targetProduct!=""), value: productId, name: "product"};
        }, targetProductB); 
        
        var productOptionB = F.liftB(function(targetProduct){
            return {valid: (targetProduct!=""), value: targetProduct.value, name: "productoption"};
        }, targetProductB);
        
        var termsAcceptedB = F.liftB(function(checked){
            return {valid: (checked||checked=="true"), value: checked, name: "terms"};
        }, checkedB); 
        
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);
        pushToValidationGroupBehaviour(instanceId, formGroupB, productOptionB);
        pushToValidationGroupBehaviour(instanceId, formGroupB, termsAcceptedB); 
    }
    this.build=function(){
        var optionValue = ""; //100 Students or Under         //target=\"paypal\" 
        return "<form id=\""+instanceId+"_form\" action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\" accept-charset=\"UTF-8\" style=\"display: none;\">"+
"<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">"+
"<input type=\"hidden\" name=\"hosted_button_id\" id=\""+instanceId+"_buttonId\" value=\"\">"+
"<table>"+
"<tr><td><input id=\""+instanceId+"_userId\" type=\"hidden\" name=\"userId\" value=\"\"><input type=\"hidden\" name=\"on0\" value=\"Number of Students\"><input id=\""+instanceId+"_optionValue\" type=\"hidden\" name=\"os0\" value=\"100 or under\">Number of Students</td></tr><tr><td>&nbsp;</td></tr>"+
"</table>"+
"<input type=\"hidden\" name=\"currency_code\" value=\"NZD\">"+
"<input type=\"image\" src=\"/themes/konfidentkidz/purchasenow.png\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">"+
"<img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">"+
"</form>"+
"<span id=\""+instanceId+"_button\" style=\"display: none;margin: 0 auto; margin-top: 10px; \" class=\"button\">Purchase Now</span>";
    }
    this.destroy=function(){
    }                                                    
}  */  
/**
 *  ProductSelectionWidgetConfigurator
 * @constructor
 */                                                      
/*function PayPalBuyNowWidgetConfigurator(){
    var id = "PayPalBuyNowWidgetConfigurator";
    this['load'] = function(newData){}
    this['build'] = function(newData){
        var productId = "";
        var optionName = ""; 
        var agreeId = "";
        if(newData!=undefined){
            productId = newData['productId'];
            optionName = newData['optionName']; 
            agreeId = newData['agreeId'];   
        }
        return "Product Id: <input type=\"text\" id=\""+id+"_productId\" value=\""+productId+"\" /><br />"+
        "Option Name: <input type=\"text\" id=\""+id+"_optionName\" value=\""+optionName+"\" />"+
        "Agree Id: <input type=\"checkbox\" id=\""+id+"_agreeId\" checked=\""+agreeId+"\" />";
              
        //   productId      optionName
    }
    this['getData'] = function(){
        return {"productId": document.getElementById(id+'_productId').value, "optionName": document.getElementById(id+'_optionName').value, "agreeId":document.getElementById(id+'_agreeId').checked};
    }
    this['getName'] = function(){
        return "PayPay Buy Now Button";
    }
    this['getDescription'] = function(){
        return "A Pay Pal Widget With HTML Option Selector";
    }
    this['getPackage'] = function(){
        return "KonfidentKidz";
    }
} 
WIDGETS.register("PayPalBuyNowWidget", PayPalBuyNowWidget, PayPalBuyNowWidgetConfigurator);  */

function KKSchoolMapWidget(instanceId, data){
    var mapW = new GoogleMapWidget(instanceId+"_gmap", data);
    this.loader=function(){ 
        var dataB = DATA.getRemote("konfidentkidz_myschool").behaviour;
        var addressB = dataB.liftB(function(data){
            if(!good())
                return NOT_READY;
            return data.address;
        });
        mapW.loader(addressB); 
    }
    this.build=function(){
        return mapW.build();
    }
    this.destroy=function(){
        mapW.destroy();
    }
}
WIDGETS.register("KKSchoolMapWidget", KKSchoolMapWidget); 

function KKSchoolNameWidget(instanceId, data){
    var element = document.createElement("span");
    element.id = instanceId+"_container";
    this.loader=function(){                
        var dataB = DATA.getRemote("konfidentkidz_myschool").behaviour;
        var addressB = dataB.liftB(function(data){
            if(!good())
                return NOT_READY;
            document.getElementById(element.id).innerHTML = (data.name==undefined)?"":data.name;
        }); 
    }
    this.build=function(){
        return element;
    }
    this.destroy=function(){
    }
}
WIDGETS.register("KKSchoolNameWidget", KKSchoolNameWidget);

function KKSchoolLogoWidget(instanceId, data){
	var widgetRef = data.widgetRef;
	data.dropHtml = "<img src=\"/resources/kk/schoollogo.png\" alt=\"\" />";
	data.dropHoverHtml = "<img src=\"/resources/kk/schoollogo2.png\" alt=\"\" />";
    var imageWidgetW = new UploadableImageWidget(instanceId+"_logo", data);             
    this.loader=function(){
        var dataB = DATA.getRemote("konfidentkidz_myschool").behaviour;
        var newWidgetRefB = F.liftB(function(data){
        	if(!good()){
        		return NOT_READY;
        	}
            imageWidgetW.hide();
            if(!good())
                return NOT_READY;  
            imageWidgetW.show();
            return data.school_id+"_"+widgetRef;
        }, dataB);
        imageWidgetW.loader(newWidgetRefB);    
    	
    }
    this.build=function(){
        return imageWidgetW.build();
    }
    this.destroy=function(){
        imageWidgetW.destroy();
    }
}
WIDGETS.register("KKSchoolLogoWidget", KKSchoolLogoWidget);

function KKProductOptions(instanceId, data){  
    var id = instanceId+"_cont";       
    this.loader=function(){
    	
    	var termsAcceptedR = DATA.getRemote("konfidentkidz_terms", undefined, NOT_READY, POLL_RATES.NORMAL);
    	var termsAcceptedB = termsAcceptedR.behaviour;
    	termsAcceptedB.liftB(function(termsAccepted){
    		if(!good()){
    			return NOT_READY;
    		}
    		if(!termsAccepted){
    			KK_showLicensingTerms(function(){
    				KK_showPrivacyAgreement(function(){
    					KK_showTermsOfUse(function(){
    						 ajax({
    						        dataType: 'json',
    						        url: SETTINGS.scriptPath+"request/konfidentkidz_acceptterms",
    						        success: function(data){
    						        },
    						        error: function(){}
    						    }); 
    					});
    				});
    			});  
    		}
    	});
    	F.insertValueB(F.ifB(termsAcceptedB, 'block', 'none'),DOM.get(id), 'style', 'display');
    	
        var dataB = DATA.getRemote("konfidentkidz_myproducts", undefined, NOT_READY, POLL_RATES.NORMAL).behaviour;
        var productOptionsDivB = F.liftB(function(data){
            if(!good())
                return "";
            var html="";
            for(index in data){
                var product = data[index];
                var img = (data[index].image_src.length==0)?"<h1>"+product.name+"</h1>":"<div style=\"text-align: center;\"><img src=\""+data[index].image_src+"\" class=\"homePosters\" alt=\"\" /></div>";
                html+=img+product.linksHtml;
                html+=product.admin_html;
            }      
            return DOM.createDiv(undefined, html);
        }, dataB);   
        F.insertDomB(productOptionsDivB, id);
    }
    this.build=function(){
        return "<div id=\""+id+"\">&nbsp;</div>";
    }
    this.destroy=function(){
    }
}

WIDGETS.register("KKProductOptions", KKProductOptions);

function KKSchoolProducts(instanceId, data){       
	var optionName = "Option 1";
	var productId = "DNMTLPCDXZ8M4";
	this.loader=function(){
        F.extractEventE(instanceId+"_button", "click").mapE(function(){
        	//DOM.get(instanceId+"_form").submit();
        	DOM.get(instanceId+"_frame").src = "/request/KK_addToCart?code="+productId;
        }).delayE(1000).mapE(function(){
        	DOM.get(instanceId+"_frame").contentWindow.loadPage();
        });
    }    
    this.build=function(){
    	
    	return ""+
    	"<form id=\""+instanceId+"_form\" action=\"https://www.paypal.com/cgi-bin/webscr\" method=\"post\" style=\"display: none;\">"+
    	"<input type=\"hidden\" name=\"cmd\" value=\"_s-xclick\">"+ 
    	"<input type=\"hidden\" name=\"hosted_button_id\" value=\""+productId+"\"><input type=\"hidden\" name=\"on0\" value=\"Age Range\"><input type=\"hidden\" name=\"os0\" value=\""+optionName+"\" />"+ 
    	"<input type=\"image\" src=\"https://www.paypalobjects.com/en_US/i/btn/btn_buynow_LG.gif\" border=\"0\" name=\"submit\" alt=\"PayPal - The safer, easier way to pay online!\">"+
    	"<img alt=\"\" border=\"0\" src=\"https://www.paypalobjects.com/en_US/i/scr/pixel.gif\" width=\"1\" height=\"1\">"+
    	"</form><br />"+   
    	"<div id=\""+instanceId+"_button\">Add To Cart</div><iframe id=\""+instanceId+"_frame\" src=\"index.php\" style=\"width:1000px;height: 1000px;\"></iframe>";
    }
    this.destroy=function(){
    }
}

WIDGETS.register("KKSchoolProducts", KKSchoolProducts);






function KonfidentKidzSchoolProductWidget(instanceId, data){
    this.instanceId = instanceId;
    var loadingImId = this.instanceId+"_loading";
    var submitButton = new ValidatedSubmitButton(instanceId,data);
    var payPalButton = new PayPalBuyNowWidget(instanceId+"_paypal", {showButton: false, productId: data.productId, autoSubmit: false,  optionName: "Age Range", sandboxMode: true});
    this.loader=function(){           
    	var formDataGroupB = DATA.get(data.formGroup, undefined, {});
    	//log("LOADING school products widget");
    	F.liftB(function(user){
    		log("HOLA!");
    		if(!good()){
    			return NOT_READY;
    		}
    		var vars = ["schoolname", "schooladdress", "firstname", "lastname", "contactnumber", "contact_email", "Password", "Email"];
    		for(index in vars){
    			var name = vars[index];//user.group_id!=1
    			log("Sending Event: "+name+"_man");
    			DATA.getB(name+"_man").sendEvent({valid: true, value: undefined, name: name});
    		}
    	}, userB.delayB(2000));
    	
        var formDataB = formDataGroupB.liftB(function(validationMap){
        	//log("FormDataChange");
        	if(validationMap==NOT_READY){
        		return F.constantB(NOT_READY);
        	}
            return F.liftB.apply(this,[function(){
            	log("INNER FormDataChange");
            	var dataOb = {};
               // log(arguments);
                for(index in arguments){   
                	log(arguments[index]);
                	if(arguments[index].valid){
                        dataOb[arguments[index].name] = arguments[index].value;                            
                    }
                }
                return dataOb;
            }].concat(getObjectValues(validationMap)));
        }).switchB();
        
    	//var formDataB = F.receiverE().startsWith(NOT_READY);
        submitButton.loader();  
        payPalButton.loader();
        var submitClickedE = jQuery("#"+submitButton.elementId).fj('extEvtE', 'click').snapshotE(formDataB).mapE(function(formData){
        	return formData;
        });
        var submitClickedB = submitClickedE.startsWith(NOT_READY);       
        var confirmButtonE = submitClickedE.mapE(function(formData){
        	var message = "<div style=\"text-align: center;\">" +
        			"<table style=\"margin: 0 auto; text-align: left;\">" +
        			"<tr><td>School Name</td><td>"+formData.schoolname+"</td></tr>" +
        			"<tr><td>School Address</td><td>"+formData.schooladdress+"</td></tr>" +
        			"<tr><td>Contact Name</td><td>"+formData.firstname+" "+formData.lastname+"</td></tr>" +
        			"<tr><td>Contact Number</td><td>"+formData.contactnumber+"</td></tr>" +
        			"<tr><td>Email Address</td><td>"+formData.Email+"</td></tr>" +
        			"<tr><td>Address</td><td>"+formData.schooladdress+"</td></tr>" +
        			"</table></div>";
        	UI.confirm("Please confirm your data", message, "Confirm Details", function(){
        		for(var i=1;i<6;i++){
            		if(DOM.get("students_radio_"+i).checked){
            			payPalButton.requestInvoice("optionValue="+DOM.get("students_radio_"+i).value);
            		}
            	}
        	}, "Modify Details", function(){
        		
        	}, false, function(){});
        });
         
        var invoicedFormDataB = F.liftB(function(invoice, formData){
        	if(!good()){
        		return NOT_READY;
        	}
        	formData.invoiceId = invoice.invoiceId;
        	formData.product = data.productId;
        	formData.valid = true;
        	formData.optionName = data.optionName;
        	
        	for(var i=1;i<6;i++){
        		if(DOM.get("students_radio_"+i).checked){
        			formData.optionValue = DOM.get("students_radio_"+i).value.replaceAll(" or under", "");
        			payPalButton.setOptionValue(DOM.get("students_radio_"+i).value);
        		}
        	}
        	return {type: 'post', data: formData, dataType: 'json', url: '/request/KK_registerUser'};
        }, payPalButton.invoiceE.startsWith(NOT_READY), formDataB);
        
        invoicedFormDataB.ajaxRequestB().liftB(function(){
        	if(!good()){
        		return NOT_READY;
        	}
        	payPalButton.submit();
        });
    }
    this.build=function(){
        return submitButton.build()+payPalButton.build()+"<img id=\""+loadingImId+"\" class=\"loadingSpinner\" src=\"/resources/trans.png\" alt=\"\" />";                 
    }
}
WIDGETS.register("KonfidentKidzSchoolProductWidget", KonfidentKidzSchoolProductWidget);

function kk_deleteInvoice(invoiceId){
	   ajax({
	        dataType: 'json',
	        url: SETTINGS.scriptPath+"request/deleteInvoice/"+invoiceId,
	        success: function(data){
	        	if(data=="OK"){
	        		UI.showMessage("", "Invoice Deleted", function(){}, {modal: true,draggable:false, resizable: false});
	        	}
	        	else{
	        		UI.showMessage("Error", data, function(){}, {modal: true,draggable:false, resizable: false});
	        	}
	        },
	        error: function(){}
	   });
}



function KonfidentKidzManualProductWidget(instanceId, data){
    this.loader=function(){           
    	/*var formDataGroupB = DATA.get("konfidentkidz_schoolProducts", undefined, {});*/
    	//

    	
    	var formDataGroupR = DATA.getRemote("konfidentkidz_schoolProducts", undefined, NOT_READY, POLL_RATES.VERY_FAST);
    	var formDataGroupB = formDataGroupR.behaviour;
    	var productsUpdatedB = formDataGroupB.liftB(function(formDataGroup){
    		if(!good()){
    			return NOT_READY;
    		}
    		DOM.get(instanceId+"_product").innerHTML = "";
    		for(var index in formDataGroup){
    			var product = formDataGroup[index];
    			DOM.get(instanceId+"_product").innerHTML += "<option value=\""+product.product_id+"\">"+product.name+"</option>";
    		}
    		return DOM.get(instanceId+"_product");
    	});
    	
    	var productB = F.extractValueB(instanceId+"_product");
    	var schoolnameB = F.extractValueB(instanceId+"_schoolname");
    	var schooladdressB = F.extractValueB(instanceId+"_schooladdress");
    	var firstnameB = F.extractValueB(instanceId+"_firstname");
    	var lastnameB = F.extractValueB(instanceId+"_lastname");
    	var emailB = F.extractValueB(instanceId+"_email");
    	var passwordB = F.extractValueB(instanceId+"_password");
    	var passwordconfirmB = F.extractValueB(instanceId+"_passwordconfirm");
    	var submitClickedE = F.extractEventE(instanceId+"_submit", "click");
    	
    	var dataB = F.liftB(function(product, schoolname, schooladdress, firstname, lastname, email, password, passwordconfirm, productsUpdatedB){
    		if(!good()){
    			return NOT_READY;
    		}
    		return {url:"/request/KK_manualPayment", type: "post", data: {product:DOM.get(instanceId+"_product").value, schoolname:schoolname, schooladdress:schooladdress, firstname:firstname, lastname:lastname, email:email, password:password, passwordconfirm:passwordconfirm}, dataType:"json"};
    	}, productB, schoolnameB, schooladdressB, firstnameB, lastnameB, emailB, passwordB, passwordconfirmB, productsUpdatedB);
    	
    	submitClickedE.snapshotE(dataB).filterE(function(request){
    		var data = request.data;
    		if(data.password!==data.passwordconfirm){
    			UI.showMessage("Input Error", "Passwords do not match!");
    			return false;
    		}
    		if(data.firstname.length==0){
    			UI.showMessage("Input Error", "Please Specify a first name");
    			return false;
    		}
    		if(data.lastname.length==0){
    			UI.showMessage("Input Error", "Please Specify a last name");
    			return false;
    		}
    		if(data.email.length==0){
    			UI.showMessage("Input Error", "Please Specify a email address");
    			return false;
    		}
    		if(data.password.length==0){
    			UI.showMessage("Input Error", "Please Specify a password");
    			return false;
    		}
    		if(data.schoolname.length==0){
    			UI.showMessage("Input Error", "Please Specify a school name");
    			return false;
    		}
    		if(data.schooladdress.length==0){
    			UI.showMessage("Input Error", "Please Specify a school address");
    			return false;
    		}
    		return true;
    		
    	}).ajaxRequestE().mapE(function(data){
    		UI.showMessage("", data.message);
    	});
    }
    this.build=function(){
        return "<div id=\""+instanceId+"_container\">Product<br /><select id=\""+instanceId+"_product\"></select><br />"+
        "School Name<br /><input id=\""+instanceId+"_schoolname\" type=\"text\" /><br />"+
        "School Address<br /><textarea id=\""+instanceId+"_schooladdress\" rows=\"5\" cols=\"40\"></textarea><br />"+
        "Principal<br />"+
        "First Name<br /><input id=\""+instanceId+"_firstname\" type=\"text\" /><br />"+
        "Last Name<br /><input id=\""+instanceId+"_lastname\" type=\"text\" /><br />"+
        "Email Address<br /><input id=\""+instanceId+"_email\" type=\"text\" /><br />"+
        "Password<br /><input id=\""+instanceId+"_password\" type=\"password\" /><br />"+
        "Password Confirm<br /><input id=\""+instanceId+"_passwordconfirm\" type=\"password\" /><br />"+
        "<input id=\""+instanceId+"_submit\" class=\"button\" type=\"submit\" /></div>";                 
    }
}
WIDGETS.register("KonfidentKidzManualProductWidget", KonfidentKidzManualProductWidget);

/**
 *  UsersManagerWidget
 * @constructor
 */                                               
function KKUsersManagerWidget(instanceId, data){
    
    this.loader=function(){
        var dataR = DATA.getRemote("kk_users", "", NOT_READY, POLL_RATES.VERY_FAST);  //, NOT_READY, POLL_RATES.SLOW
        var renderedTableB = F.liftBI(function(data, groups){
            if(data==NOT_READY||groups==NOT_READY)
                return NOT_READY;
            return data;
        },function(value){
        	log("kk_users upstream event");
        	log(value);
            return [value];
        }, dataR.behaviour);
    
    tableB = TableWidgetB(instanceId+"_table", data, renderedTableB);    
    F.insertDomB(tableB, instanceId+"_container");
    }
    this.destroy=function(){
        DATA.deregister("kk_users", "");
    }
    this.build=function(){
        return "<span id=\""+instanceId+"_container\">&nbsp;</span>";
    }
}          
WIDGETS.register("KKUsersManagerWidget", KKUsersManagerWidget);   



function SchoolNameInput(instanceId, data){
    this.instanceId = instanceId;
    this.inputId = instanceId+"_input"   
    var visible = (data.visible==undefined)?true:data.visible;
    this.loader=function(){       
        var formGroupB = DATA.get(data.formGroup, undefined, {});  
        var valueName = (data.name==undefined)?"SchoolName":data.name;
        
        
        var mySchoolB = DATA.getRemote("konfidentkidz_myschool").behaviour;        

        var widgetValueB = mySchoolB.liftB(function(school){
            if(!good()){
            	DOM.get(instanceId+"_input").className = 'form_validator_invalidInput';
                return {valid: false, value: "", name: valueName};
            }
            
            DOM.get(instanceId+"_input").className = 'form_validator_validInput';
            DOM.get(instanceId+"_input").value = school.name;
            return {valid: true, value: school.name, name: valueName};
        });  
        pushToValidationGroupBehaviour(instanceId, formGroupB, widgetValueB);  
    }      
    this.build=function(){
        return "<input id=\""+instanceId+"_input\" type=\""+(visible?'text':'hidden')+"\" />";//"<input id=\""+this.inputId+"\" type=\"text\">";         
    }
}
WIDGETS.register("SchoolNameInput", SchoolNameInput);

jQuery(document).ready(function(){
    document.body.style.background="url('"+SETTINGS['scriptPath']+"themes/konfidentkidz/background.jpg')";
    //jQuery("input:submit, a, button").button();          //, ".button"
    jQuery("input:submit").button();
    //document.body.style.backgroundAttachement="fixed"; 
});
jQuery(document).ready(function(){
    jQuery(document.getElementById("productsImage")).hover(function(){
        jQuery("#productsPopup").fadeIn(700);
    }, function(){
        jQuery("#productsPopup").fadeOut(700);
    });
});   



  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-35308071-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();


////////////////////////////////////////////////////////////////////////////////////////////
//  Experimental Typed EventStreams


var receiverDefinition = {sendEvent: function(value){F.internal_.propagatePulse(new F.internal_.Pulse(F.internal_.nextStamp(), value),evt);}};
function F.checkType = function(value, expectedType){
	if(typeof(value)!='expectedType'){
		log("Error during function "+arguments.callee.caller.name+" expected "+expectedType+" but found "+typeof(value));
	}
}


//Number Event Stream
/**
 * F.NumberEventStream
 * Event: Array Node b * ( (Pulse a -> Void) * Pulse b -> Void)
 * @constructor
 * @param {Array.<F.EventStream>} nodes
 */
F.NumberEventStream = jQuery.extend({
	addE: function(amount){
		return this.mapE(function(value){
			F.checkType(value, 'number');
			return value+amount;
		});
	},
	subtractE: function(amount){
		return this.mapE(function(value){
			F.checkType(value, 'number');
			return value-amount;
		});
	},
	multiplyE: function(amount){
		return this.mapE(function(value){
			F.checkType(value, 'number');
			return value*amount;
		});
	},
	divideE: function(amount){
		return this.mapE(function(value){
			F.checkType(value, 'number');
			return value/amount;
		});
	},
	gtFilterE: function(amount){
		return this.filterE(function(value){
			F.checkType(value, 'number');
			return value>amount;
		});
	},
	ltFilterE: function(amount){
		return this.filterE(function(value){
			F.checkType(value, 'number');
			return value<amount;
		});
	}
}, receiverDefinition, F.EventStream);


/** 
 * Create an EventStream that has string transformation functions 
 * @returns {F.StringEventStream}
 */
F.strReceiverE = function() {
  return new F.NumberEventStream([],function(pulse) { return pulse; });
};

/** 
 * Convert an EventStream into a StringEventStream
 * @returns {F.StringEventStream}
 */
F.EventStream.prototype.toNumber() = function() {
  return new F.NumberEventStream([this.mapE(function(value){
  	F.checkType(value, 'number');
  	return (typeof(value)=='string'?parseInt(value), value);
  })],function(pulse) { return pulse; });
};






//String Event Streams
/**
 * F.StringEventStream
 * Event: Array Node b * ( (Pulse a -> Void) * Pulse b -> Void)
 * @constructor
 * @param {Array.<F.EventStream>} nodes
 */
F.StringEventStream = jQuery.extend({
	replaceE: function(search, rep){
		return this.mapE(function(str){
			F.checkType(str, 'string');
			return str.replace(search, rep);
		});
	},
	parseIntE: function(){
		return this.mapE(function(str){	
			F.checkType(str, 'string');
			var numbrVal = parseInt(str);
			F.checkType(numbrVal, 'int');
			return numbrVal;
		}).toNumberE();
	},
	parseJSONE: function(){
		return this.mapE(function(str){
			F.checkType(str, 'string');
			return JSON.parse(str);
		});
	}
}, receiverDefinition, F.EventStream);


/** 
 * Create an EventStream that has string transformation functions 
 * @returns {F.StringEventStream}
 */
F.strReceiverE = function() {
  return new F.StringEventStream([],function(pulse) { return pulse; });
};

/** 
 * Convert an EventStream into a StringEventStream
 * @returns {F.StringEventStream}
 */
F.EventStream.prototype.toStringE() = function() {
  return new F.StringEventStream([this.mapE(function(value){
  	F.checkType(value, 'string');
  	return (typeof(value)!='string'?JSON.stringify(value), value);
  })],function(pulse) { return pulse; });
};




//Dom Event Streams
/**
 * F.DOMElementEventStream
 * Event: Array Node b * ( (Pulse a -> Void) * Pulse b -> Void)
 * @constructor
 * @param {Array.<F.EventStream>} nodes
 */
F.DOMElementEventStream = jQuery.extend({
	index: function(event){
		return this.mapE(function(element){
			return jQuery(element).index();
		}).toNumberE();
	},
	checked: function(event){
		return this.mapE(function(element){
			return element.checked!=undefined && element.checked;
		});
	},
	unchecked: function(event){
		return this.mapE(function(element){
			return element.checked!=undefined && (!element.checked);
		});
	},
	filterCheckedE: function(event){
		return this.filterE(function(element){
			return element.checked!=undefined&&(!element.checked);
		});
	},
	filterUnCheckedE: function(event){
		return this.filterE(function(element){
			return element.checked!=undefined&&(element.checked);
		});
	}
}, receiverDefinition, F.EventStream);

/** 
 * Create an EventStream that has string transformation functions 
 * @returns {F.StringEventStream}
 */0
F.domReceiverE = function() {
  return new F.DOMElementEventStream([],function(pulse) { return pulse; });
};

/** 
 * Create an EventStream that has string transformation functions 
 * @returns {F.StringEventStream}
 */
F.EventStream.prototype.toDomElementE() = function() {
  return new F.DOMElementEventStream([this.mapE(function(value){
  	if(value.nodeType==undefined){
		log("Error during function "+arguments.callee.caller.name+" expected DomElement but found "+typeof(value));
	}
  	return value;
  })],function(pulse) { return pulse; });
};




//Dom Event Streams
/**
 * F.DOMEventStream
 * Event: Array Node b * ( (Pulse a -> Void) * Pulse b -> Void)
 * @constructor
 * @param {Array.<F.EventStream>} nodes
 */
F.DOMEventStream = jQuery.extend({
	targetE: function(event){
		return this.mapE(function(event){
			return event.target;
		}).toDomElementE();
	},
	targetIdE: function(event){
		return this.mapE(function(event){
			return event.target.id;
		}).toStringE();
	}
}, receiverDefinition, F.EventStream);

/** 
 * Create an EventStream that has string transformation functions 
 * @returns {F.StringEventStream}
 */0
F.domReceiverE = function() {
  return new F.DOMEventStream([],function(pulse) { return pulse; });
};

/** 
 * Create an EventStream that has string transformation functions 
 * @returns {F.StringEventStream}
 */
F.EventStream.prototype.toDomE() = function() {
  return new F.DOMEventStream([this.mapE(function(value){
  	if(value.nodeType==undefined){
		log("Error during function "+arguments.callee.caller.name+" expected DomEvent but found "+typeof(value));
	}
  	return value;
  })],function(pulse) { return pulse; });
};


