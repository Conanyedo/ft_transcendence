/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/index";
exports.ids = ["pages/index"];
exports.modules = {

/***/ "./styles/homePage.module.css":
/*!************************************!*\
  !*** ./styles/homePage.module.css ***!
  \************************************/
/***/ ((module) => {

eval("// Exports\nmodule.exports = {\n\t\"loginBtn\": \"homePage_loginBtn__0fg3_\",\n\t\"box\": \"homePage_box__12nJX\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zdHlsZXMvaG9tZVBhZ2UubW9kdWxlLmNzcy5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVzdC8uL3N0eWxlcy9ob21lUGFnZS5tb2R1bGUuY3NzPzNlMDkiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdFwibG9naW5CdG5cIjogXCJob21lUGFnZV9sb2dpbkJ0bl9fMGZnM19cIixcblx0XCJib3hcIjogXCJob21lUGFnZV9ib3hfXzEybkpYXCJcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./styles/homePage.module.css\n");

/***/ }),

/***/ "./components/use-follow-pointer.tsx":
/*!*******************************************!*\
  !*** ./components/use-follow-pointer.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useFollowPointer\": () => (/* binding */ useFollowPointer)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction useFollowPointer(ref) {\n    const { 0: point , 1: setPoint  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({\n        x: 0,\n        y: 0\n    });\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{\n        if (!ref.current) return;\n        const handlePointerMove = ({ clientX , clientY  })=>{\n            const element = ref.current;\n            if (!element) return;\n            const x = clientX - element.offsetLeft - element.offsetWidth / 2;\n            const y = clientY - element.offsetTop - element.offsetHeight / 2;\n            setPoint({\n                x,\n                y\n            });\n        };\n        window.addEventListener(\"pointermove\", handlePointerMove);\n        return ()=>window.removeEventListener(\"pointermove\", handlePointerMove)\n        ;\n    }, []);\n    return point;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL3VzZS1mb2xsb3ctcG9pbnRlci50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQXVEO0FBRWhELFNBQVNFLGdCQUFnQixDQUFDQyxHQUEyQixFQUFFO0lBQzVELE1BQU0sRUFIUixHQUdTQyxLQUFLLEdBSGQsR0FHZ0JDLFFBQVEsTUFBSUwsK0NBQVEsQ0FBQztRQUFFTSxDQUFDLEVBQUUsQ0FBQztRQUFFQyxDQUFDLEVBQUUsQ0FBQztLQUFFLENBQUM7SUFFbEROLGdEQUFTLENBQUMsSUFBTTtRQUNkLElBQUksQ0FBQ0UsR0FBRyxDQUFDSyxPQUFPLEVBQUUsT0FBTztRQUV6QixNQUFNQyxpQkFBaUIsR0FBRyxDQUFDLEVBQUVDLE9BQU8sR0FBRUMsT0FBTyxHQUFjLEdBQUs7WUFDOUQsTUFBTUMsT0FBTyxHQUFHVCxHQUFHLENBQUNLLE9BQU87WUFDM0IsSUFBSSxDQUFDSSxPQUFPLEVBQ1YsT0FBTztZQUNULE1BQU1OLENBQUMsR0FBR0ksT0FBTyxHQUFHRSxPQUFPLENBQUNDLFVBQVUsR0FBR0QsT0FBTyxDQUFDRSxXQUFXLEdBQUcsQ0FBQztZQUNoRSxNQUFNUCxDQUFDLEdBQUdJLE9BQU8sR0FBR0MsT0FBTyxDQUFDRyxTQUFTLEdBQUdILE9BQU8sQ0FBQ0ksWUFBWSxHQUFHLENBQUM7WUFDaEVYLFFBQVEsQ0FBQztnQkFBRUMsQ0FBQztnQkFBRUMsQ0FBQzthQUFFLENBQUMsQ0FBQztTQUNwQjtRQUVEVSxNQUFNLENBQUNDLGdCQUFnQixDQUFDLGFBQWEsRUFBRVQsaUJBQWlCLENBQUMsQ0FBQztRQUUxRCxPQUFPLElBQU1RLE1BQU0sQ0FBQ0UsbUJBQW1CLENBQUMsYUFBYSxFQUFFVixpQkFBaUIsQ0FBQztRQUFBLENBQUM7S0FDM0UsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVQLE9BQU9MLEtBQUssQ0FBQztDQUNkIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVzdC8uL2NvbXBvbmVudHMvdXNlLWZvbGxvdy1wb2ludGVyLnRzeD8wYjQ2Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVN0YXRlLCBSZWZPYmplY3QsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlRm9sbG93UG9pbnRlcihyZWY6IFJlZk9iamVjdDxIVE1MRWxlbWVudD4pIHtcbiAgY29uc3QgW3BvaW50LCBzZXRQb2ludF0gPSB1c2VTdGF0ZSh7IHg6IDAsIHk6IDAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXJlZi5jdXJyZW50KSByZXR1cm47XG5cbiAgICBjb25zdCBoYW5kbGVQb2ludGVyTW92ZSA9ICh7IGNsaWVudFgsIGNsaWVudFkgfTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHJlZi5jdXJyZW50ITtcbiAgICAgIGlmICghZWxlbWVudClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgY29uc3QgeCA9IGNsaWVudFggLSBlbGVtZW50Lm9mZnNldExlZnQgLSBlbGVtZW50Lm9mZnNldFdpZHRoIC8gMjtcbiAgICAgIGNvbnN0IHkgPSBjbGllbnRZIC0gZWxlbWVudC5vZmZzZXRUb3AgLSBlbGVtZW50Lm9mZnNldEhlaWdodCAvIDI7XG4gICAgICBzZXRQb2ludCh7IHgsIHkgfSk7XG4gICAgfTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgaGFuZGxlUG9pbnRlck1vdmUpO1xuXG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcm1vdmVcIiwgaGFuZGxlUG9pbnRlck1vdmUpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHBvaW50O1xufVxuIl0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlRm9sbG93UG9pbnRlciIsInJlZiIsInBvaW50Iiwic2V0UG9pbnQiLCJ4IiwieSIsImN1cnJlbnQiLCJoYW5kbGVQb2ludGVyTW92ZSIsImNsaWVudFgiLCJjbGllbnRZIiwiZWxlbWVudCIsIm9mZnNldExlZnQiLCJvZmZzZXRXaWR0aCIsIm9mZnNldFRvcCIsIm9mZnNldEhlaWdodCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/use-follow-pointer.tsx\n");

/***/ }),

/***/ "./pages/index.tsx":
/*!*************************!*\
  !*** ./pages/index.tsx ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_homePage_module_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/homePage.module.css */ \"./styles/homePage.module.css\");\n/* harmony import */ var _styles_homePage_module_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_homePage_module_css__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! framer-motion */ \"framer-motion\");\n/* harmony import */ var _components_use_follow_pointer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/use-follow-pointer */ \"./components/use-follow-pointer.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_3__]);\nframer_motion__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\nconst HomePage = ()=>{\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_1__.useRouter)();\n    const LoginHandler = ()=>{\n        router.push(\"/profile\");\n    };\n    const ref = (0,react__WEBPACK_IMPORTED_MODULE_2__.useRef)(null);\n    const { x , y  } = (0,_components_use_follow_pointer__WEBPACK_IMPORTED_MODULE_4__.useFollowPointer)(ref);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {\n                ref: ref,\n                className: (_styles_homePage_module_css__WEBPACK_IMPORTED_MODULE_5___default().box),\n                animate: {\n                    x,\n                    y\n                },\n                transition: {\n                    type: \"spring\",\n                    damping: 3,\n                    stiffness: 50,\n                    restDelta: 0.001\n                }\n            }, void 0, false, {\n                fileName: \"/Users/ikrkharb/ft_transcendence/pages/index.tsx\",\n                lineNumber: 16,\n                columnNumber: 3\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_3__.motion.div, {\n                className: (_styles_homePage_module_css__WEBPACK_IMPORTED_MODULE_5___default().loginBtn),\n                onClick: LoginHandler,\n                children: \"Login\"\n            }, void 0, false, {\n                fileName: \"/Users/ikrkharb/ft_transcendence/pages/index.tsx\",\n                lineNumber: 27,\n                columnNumber: 3\n            }, undefined)\n        ]\n    }, void 0, true);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HomePage);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9pbmRleC50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUF3QztBQUNXO0FBQ3BCO0FBQ1E7QUFDNkI7QUFFcEUsTUFBTUssUUFBUSxHQUFHLElBQU07SUFDdEIsTUFBTUMsTUFBTSxHQUFHTixzREFBUyxFQUFFO0lBQzFCLE1BQU1PLFlBQVksR0FBRyxJQUFNO1FBQzFCRCxNQUFNLENBQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN4QjtJQUNELE1BQU1DLEdBQUcsR0FBR1AsNkNBQU0sQ0FBQyxJQUFJLENBQUM7SUFDeEIsTUFBTSxFQUFFUSxDQUFDLEdBQUVDLENBQUMsR0FBRSxHQUFHUCxnRkFBZ0IsQ0FBQ0ssR0FBRyxDQUFDO0lBQ3RDLHFCQUNDOzswQkFDQSw4REFBQ04scURBQVU7Z0JBQ1ZNLEdBQUcsRUFBRUEsR0FBRztnQkFDUkksU0FBUyxFQUFFWix3RUFBVztnQkFDdEJjLE9BQU8sRUFBRTtvQkFBRUwsQ0FBQztvQkFBRUMsQ0FBQztpQkFBRTtnQkFDakJLLFVBQVUsRUFBRTtvQkFDWEMsSUFBSSxFQUFFLFFBQVE7b0JBQ2RDLE9BQU8sRUFBRSxDQUFDO29CQUNWQyxTQUFTLEVBQUUsRUFBRTtvQkFDYkMsU0FBUyxFQUFFLEtBQUs7aUJBQ2hCOzs7Ozt5QkFDQTswQkFDRiw4REFBQ2pCLHFEQUFVO2dCQUFDVSxTQUFTLEVBQUVaLDZFQUFnQjtnQkFBRXFCLE9BQU8sRUFBRWYsWUFBWTswQkFBRSxPQUVoRTs7Ozs7eUJBQWE7O29CQUNWLENBQ0Y7Q0FDRjtBQUVELGlFQUFlRixRQUFRLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXN0Ly4vcGFnZXMvaW5kZXgudHN4PzA3ZmYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSBcIm5leHQvcm91dGVyXCI7XG5pbXBvcnQgY2xhc3NlcyBmcm9tICcuLi9zdHlsZXMvaG9tZVBhZ2UubW9kdWxlLmNzcydcbmltcG9ydCB7IHVzZVJlZiB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgbW90aW9uIH0gZnJvbSBcImZyYW1lci1tb3Rpb25cIjtcbmltcG9ydCB7IHVzZUZvbGxvd1BvaW50ZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy91c2UtZm9sbG93LXBvaW50ZXJcIjtcblxuY29uc3QgSG9tZVBhZ2UgPSAoKSA9PiB7XG5cdGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuXHRjb25zdCBMb2dpbkhhbmRsZXIgPSAoKSA9PiB7XG5cdFx0cm91dGVyLnB1c2goXCIvcHJvZmlsZVwiKTtcblx0fVxuXHRjb25zdCByZWYgPSB1c2VSZWYobnVsbCk7XG5cdGNvbnN0IHsgeCwgeSB9ID0gdXNlRm9sbG93UG9pbnRlcihyZWYpO1xuXHRyZXR1cm4gKFxuXHRcdDw+XG5cdFx0PG1vdGlvbi5kaXZcblx0XHRcdHJlZj17cmVmfVxuXHRcdFx0Y2xhc3NOYW1lPXtjbGFzc2VzLmJveH1cblx0XHRcdGFuaW1hdGU9e3sgeCwgeSB9fVxuXHRcdFx0dHJhbnNpdGlvbj17e1xuXHRcdFx0XHR0eXBlOiBcInNwcmluZ1wiLFxuXHRcdFx0XHRkYW1waW5nOiAzLFxuXHRcdFx0XHRzdGlmZm5lc3M6IDUwLFxuXHRcdFx0XHRyZXN0RGVsdGE6IDAuMDAxLFxuXHRcdFx0fX1cblx0XHQvPlxuXHRcdDxtb3Rpb24uZGl2IGNsYXNzTmFtZT17Y2xhc3Nlcy5sb2dpbkJ0bn0gb25DbGljaz17TG9naW5IYW5kbGVyfT5cblx0XHRcdExvZ2luXG5cdFx0PC9tb3Rpb24uZGl2PlxuXHRcdDwvPlxuXHQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgSG9tZVBhZ2U7XG4iXSwibmFtZXMiOlsidXNlUm91dGVyIiwiY2xhc3NlcyIsInVzZVJlZiIsIm1vdGlvbiIsInVzZUZvbGxvd1BvaW50ZXIiLCJIb21lUGFnZSIsInJvdXRlciIsIkxvZ2luSGFuZGxlciIsInB1c2giLCJyZWYiLCJ4IiwieSIsImRpdiIsImNsYXNzTmFtZSIsImJveCIsImFuaW1hdGUiLCJ0cmFuc2l0aW9uIiwidHlwZSIsImRhbXBpbmciLCJzdGlmZm5lc3MiLCJyZXN0RGVsdGEiLCJsb2dpbkJ0biIsIm9uQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/index.tsx\n");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/router");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "framer-motion":
/*!********************************!*\
  !*** external "framer-motion" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = import("framer-motion");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/index.tsx"));
module.exports = __webpack_exports__;

})();