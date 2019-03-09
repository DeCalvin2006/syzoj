let User = syzoj.model('user');
let Article = syzoj.model('article');
let Contest = syzoj.model('contest');
let Problem = syzoj.model('problem');
let Divine = require('syzoj-divine');
let TimeAgo = require('javascript-time-ago');
let zh = require('../libs/timeago');
TimeAgo.locale(zh);
const timeAgo = new TimeAgo('zh-CN');

app.get('/', async (req, res) => {
  try {
    let shqACNum = (await User.fromID(543)).ac_num;
    let cntHigherThanShq = await User.count({ ac_num: { $gte: shqACNum } });
    let ranklist = await User.query([1, Math.max(cntHigherThanShq, 20)], { is_show: true }, [['ac_num', 'desc']]);
    await ranklist.forEachAsync(async x => x.renderInformation());

    let notices = (await Article.query(null, { is_notice: true }, [['public_time', 'desc']])).map(article => ({
      title: article.title,
      url: syzoj.utils.makeUrl(['article', article.id]),
      date: syzoj.utils.formatDate(article.public_time, 'L')
    }));

    let fortune = null;
    if (res.locals.user) {
      fortune = Divine(res.locals.user.username, res.locals.user.sex);
    }

    let contests = await Contest.query([1, 5], { is_public: true }, [['start_time', 'desc']]);

    let problems = (await Problem.query([1, 5], { is_public: true }, [['publicize_time', 'desc']])).map(problem => ({
      id: problem.id,
      title: problem.title,
      time: timeAgo.format(new Date(problem.publicize_time)),
    }));

    res.render('index', {
      ranklist: ranklist,
      notices: notices,
      fortune: fortune,
      contests: contests,
      problems: problems,
      links: syzoj.config.links,
      show_realname: res.locals.user && (await res.locals.user.hasPrivilege('see_realname'))
    });
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});

app.get('/help', async (req, res) => {
  try {
    res.render('help');
  } catch (e) {
    syzoj.log(e);
    res.render('error', {
      err: e
    });
  }
});
