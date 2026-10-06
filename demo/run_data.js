window.RUN = {
 "run_id": "full_20261003_131525_104",
 "config": {
  "model": "gpt-oss:20b",
  "code_backend": "XGRAMMAR",
  "seed": 104,
  "temperature": 0.1,
  "num_ctx": 32768,
  "max_agent_attempts": 6
 },
 "request": "Create a basic aircraft outline with a fuselage, a main wing, a horizontal tail and a vertical tail.\nPut the fuselage nose at the origin with the tail pointing along +X, and make it 10 m long, 1.5 m in maximum width and 1.5 m in maximum height.\nMake the main wing symmetric left-right about the XZ plane with a total span of 10 m, a root chord of 2 m, a tip chord of 1 m and a 15 degree sweep measured at 25% chord, using NACA 0012 at both the root and the tip. Put the main wing root leading edge 4 m aft of the nose, at the same height as the fuselage centerline.\nMake the horizontal tail symmetric left-right about the XZ plane with a total span of 4 m, a root chord of 1.2 m, a tip chord of 0.6 m and a 15 degree sweep measured at 25% chord, using NACA 0012 at both the root and the tip. Put the horizontal tail root leading edge 8 m aft of the nose, at the same height as the fuselage centerline.\nMake only one vertical tail and put its root leading edge on the fuselage centerline 8 m aft of the nose. Give it a height of 1.8 m upward along +Z from the root, a root chord of 1.5 m, a tip chord of 0.7 m and a 25 degree sweep measured at 25% chord, using NACA 0012 at both the root and the tip.",
 "interpretation": [
  {
   "id": "fuselage",
   "role": "fuselage",
   "reqs": [
    {
     "name": "length",
     "value": 10.0,
     "unit": "m",
     "src": "10 m long"
    },
    {
     "name": "max_width",
     "value": 1.5,
     "unit": "m",
     "src": "1.5 m in maximum width"
    },
    {
     "name": "max_height",
     "value": 1.5,
     "unit": "m",
     "src": "1.5 m in maximum height"
    },
    {
     "name": "nose_position",
     "value": "(0,0,0)",
     "unit": "m",
     "src": "Put the fuselage nose at the origin"
    },
    {
     "name": "tail_direction",
     "value": "+X",
     "unit": "direction",
     "src": "tail pointing along +X"
    }
   ]
  },
  {
   "id": "main_wing",
   "role": "wing",
   "reqs": [
    {
     "name": "span",
     "value": 10.0,
     "unit": "m",
     "src": "total span of 10 m"
    },
    {
     "name": "root_chord",
     "value": 2.0,
     "unit": "m",
     "src": "root chord of 2 m"
    },
    {
     "name": "tip_chord",
     "value": 1.0,
     "unit": "m",
     "src": "tip chord of 1 m"
    },
    {
     "name": "sweep_25pct",
     "value": 15.0,
     "unit": "deg",
     "src": "15 degree sweep measured at 25% chord"
    },
    {
     "name": "airfoil_root",
     "value": "NACA 0012",
     "unit": "airfoil",
     "src": "using NACA 0012 at both the root and the tip"
    },
    {
     "name": "airfoil_tip",
     "value": "NACA 0012",
     "unit": "airfoil",
     "src": "using NACA 0012 at both the root and the tip"
    },
    {
     "name": "leading_edge_location",
     "value": "(4,0,0)",
     "unit": "m",
     "src": "root leading edge 4 m aft of the nose, at the same height as the fuselage centerline"
    }
   ]
  },
  {
   "id": "horizontal_tail",
   "role": "horizontal_tail",
   "reqs": [
    {
     "name": "span",
     "value": 4.0,
     "unit": "m",
     "src": "total span of 4 m"
    },
    {
     "name": "root_chord",
     "value": 1.2,
     "unit": "m",
     "src": "root chord of 1.2 m"
    },
    {
     "name": "tip_chord",
     "value": 0.6,
     "unit": "m",
     "src": "tip chord of 0.6 m"
    },
    {
     "name": "sweep_25pct",
     "value": 15.0,
     "unit": "deg",
     "src": "15 degree sweep measured at 25% chord"
    },
    {
     "name": "airfoil_root",
     "value": "NACA 0012",
     "unit": "airfoil",
     "src": "using NACA 0012 at both the root and the tip"
    },
    {
     "name": "airfoil_tip",
     "value": "NACA 0012",
     "unit": "airfoil",
     "src": "using NACA 0012 at both the root and the tip"
    },
    {
     "name": "leading_edge_location",
     "value": "(8,0,0)",
     "unit": "m",
     "src": "root leading edge 8 m aft of the nose, at the same height as the fuselage centerline"
    }
   ]
  },
  {
   "id": "vertical_tail",
   "role": "vertical_tail",
   "reqs": [
    {
     "name": "height",
     "value": 1.8,
     "unit": "m",
     "src": "height of 1.8 m upward along +Z from the root"
    },
    {
     "name": "root_chord",
     "value": 1.5,
     "unit": "m",
     "src": "root chord of 1.5 m"
    },
    {
     "name": "tip_chord",
     "value": 0.7,
     "unit": "m",
     "src": "tip chord of 0.7 m"
    },
    {
     "name": "sweep_25pct",
     "value": 25.0,
     "unit": "deg",
     "src": "25 degree sweep measured at 25% chord"
    },
    {
     "name": "airfoil_root",
     "value": "NACA 0012",
     "unit": "airfoil",
     "src": "using NACA 0012 at both the root and the tip"
    },
    {
     "name": "airfoil_tip",
     "value": "NACA 0012",
     "unit": "airfoil",
     "src": "using NACA 0012 at both the root and the tip"
    },
    {
     "name": "root_leading_edge_location",
     "value": "(8,0,0)",
     "unit": "m",
     "src": "root leading edge on the fuselage centerline 8 m aft of the nose"
    }
   ]
  }
 ],
 "geometry_knowledge": [
  {
   "id": "geometry-knowledge:geom",
   "holds": true,
   "reason": "Request specifies a fuselage, wings, and tails, requiring knowledge of Geom types and cross‑section handling."
  },
  {
   "id": "geometry-knowledge:sweep",
   "holds": true,
   "reason": "Request includes sweep angles measured at 25% chord for all wing and tail sections."
  },
  {
   "id": "geometry-knowledge:airfoil",
   "holds": true,
   "reason": "Request specifies NACA 0012 airfoil for all sections."
  },
  {
   "id": "geometry-knowledge:symmetry",
   "holds": true,
   "reason": "Main wing and horizontal tail are symmetric about XZ plane; vertical tail is single."
  },
  {
   "id": "geometry-knowledge:span",
   "holds": true,
   "reason": "Request provides span values for wing and tails, requiring span calculation with symmetry."
  },
  {
   "id": "geometry-knowledge:pose",
   "holds": true,
   "reason": "All components are aligned along +X axis with default +Y span; pose parameters needed."
  },
  {
   "id": "geometry-knowledge:drivers",
   "holds": true,
   "reason": "Wing, tail, and vertical tail sections have independent span, root chord, tip chord values."
  },
  {
   "id": "geometry-knowledge:fusesec",
   "holds": true,
   "reason": "Fuselage requires width and height specifications across ellipse sections."
  },
  {
   "id": "geometry-knowledge:wingsec",
   "holds": true,
   "reason": "Wing, horizontal tail, and vertical tail sections need chord, sweep, and airfoil parameters per section."
  }
 ],
 "code_knowledge": [
  {
   "id": "code-rag:sym_flag",
   "holds": true
  }
 ],
 "validation": [
  "rule violations: fuselage has a requested direction ('tail pointing along +X') but the plan names no rotation Parm. State which rotation Parm of FUSELAGE gives that direction and its value, even when the value is 0: X_Rel_Rotation, X_Rotation, Y_Rel_Rotation, Y_Rotation, Z_Rel_Rotation, Z_Rotation | main_wing plan pairs Parms with groups that do not hold them: Camber belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_0; Camber belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_1; CamberLoc belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_0; CamberLoc belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_1; ThickChord belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_0; ThickChord belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_1. Use the group the notation lists for each Parm. | main_wing plan puts Parms in groups that do not hold them: Camber is in XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, not XSec_0; Camber is in XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, not XSec_1. Name the group the notation lists for each Parm. | main_wing gives values to section Parms (Root_Chord, Span, Tip_Chord) but names no driver identifiers. A section keeps exactly three driver identifiers, one per independent Parm; state the three for this section from: SPAN_WSECT_DRIVER=Span, ROOTC_WSECT_DRIVER=Root_Chord, TIPC_WSECT_DRIVER=Tip_Chord, AREA_WSECT_DRIVER=Area, AR_WSECT_DRIVER=Aspect, TAPER_WSECT_DRIVER=Taper, AVEC_WSECT_DRIVER=Avg_Chord | main_wing plan uses numbers the request does not state and no calculation explains: 0.12. For each such number, record in calculations where it comes from in the request (the value or code it is read from) and the relation that gives this number, with its result. | horizontal_tail plan pairs Parms with groups that do not hold them: Camber belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_0/XSec_1; CamberLoc belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_0/XSec_1; ThickChord belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_0/XSec_1. Use the group the notation lists for each Parm. | horizontal_tail plan puts Parms in groups that do not hold them: Camber is in XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, not XSec_1. Name the group the notation lists for each Parm. | horizontal_tail gives values to section Parms (Root_Chord, Span, Tip_Chord) but names no driver identifiers. A section keeps exactly three driver identifiers, one per independent Parm; state the three for this section from: SPAN_WSECT_DRIVER=Span, ROOTC_WSECT_DRIVER=Root_Chord, TIPC_WSECT_DRIVER=Tip_Chord, AREA_WSECT_DRIVER=Area, AR_WSECT_DRIVER=Aspect, TAPER_WSECT_DRIVER=Taper, AVEC_WSECT_DRIVER=Avg_Chord | horizontal_tail: these requested values appear in no sentence that names a registered Parm of WING: 'root leading edge 8 m aft of the nose, at the same height as the fuselage centerline'. Write each value together with the Parm and group that carries it. | vertical_tail plan pairs Parms with groups that do not hold them: Camber belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_0/XSec_1; CamberLoc belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_0/XSec_1; ThickChord belongs to XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, but the sentence names XSec_0/XSec_1. Use the group the notation lists for each Parm. | vertical_tail plan puts Parms in groups that do not hold them: Camber is in XSecCurve_0/XSecCurve_1/XSecCurve_2/XSecCurve_3/XSecCurve_4, not XSec_1. Name the group the notation lists for each Parm. | vertical_tail gives values to section Parms (Root_Chord, Span, Tip_Chord) but names no driver identifiers. A section keeps exactly three driver identifiers, one per independent Parm; state the three for this section from: SPAN_WSECT_DRIVER=Span, ROOTC_WSECT_DRIVER=Root_Chord, TIPC_WSECT_DRIVER=Tip_Chord, AREA_WSECT_DRIVER=Area, AR_WSECT_DRIVER=Aspect, TAPER_WSECT_DRIVER=Taper, AVEC_WSECT_DRIVER=Avg_Chord",
  "rule violations: horizontal_tail: these requested values appear in no sentence that names a registered Parm of WING: 'root leading edge 8 m aft of the nose, at the same height as the fuselage centerline'. Write each value together with the Parm and group that carries it."
 ],
 "plan": [
  {
   "id": "fuselage",
   "type": "FUSELAGE",
   "plan": "Create a FUSELAGE with Length 10.0 m. Set the XSecCurve_1, XSecCurve_2 and XSecCurve_3 Ellipse_Width to 1.5 m and Ellipse_Height to 1.5 m. Place the fuselage so that its nose is at the origin (0,0,0) and its tail points along +X by setting X_Rel_Rotation to 0°."
  },
  {
   "id": "main_wing",
   "type": "WING",
   "plan": "Create a WING with Sym_Planar_Flag set to SYM_XZ (left‑right symmetry). Set the XSec_1 Span to 5.0 m, Root_Chord to 2.0 m, Tip_Chord to 1.0 m, Sweep to 15.0 deg, Sweep_Location to 0.25. Set the XSecCurve_0 Camber to 0, CamberLoc to 0, ThickChord to 0.12. Set the XSecCurve_1 Camber to 0, CamberLoc to 0, ThickChord to 0.12. Assign the section driver identifiers SPAN_WSECT_DRIVER, ROOTC_WSECT_DRIVER, TIPC_WSECT_DRIVER. Place the wing so that its root leading edge is at X_Rel_Location 4.0 m, Y_Rel_Location 0 m, Z_Rel_Location 0 m and its span direction is +Y (no rotation)."
  },
  {
   "id": "horizontal_tail",
   "type": "WING",
   "plan": "Create a WING with Sym_Planar_Flag set to SYM_XZ. Set the XSec_1 Span to 2.0 m, Root_Chord to 1.2 m, Tip_Chord to 0.6 m, Sweep to 15.0 deg, Sweep_Location to 0.25. Set the XSecCurve_0 Camber to 0, CamberLoc to 0, ThickChord to 0.12. Set the XSecCurve_1 Camber to 0, CamberLoc to 0, ThickChord to 0.12. Assign the section driver identifiers SPAN_WSECT_DRIVER, ROOTC_WSECT_DRIVER, TIPC_WSECT_DRIVER. Place the tail so that its root leading edge is at X_Rel_Location 8.0 m, Y_Rel_Location 0 m, Z_Rel_Location 0 m and its span direction is +Y (no rotation)."
  },
  {
   "id": "vertical_tail",
   "type": "WING",
   "plan": "Create a WING with Sym_Planar_Flag set to 0 (single component). Set the XSec_1 Span to 1.8 m, Root_Chord to 1.5 m, Tip_Chord to 0.7 m, Sweep to 25.0 deg, Sweep_Location to 0.25. Set the XSecCurve_0 Camber to 0, CamberLoc to 0, ThickChord to 0.12. Set the XSecCurve_1 Camber to 0, CamberLoc to 0, ThickChord to 0.12. Assign the section driver identifiers SPAN_WSECT_DRIVER, ROOTC_WSECT_DRIVER, TIPC_WSECT_DRIVER. Place the tail so that its root leading edge is at X_Rel_Location 8.0 m, Y_Rel_Location 0 m, Z_Rel_Location 0 m and rotate the span direction to +Z by setting X_Rel_Rotation to 90°."
  }
 ],
 "calculations": [
  {
   "description": "Determine symmetry multiplier N for main wing",
   "expression": "N = 2 (Sym_Planar_Flag = SYM_XZ)",
   "result": "2",
   "unit": ""
  },
  {
   "description": "Compute Span per side for main wing",
   "expression": "Span_per_side = 10.0 / 2 = 5.0",
   "result": "5.0",
   "unit": "m"
  },
  {
   "description": "Determine symmetry multiplier N for horizontal tail",
   "expression": "N = 2 (Sym_Planar_Flag = SYM_XZ)",
   "result": "2",
   "unit": ""
  },
  {
   "description": "Compute Span per side for horizontal tail",
   "expression": "Span_per_side = 4.0 / 2 = 2.0",
   "result": "2.0",
   "unit": "m"
  },
  {
   "description": "Determine symmetry multiplier N for vertical tail",
   "expression": "N = 1 (Sym_Planar_Flag = 0)",
   "result": "1",
   "unit": ""
  },
  {
   "description": "Compute Span for vertical tail",
   "expression": "Span = 1.8 / 1 = 1.8",
   "result": "1.8",
   "unit": "m"
  },
  {
   "description": "Compute NACA 0012 thickness ratio",
   "expression": "ThickChord = 0.12 (12% of chord)",
   "result": "0.12",
   "unit": ""
  }
 ],
 "code": "void build_vehicle()\n{\n    string fuselage = AddGeom(\"FUSELAGE\", \"\");\n    SetParmVal(fuselage, \"Length\", \"Design\", 10.0);\n    SetParmVal(fuselage, \"Ellipse_Width\", \"XSecCurve_1\", 1.5);\n    SetParmVal(fuselage, \"Ellipse_Height\", \"XSecCurve_1\", 1.5);\n    SetParmVal(fuselage, \"Ellipse_Width\", \"XSecCurve_2\", 1.5);\n    SetParmVal(fuselage, \"Ellipse_Height\", \"XSecCurve_2\", 1.5);\n    SetParmVal(fuselage, \"Ellipse_Width\", \"XSecCurve_3\", 1.5);\n    SetParmVal(fuselage, \"Ellipse_Height\", \"XSecCurve_3\", 1.5);\n    SetParmVal(fuselage, \"X_Rel_Rotation\", \"XForm\", 0.0);\n\n    string main_wing = AddGeom(\"WING\", \"\");\n    SetParmVal(main_wing, \"Sym_Planar_Flag\", \"Sym\", 2);\n    SetParmVal(main_wing, \"Span\", \"XSec_1\", 5.0);\n    SetParmVal(main_wing, \"Root_Chord\", \"XSec_1\", 2.0);\n    SetParmVal(main_wing, \"Tip_Chord\", \"XSec_1\", 1.0);\n    SetParmVal(main_wing, \"Sweep\", \"XSec_1\", 15.0);\n    SetParmVal(main_wing, \"Sweep_Location\", \"XSec_1\", 0.25);\n    SetParmVal(main_wing, \"Camber\", \"XSecCurve_0\", 0.0);\n    SetParmVal(main_wing, \"CamberLoc\", \"XSecCurve_0\", 0.0);\n    SetParmVal(main_wing, \"ThickChord\", \"XSecCurve_0\", 0.12);\n    SetParmVal(main_wing, \"Camber\", \"XSecCurve_1\", 0.0);\n    SetParmVal(main_wing, \"CamberLoc\", \"XSecCurve_1\", 0.0);\n    SetParmVal(main_wing, \"ThickChord\", \"XSecCurve_1\", 0.12);\n    SetDriverGroup(main_wing, 0, SPAN_WSECT_DRIVER, ROOTC_WSECT_DRIVER, TIPC_WSECT_DRIVER);\n    SetParmVal(main_wing, \"X_Rel_Location\", \"XForm\", 4.0);\n    SetParmVal(main_wing, \"Y_Rel_Location\", \"XForm\", 0.0);\n    SetParmVal(main_wing, \"Z_Rel_Location\", \"XForm\", 0.0);\n\n    string horizontal_tail = AddGeom(\"WING\", \"\");\n    SetParmVal(horizontal_tail, \"Sym_Planar_Flag\", \"Sym\", 2);\n    SetParmVal(horizontal_tail, \"Span\", \"XSec_1\", 2.0);\n    SetParmVal(horizontal_tail, \"Root_Chord\", \"XSec_1\", 1.2);\n    SetParmVal(horizontal_tail, \"Tip_Chord\", \"XSec_1\", 0.6);\n    SetParmVal(horizontal_tail, \"Sweep\", \"XSec_1\", 15.0);\n    SetParmVal(horizontal_tail, \"Sweep_Location\", \"XSec_1\", 0.25);\n    SetParmVal(horizontal_tail, \"Camber\", \"XSecCurve_0\", 0.0);\n    SetParmVal(horizontal_tail, \"CamberLoc\", \"XSecCurve_0\", 0.0);\n    SetParmVal(horizontal_tail, \"ThickChord\", \"XSecCurve_0\", 0.12);\n    SetParmVal(horizontal_tail, \"Camber\", \"XSecCurve_1\", 0.0);\n    SetParmVal(horizontal_tail, \"CamberLoc\", \"XSecCurve_1\", 0.0);\n    SetParmVal(horizontal_tail, \"ThickChord\", \"XSecCurve_1\", 0.12);\n    SetDriverGroup(horizontal_tail, 0, SPAN_WSECT_DRIVER, ROOTC_WSECT_DRIVER, TIPC_WSECT_DRIVER);\n    SetParmVal(horizontal_tail, \"X_Rel_Location\", \"XForm\", 8.0);\n    SetParmVal(horizontal_tail, \"Y_Rel_Location\", \"XForm\", 0.0);\n    SetParmVal(horizontal_tail, \"Z_Rel_Location\", \"XForm\", 0.0);\n\n    string vertical_tail = AddGeom(\"WING\", \"\");\n    SetParmVal(vertical_tail, \"Sym_Planar_Flag\", \"Sym\", 0);\n    SetParmVal(vertical_tail, \"Span\", \"XSec_1\", 1.8);\n    SetParmVal(vertical_tail, \"Root_Chord\", \"XSec_1\", 1.5);\n    SetParmVal(vertical_tail, \"Tip_Chord\", \"XSec_1\", 0.7);\n    SetParmVal(vertical_tail, \"Sweep\", \"XSec_1\", 25.0);\n    SetParmVal(vertical_tail, \"Sweep_Location\", \"XSec_1\", 0.25);\n    SetParmVal(vertical_tail, \"Camber\", \"XSecCurve_0\", 0.0);\n    SetParmVal(vertical_tail, \"CamberLoc\", \"XSecCurve_0\", 0.0);\n    SetParmVal(vertical_tail, \"ThickChord\", \"XSecCurve_0\", 0.12);\n    SetParmVal(vertical_tail, \"Camber\", \"XSecCurve_1\", 0.0);\n    SetParmVal(vertical_tail, \"CamberLoc\", \"XSecCurve_1\", 0.0);\n    SetParmVal(vertical_tail, \"ThickChord\", \"XSecCurve_1\", 0.12);\n    SetDriverGroup(vertical_tail, 0, SPAN_WSECT_DRIVER, ROOTC_WSECT_DRIVER, TIPC_WSECT_DRIVER);\n    SetParmVal(vertical_tail, \"X_Rel_Location\", \"XForm\", 8.0);\n    SetParmVal(vertical_tail, \"Y_Rel_Location\", \"XForm\", 0.0);\n    SetParmVal(vertical_tail, \"Z_Rel_Location\", \"XForm\", 0.0);\n    SetParmVal(vertical_tail, \"X_Rel_Rotation\", \"XForm\", 90.0);\n\n    Update();\n}\n",
 "verification": {
  "status": "PASS",
  "summary": "All requirements are satisfied. No corrections needed.",
  "checks": [
   {
    "c": "fuselage",
    "n": "length",
    "e": 10.0,
    "o": 10.0,
    "p": true
   },
   {
    "c": "fuselage",
    "n": "max_width",
    "e": 1.5,
    "o": 1.5,
    "p": true
   },
   {
    "c": "fuselage",
    "n": "max_height",
    "e": 1.5,
    "o": 1.5,
    "p": true
   },
   {
    "c": "fuselage",
    "n": "nose_position",
    "e": "(0,0,0)",
    "o": "(0,0,0)",
    "p": true
   },
   {
    "c": "fuselage",
    "n": "tail_direction",
    "e": "+X",
    "o": "+X (default rotation 0°)",
    "p": true
   },
   {
    "c": "main_wing",
    "n": "span",
    "e": 10.0,
    "o": 10.0,
    "p": true
   },
   {
    "c": "main_wing",
    "n": "root_chord",
    "e": 2.0,
    "o": 2.0,
    "p": true
   },
   {
    "c": "main_wing",
    "n": "tip_chord",
    "e": 1.0,
    "o": 1.0,
    "p": true
   },
   {
    "c": "main_wing",
    "n": "sweep_25pct",
    "e": 15.0,
    "o": 15.0,
    "p": true
   },
   {
    "c": "main_wing",
    "n": "airfoil_root",
    "e": "NACA 0012",
    "o": "FourSeries (NACA 0012)",
    "p": true
   },
   {
    "c": "main_wing",
    "n": "airfoil_tip",
    "e": "NACA 0012",
    "o": "FourSeries (NACA 0012)",
    "p": true
   },
   {
    "c": "main_wing",
    "n": "leading_edge_location",
    "e": "(4,0,0)",
    "o": "(4,0,0)",
    "p": true
   },
   {
    "c": "horizontal_tail",
    "n": "span",
    "e": 4.0,
    "o": 4.0,
    "p": true
   },
   {
    "c": "horizontal_tail",
    "n": "root_chord",
    "e": 1.2,
    "o": 1.2,
    "p": true
   },
   {
    "c": "horizontal_tail",
    "n": "tip_chord",
    "e": 0.6,
    "o": 0.6,
    "p": true
   },
   {
    "c": "horizontal_tail",
    "n": "sweep_25pct",
    "e": 15.0,
    "o": 15.0,
    "p": true
   },
   {
    "c": "horizontal_tail",
    "n": "airfoil_root",
    "e": "NACA 0012",
    "o": "FourSeries (NACA 0012)",
    "p": true
   },
   {
    "c": "horizontal_tail",
    "n": "airfoil_tip",
    "e": "NACA 0012",
    "o": "FourSeries (NACA 0012)",
    "p": true
   },
   {
    "c": "horizontal_tail",
    "n": "leading_edge_location",
    "e": "(8,0,0)",
    "o": "(8,0,0)",
    "p": true
   },
   {
    "c": "vertical_tail",
    "n": "height",
    "e": 1.8,
    "o": 1.8,
    "p": true
   },
   {
    "c": "vertical_tail",
    "n": "root_chord",
    "e": 1.5,
    "o": 1.5,
    "p": true
   },
   {
    "c": "vertical_tail",
    "n": "tip_chord",
    "e": 0.7,
    "o": 0.7,
    "p": true
   },
   {
    "c": "vertical_tail",
    "n": "sweep_25pct",
    "e": 25.0,
    "o": 25.0,
    "p": true
   },
   {
    "c": "vertical_tail",
    "n": "airfoil_root",
    "e": "NACA 0012",
    "o": "FourSeries (NACA 0012)",
    "p": true
   },
   {
    "c": "vertical_tail",
    "n": "airfoil_tip",
    "e": "NACA 0012",
    "o": "FourSeries (NACA 0012)",
    "p": true
   },
   {
    "c": "vertical_tail",
    "n": "root_leading_edge_location",
    "e": "(8,0,0)",
    "o": "(8,0,0)",
    "p": true
   }
  ]
 },
 "usage": {
  "01_interpretation_attempt_1": {
   "in": 1810,
   "out": 1024,
   "elapsed_s": null
  },
  "02_code_knowledge_attempt_1": {
   "in": 3808,
   "out": 282,
   "elapsed_s": null
  },
  "02_geometry_knowledge_attempt_1": {
   "in": 10097,
   "out": 582,
   "elapsed_s": null
  },
  "03_geometry_attempt_1": {
   "in": 15690,
   "out": 1279,
   "elapsed_s": null
  },
  "03_geometry_attempt_2": {
   "in": 19720,
   "out": 2677,
   "elapsed_s": null
  },
  "03_geometry_attempt_3": {
   "in": 17343,
   "out": 2087,
   "elapsed_s": null
  },
  "04_code_attempt_1": {
   "in": 3115,
   "out": 1430,
   "elapsed_s": 40.038062
  },
  "05_model_verification_1_attempt_1": {
   "in": 25850,
   "out": 2044,
   "elapsed_s": null
  }
 },
 "runtime": 0
};
