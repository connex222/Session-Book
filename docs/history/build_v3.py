from pathlib import Path
import re, html, json
root=Path('/mnt/data/v3work')
drills=root/'drills'

common_by_theme={
'defend':{
'mistakes':['Arriving too quickly and getting beaten by the first touch.','Watching the ball instead of the attacker’s body shape and next action.','Leaving the space behind or inside unprotected when the ball moves.'],
'good':['Players arrive under control, take away the most dangerous option and stay connected to the next defender.','The first defender buys time; the next action is clear rather than rushed.','The practice produces recognisable defensive habits that transfer into the game.'],
'language':['“Delay first.”','“Show them where we want them to go.”','“See ball and player.”','“Can you arrive under control?”']},
'press':{
'mistakes':['One player presses alone while the rest of the unit stays disconnected.','The press starts without a clear trigger.','Players chase the ball and open the next pass.'],
'good':['The first presser forces play towards a planned area.','Cover and communication arrive early enough to make the next pass uncomfortable.','Players recognise the trigger rather than pressing simply because the ball moves.'],
'language':['“What is our trigger?”','“Press the ball, cover the next pass.”','“Can we make the pitch smaller?”','“Don’t chase — trap.”']},
'possess':{
'mistakes':['Players stand behind defenders instead of creating clear passing lines.','The ball moves faster than the support, leaving the receiver isolated.','Players force a forward pass when the better decision is to secure possession and move the opponent.'],
'good':['The player on the ball has at least two useful options.','Support arrives at useful angles and distances, not simply close to the ball.','Players recognise when to play forward and when to recycle.'],
'language':['“Can you give me two options?”','“Open your body before the ball arrives.”','“Can we move them before we play through?”','“Secure it, then progress.”']},
'attack':{
'mistakes':['The final action is rushed before the advantage has been created.','Players attack the same space instead of stretching the defence.','The supporting player arrives too early and removes the passing option.'],
'good':['Players create a clear advantage before attacking the target area.','Runs have purpose and timing rather than simply movement for movement’s sake.','The final action is taken at speed once the opportunity appears.'],
'language':['“Can you create the advantage first?”','“Stretch them.”','“Arrive, don’t wait.”','“Now — attack the space.”']},
'transition':{
'mistakes':['Players react too slowly when possession changes.','The first action is always forward, even when the ball is not secure.','Players attack without protecting against the counter.'],
'good':['The first three seconds after the turnover have a clear purpose.','Players either counter quickly or secure the ball and reorganise.','The nearest players react first while the rest of the team supports the transition.'],
'language':['“First three seconds!”','“Can we go forward?”','“If it’s not on, secure it.”','“React before you think.”']},
'technical':{
'mistakes':['Players complete the movement without quality in the first touch or pass.','The drill becomes a queue rather than a continuous practice.','Speed is increased before technique is reliable.'],
'good':['The technical action remains clean as speed and pressure increase.','Players prepare the next action before receiving.','There is enough repetition for the behaviour to become automatic.'],
'language':['“Quality first, then speed.”','“What is your next action?”','“Check before you receive.”','“Can you make the next one better?”']},
'goalkeeping':{
'mistakes':['The goalkeeper starts from a poor set position.','The first movement is late because the goalkeeper watches the ball rather than reading the situation.','The recovery action is forgotten after the first save or intervention.'],
'good':['The goalkeeper is balanced and set before the decisive action.','Footwork gets the body into the best position before the save, claim or distribution.','The goalkeeper finishes the action ready for the next phase.'],
'language':['“Set.”','“See it early.”','“Get your feet there first.”','“Recover for the next action.”']},
'set':{
'mistakes':['Players learn the movement without understanding the trigger.','The restart becomes predictable because the timing is too slow.','The team forgets its defensive security when the first option is blocked.'],
'good':['Players know their starting positions and the trigger for movement.','The routine creates a clear first advantage rather than relying on a perfect execution.','Players can continue the attack if the first option is unavailable.'],
'language':['“Know your starting picture.”','“Wait for the trigger.”','“Sell the first movement.”','“If option one is blocked, what is next?”']}
}

def theme_for(s):
    t=(re.search(r'<p class="tagline">(.*?)</p>',s,re.S) or [None,''])[1].lower()
    title=(re.search(r'<h1>(.*?)</h1>',s,re.S) or [None,''])[1].lower()
    x=t+' '+title
    if any(k in x for k in ['goalkeeper','keeper','shot-stopping','crosses']): return 'goalkeeping'
    if any(k in x for k in ['set piece','throw-in','corner','restart']): return 'set'
    if any(k in x for k in ['transition','counter','recovery','counter-press']): return 'transition'
    if any(k in x for k in ['defend','press','block','screen','1v1 defending']): return 'defend' if 'press' not in x else 'press'
    if any(k in x for k in ['finishing','attacking','overload','combination','switch','third-man','build','possession','rondo','rotation']):
        return 'attack' if any(k in x for k in ['finishing','attacking','overload','combination']) else 'possess'
    return 'technical'

def get_time(s):
    m=re.search(r'<span>Time</span><b>([^<]+)</b>',s)
    return m.group(1).strip() if m else '20 min'

def section(h, body):
    return f'<div class="blk v3-block"><h2>{h}</h2>{body}</div>'

def ul(items, cls='cues'):
    return '<ul class="'+cls+'">'+''.join('<li>'+html.escape(x)+'</li>' for x in items)+'</ul>'

for p in drills.glob('*.html'):
    s=p.read_text()
    theme=theme_for(s); data=common_by_theme[theme]
    title=re.sub('<.*?>','',re.search(r'<h1>(.*?)</h1>',s,re.S).group(1)).strip()
    objm=re.search(r'<p class="obj">(.*?)</p>',s,re.S); obj=re.sub('<.*?>','',objm.group(1)).strip() if objm else ''
    time=get_time(s)
    # infer numeric minutes
    nums=re.findall(r'\d+',time)
    mins=int(nums[0]) if nums else 20
    if mins<=15: rhythm=['2–3 min: explain and demo','8–10 min: main practice','2–3 min: progression or competitive finish']
    elif mins<=25: rhythm=['3 min: explain, demo and rehearse','12–15 min: main practice','5–7 min: progression or game']
    else: rhythm=['5 min: explain, demo and rehearse','15–20 min: main practice','10+ min: progression, game or conditioned finish']
    insert=''
    if 'Session rhythm' not in s:
        insert+=section('Session rhythm',ul(rhythm))
    if 'Common mistakes' not in s:
        insert+=section('Common mistakes',ul(data['mistakes'],'cues cues--warn'))
    if 'What good looks like' not in s:
        insert+=section('What good looks like',ul(data['good']))
    if 'Coach\'s language' not in s:
        insert+=section("Coach's language",ul(data['language']))
    if 'Age groups and numbers' not in s:
        # use practical ranges, varying by level
        level=(re.search(r'<p class="eyebrow">(.*?)·',s) or [None,'Foundation'])[1].strip().lower()
        if 'foundation' in level: age='U8–U12'; players='4–16+'; note='Keep the area generous and reduce pressure before adding extra rules.'
        elif 'intermediate' in level: age='U11–U16'; players='6–18+'; note='Use the stated numbers as the base and adjust space before adding complexity.'
        elif 'advanced' in level: age='U14–Adult'; players='8–22+'; note='Increase realism by linking the practice to the next phase rather than simply adding constraints.'
        elif 'touch' in level: age='All ages'; players='2–8'; note='Use it as a technical block or arrival practice; quality matters more than speed.'
        elif 'small' in level: age='U10–Adult'; players='4–10'; note='Ideal when numbers are low. Keep repetitions high and queues short.'
        else: age='U12–Adult'; players='1–8'; note='Adapt the work to the goalkeeper’s experience and keep the next action visible.'
        insert+=section('Age groups and numbers',f'<p><strong>Best fit:</strong> {age} · <strong>Group:</strong> {players}</p><p>{html.escape(note)}</p>')
    if insert:
        # insert before Share this session or Coach's eye, whichever appears first
        marker='</div><div class="blk share' # unlikely
        pos=s.find('<div class="blk"><h2>Share this session</h2>')
        if pos<0: pos=s.find('<div class="coach-note"><h2>Coach\'s eye</h2>')
        if pos<0:
            # before closing main content container near footer
            pos=s.find('<footer')
        if pos>=0: s=s[:pos]+insert+s[pos:]
    s=s.replace('data-session-book-version="2"','data-session-book-version="3"')
    # update modified date in metadata/display only if already 2026-08-25
    p.write_text(s)

# V3 stylesheet enhancements
css=root/'assets/site.css'
cs=css.read_text()
extra='''\n/* Version 3 — coaching-depth and touchline usability */\n.v3-block{position:relative}\n.v3-block h2{letter-spacing:-.01em}\n.v3-block .cues--warn li::marker{color:#e4761b}\n@media print{.v3-block{break-inside:avoid}.v3-block h2{margin-top:0}}\n'''
if 'Version 3 — coaching-depth' not in cs: css.write_text(cs+extra)

# Update README
(root/'README-v3.md').write_text('''# The Session Book — Version 3\n\nVersion 3 keeps the V2 navigation and session-finder improvements and brings the 50 drill pages closer to a consistent coaching standard.\n\n## What changed\n- Added a short **Session rhythm** to every drill page.\n- Standardised **Common mistakes** across the library where they were missing.\n- Standardised **What good looks like** where it was missing.\n- Added **Coach's language** to every session: short, usable touchline prompts.\n- Added **Age groups and numbers** guidance where missing.\n- Preserved the stronger existing bespoke coaching sections rather than overwriting them.\n- Marked pages as `data-session-book-version="3"`.\n- Added small print/CSS refinements for the new coaching blocks.\n\nThe content is intentionally concise: the aim is to help a coach deliver the practice, not bury the session under theory.\n''')
