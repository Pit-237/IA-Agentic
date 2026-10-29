import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  GraduationCap,
  Menu,
  Newspaper,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { api, formatDate, type Course, type Institution, type NewsArticle, type NewsInput } from "./api";

function useLoad<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api<T>(path)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Erro ao carregar conteúdo.");
      });
    return () => {
      active = false;
    };
  }, [path]);

  return { data, error };
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link className="brand" to="/" aria-label="Etec Sales Gomes — página inicial" onClick={closeMenu}>
          <span className="brand-mark"><GraduationCap size={24} aria-hidden="true" /></span>
          <span className="brand-copy"><strong>Etec Sales Gomes</strong><small>Educação que transforma</small></span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
        <nav id="primary-navigation" className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Navegação principal">
          <NavLink to="/escola" onClick={closeMenu}>A escola</NavLink>
          <NavLink to="/cursos" onClick={closeMenu}>Cursos</NavLink>
          <NavLink to="/noticias" onClick={closeMenu}>Notícias</NavLink>
          <Link className="nav-cta" to="/cursos" onClick={closeMenu}>Encontre seu curso <ArrowUpRight size={16} /></Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Link className="brand footer-brand" to="/">
            <span className="brand-mark"><GraduationCap size={24} aria-hidden="true" /></span>
            <span className="brand-copy"><strong>Etec Sales Gomes</strong><small>Educação que transforma</small></span>
          </Link>
          <p>Conhecimento para construir novos caminhos.</p>
        </div>
        <div className="footer-links">
          <span className="eyebrow">Explore</span>
          <Link to="/escola">A escola</Link>
          <Link to="/cursos">Cursos técnicos</Link>
          <Link to="/noticias">Notícias</Link>
        </div>
        <div className="footer-links">
          <span className="eyebrow">Acesso</span>
          <Link to="/admin">Área administrativa</Link>
          <a href="https://etecsalesgomes.cps.sp.gov.br/ensino-tecnico/" target="_blank" rel="noreferrer">
            Site institucional oficial <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Etec Sales Gomes</span>
        <span>Conteúdo demonstrativo em desenvolvimento.</span>
      </div>
    </footer>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return <><a className="skip-link" href="#main-content">Pular para o conteúdo</a><Header /><main id="main-content">{children}</main><Footer /></>;
}

function PageIntro({ label, title, description }: { label: string; title: string; description: string }) {
  return <section className="page-intro"><div className="container"><span className="eyebrow">{label}</span><h1>{title}</h1><p>{description}</p></div></section>;
}

function Loading({ label = "Carregando conteúdo..." }: { label?: string }) {
  return <p className="status-message" role="status">{label}</p>;
}

function ErrorMessage({ children }: { children: string }) {
  return <p className="error-message" role="alert">{children}</p>;
}

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <span className="card-icon"><BookOpen size={22} aria-hidden="true" /></span>
      <span className="eyebrow">{course.area}</span>
      <h3>{course.name}</h3>
      <p>{course.summary}</p>
      <div className="course-meta"><span>{course.duration}</span><span>{course.schedule}</span></div>
      <Link className="text-link" to={`/cursos/${course.slug}`}>Conheça a matriz <ArrowRight size={16} /></Link>
    </article>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="news-card">
      <div className="news-card-top"><span className="card-icon"><Newspaper size={21} aria-hidden="true" /></span><time dateTime={article.created_at}>{formatDate(article.created_at)}</time></div>
      <h3><Link to={`/noticias/${article.id}`}>{article.title}</Link></h3>
      <p>{article.excerpt}</p>
      <Link className="text-link" to={`/noticias/${article.id}`}>Leia a notícia <ArrowRight size={16} /></Link>
    </article>
  );
}

function HomePage() {
  const { data: courseData, error: courseError } = useLoad<{ courses: Course[]; mock: boolean }>("/courses");
  const { data: newsData, error: newsError } = useLoad<{ news: NewsArticle[] }>("/news");
  return (
    <>
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-content">
          <span className="hero-label"><span /> Ensino técnico • Conhecimento • Futuro</span>
          <h1>Seu próximo<br /><em>começo</em> começa aqui.</h1>
          <p>Aprenda, experimente e descubra novos caminhos. Uma formação técnica que aproxima conhecimento e oportunidades.</p>
          <div className="hero-actions"><Link className="button button-light" to="/cursos">Conheça os cursos <ArrowRight size={18} /></Link><Link className="button button-outline" to="/escola">Sobre a escola</Link></div>
          <a className="hero-scroll" href="#cursos"><ArrowDown size={16} /> Explore a escola</a>
        </div>
        <div className="hero-stamp" aria-hidden="true"><span>Educação<br />pública de<br />qualidade</span><GraduationCap size={28} /></div>
      </section>

      <section className="section section-intro">
        <div className="container intro-grid">
          <div><span className="eyebrow">Aprender para transformar</span><h2>Conhecimento que abre <em>possibilidades.</em></h2></div>
          <div className="intro-copy"><p>Acreditamos que a educação transforma trajetórias. Aqui, teoria e prática caminham juntas para preparar estudantes para os desafios do mundo do trabalho e da vida.</p><Link className="text-link" to="/escola">Conheça a Etec Sales Gomes <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section id="cursos" className="section section-tinted">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Formação técnica</span><h2>Aprenda fazendo.</h2><p>Explore áreas de conhecimento e encontre onde quer chegar.</p></div><Link className="text-link desktop-link" to="/cursos">Todos os cursos <ArrowRight size={16} /></Link></div>
          {courseError && <ErrorMessage>{courseError}</ErrorMessage>}
          {!courseData && !courseError && <Loading label="Carregando cursos..." />}
          <div className="card-grid">{courseData?.courses.slice(0, 3).map((course) => <CourseCard key={course.slug} course={course} />)}</div>
          {courseData?.mock && <p className="mock-note">Os cursos e componentes curriculares exibidos são exemplos temporários e não representam a oferta oficial.</p>}
          <Link className="text-link mobile-link" to="/cursos">Ver todos os cursos <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading"><div><span className="eyebrow">Acontece na escola</span><h2>Notícias e novidades.</h2><p>Fique por dentro do que movimenta nossa comunidade.</p></div><Link className="text-link desktop-link" to="/noticias">Todas as notícias <ArrowRight size={16} /></Link></div>
          {newsError && <ErrorMessage>{newsError}</ErrorMessage>}
          {!newsData && !newsError && <Loading label="Carregando notícias..." />}
          {newsData?.news.length ? <div className="card-grid news-grid">{newsData.news.slice(0, 3).map((article) => <NewsCard key={article.id} article={article} />)}</div> : newsData && <div className="empty-state"><Newspaper size={28} /><p>As novidades da comunidade escolar aparecerão aqui em breve.</p></div>}
          <Link className="text-link mobile-link" to="/noticias">Ver todas as notícias <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="cta-band"><div className="container cta-inner"><div><span className="eyebrow">Seu futuro começa com uma escolha</span><h2>Pronto para descobrir<br />o que vem depois?</h2></div><Link className="button button-light" to="/cursos">Explore os cursos <ArrowRight size={18} /></Link></div></section>
    </>
  );
}

function SchoolPage() {
  const { data, error } = useLoad<Institution>("/institution");
  if (error) return <PageIntro label="Nossa escola" title="Etec Sales Gomes" description={error} />;
  if (!data) return <PageIntro label="Nossa escola" title="Etec Sales Gomes" description="Carregando informações institucionais..." />;
  return (
    <>
      <PageIntro label="Nossa escola" title="Educação que transforma." description={data.description} />
      <section className="section"><div className="container school-grid"><div><span className="eyebrow">Nossa missão</span><h2>Aprender hoje.<br /><em>Transformar o amanhã.</em></h2></div><div className="school-copy"><p>{data.mission}</p><p className="mock-note">{data.notice}</p></div></div></section>
      <section className="section section-tinted"><div className="container"><span className="eyebrow">O que nos move</span><h2>Valores para seguir em frente.</h2><div className="value-grid">{data.values.map((value, index) => <div className="value-item" key={value}><span>0{index + 1}</span><h3>{value}</h3></div>)}</div></div></section>
      <section className="section"><div className="container official-note"><ShieldCheck size={24} /><div><h2>Informações oficiais</h2><p>Este espaço está em construção. Para endereço, calendário, inscrições e atendimento, consulte os canais oficiais da escola.</p><a className="text-link" href="https://etecsalesgomes.cps.sp.gov.br/ensino-tecnico/" target="_blank" rel="noreferrer">Acessar site oficial <ArrowUpRight size={16} /></a></div></div></section>
    </>
  );
}

function CoursesPage() {
  const [query, setQuery] = useState("");
  const { data, error } = useLoad<{ courses: Course[]; mock: boolean }>("/courses");
  const filtered = data?.courses.filter((course) => `${course.name} ${course.area}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")));
  return (
    <>
      <PageIntro label="Formação técnica" title="Encontre seu caminho." description="Conheça as áreas de formação e explore exemplos de matrizes curriculares." />
      <section className="section section-tinted"><div className="container">
        <label className="search-field">Buscar curso<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Digite o nome ou área" /></label>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {!data && !error && <Loading label="Carregando cursos..." />}
        {data && <p className="mock-note">Catálogo e matrizes curriculares demonstrativos. Consulte os canais oficiais para confirmar os cursos, a oferta e a grade vigente.</p>}
        {filtered?.length ? <div className="card-grid">{filtered.map((course) => <CourseCard key={course.slug} course={course} />)}</div> : data && <div className="empty-state"><BookOpen size={26} /><p>Nenhum curso corresponde à busca.</p></div>}
      </div></section>
    </>
  );
}

function CourseDetailPage() {
  const { slug = "" } = useParams();
  const { data, error } = useLoad<{ course: Course; mock: boolean }>(`/courses/${encodeURIComponent(slug)}`);
  if (error) return <><PageIntro label="Cursos" title="Curso não encontrado." description={error} /><div className="container section"><Link className="text-link" to="/cursos"><ArrowLeft size={16} /> Voltar aos cursos</Link></div></>;
  if (!data) return <Loading label="Carregando matriz curricular..." />;
  const { course } = data;
  return (
    <>
      <PageIntro label={course.area} title={course.name} description={course.summary} />
      <section className="section"><div className="container">
        <div className="course-detail-meta"><span><GraduationCap size={18} /> {course.duration}</span><span>{course.schedule}</span></div>
        <p className="mock-note">Matriz curricular ilustrativa, sujeita a confirmação e atualização pela escola.</p>
        <div className="curriculum-list">{course.semesters.map((semester) => <section className="semester-card" key={semester.term}><h2>{semester.term}</h2><ul>{semester.subjects.map((subject) => <li key={subject}><Check size={16} />{subject}</li>)}</ul></section>)}</div>
        <Link className="text-link back-link" to="/cursos"><ArrowLeft size={16} /> Voltar ao catálogo</Link>
      </div></section>
    </>
  );
}

function NewsPage() {
  const { data, error } = useLoad<{ news: NewsArticle[] }>("/news");
  return (
    <>
      <PageIntro label="Acontece na escola" title="Notícias e novidades." description="Histórias, projetos e informações da comunidade escolar." />
      <section className="section section-tinted"><div className="container">
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {!data && !error && <Loading label="Carregando notícias..." />}
        {data?.news.length ? <div className="card-grid news-grid">{data.news.map((article) => <NewsCard key={article.id} article={article} />)}</div> : data && <div className="empty-state"><Newspaper size={28} /><p>Ainda não há notícias publicadas. Volte em breve.</p></div>}
      </div></section>
    </>
  );
}

function NewsDetailPage() {
  const { id = "" } = useParams();
  const { data, error } = useLoad<{ news: NewsArticle }>(`/news/${encodeURIComponent(id)}`);
  if (error) return <><PageIntro label="Notícias" title="Notícia não encontrada." description={error} /><div className="container section"><Link className="text-link" to="/noticias"><ArrowLeft size={16} /> Voltar às notícias</Link></div></>;
  if (!data) return <Loading label="Carregando notícia..." />;
  return <article className="article-page"><div className="container article-container"><Link className="text-link" to="/noticias"><ArrowLeft size={16} /> Todas as notícias</Link><time dateTime={data.news.created_at}>{formatDate(data.news.created_at)}</time><h1>{data.news.title}</h1><p className="article-excerpt">{data.news.excerpt}</p><div className="article-body">{data.news.body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></div></article>;
}

const emptyNews: NewsInput = { title: "", excerpt: "", body: "", published: false };

function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [form, setForm] = useState<NewsInput>(emptyNews);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  const loadArticles = () => api<{ news: NewsArticle[] }>("/admin/news").then((result) => setArticles(result.news));

  useEffect(() => {
    api<{ authenticated: boolean }>("/admin/session")
      .then(async (result) => {
        setAuthenticated(result.authenticated);
        if (result.authenticated) await loadArticles();
      })
      .catch((reason: unknown) => {
        setAuthenticated(false);
        setError(reason instanceof Error ? reason.message : "Não foi possível verificar o acesso.");
      });
  }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    try {
      await api("/admin/login", { method: "POST", body: JSON.stringify({ username: formData.get("username"), password: formData.get("password") }) });
      setAuthenticated(true);
      await loadArticles();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível entrar.");
    }
  }

  async function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const path = editingId ? `/admin/news/${editingId}` : "/admin/news";
      await api(path, { method: editingId ? "PUT" : "POST", body: JSON.stringify(form) });
      setForm(emptyNews);
      setEditingId(null);
      await loadArticles();
      setNotice("Notícia salva com sucesso.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível salvar a notícia.");
    }
  }

  function editArticle(article: NewsArticle) {
    setEditingId(article.id);
    setForm({ title: article.title, excerpt: article.excerpt, body: article.body, published: Boolean(article.published) });
    setNotice("");
  }

  async function deleteArticle(id: string) {
    if (!window.confirm("Excluir esta notícia permanentemente?")) return;
    setError("");
    try {
      await api(`/admin/news/${id}`, { method: "DELETE" });
      setArticles((current) => current.filter((article) => article.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyNews);
      }
      setNotice("Notícia excluída.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível excluir a notícia.");
    }
  }

  async function logout() {
    try {
      await api("/admin/logout", { method: "POST" });
      setAuthenticated(false);
      setArticles([]);
      setForm(emptyNews);
      setEditingId(null);
      navigate("/admin");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível sair.");
    }
  }

  if (authenticated === null) return <PageIntro label="Área administrativa" title="Acesso restrito." description="Verificando sua sessão..." />;
  if (!authenticated) {
    return (
      <>
        <PageIntro label="Área administrativa" title="Acesso restrito." description="Entre com as credenciais administrativas para gerenciar as notícias." />
        <section className="section section-tinted"><form className="admin-login form-panel" onSubmit={login}><h2>Entrar</h2><label>Usuário<input name="username" autoComplete="username" required /></label><label>Senha<input name="password" type="password" autoComplete="current-password" required /></label>{error && <ErrorMessage>{error}</ErrorMessage>}<button className="button button-dark" type="submit">Entrar <ArrowRight size={17} /></button></form></section>
      </>
    );
  }

  return (
    <>
      <PageIntro label="Área administrativa" title="Gerenciar notícias." description="Crie, edite, publique ou remova notícias da página inicial." />
      <section className="section section-tinted"><div className="container admin-layout">
        <div className="admin-heading"><div><span className="eyebrow">Painel editorial</span><h2>Publicações</h2></div><button className="button button-outline-dark" type="button" onClick={logout}>Sair</button></div>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {notice && <p className="success-message" role="status">{notice}</p>}
        <div className="admin-grid">
          <form className="form-panel" onSubmit={saveArticle}>
            <h2>{editingId ? "Editar notícia" : "Nova notícia"}</h2>
            <label>Título<input value={form.title} maxLength={100} onChange={(event) => setForm({ ...form, title: event.target.value })} required minLength={5} /></label>
            <label>Resumo<textarea value={form.excerpt} maxLength={280} rows={3} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} required minLength={10} /></label>
            <label>Conteúdo<textarea value={form.body} maxLength={10000} rows={9} onChange={(event) => setForm({ ...form, body: event.target.value })} required minLength={20} /></label>
            <label className="checkbox-label"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Publicar agora</label>
            <div className="form-actions"><button className="button button-dark" type="submit"><Save size={17} /> Salvar notícia</button>{editingId && <button className="button button-outline-dark" type="button" onClick={() => { setEditingId(null); setForm(emptyNews); }}>Cancelar</button>}</div>
          </form>
          <div className="admin-list"><h2>Notícias <span>{articles.length}</span></h2>{articles.length ? articles.map((article) => <article className="admin-article" key={article.id}><div><strong>{article.title}</strong><span className={article.published ? "status-published" : "status-draft"}>{article.published ? "Publicada" : "Rascunho"}</span><small>{formatDate(article.updated_at)}</small></div><div className="article-actions"><button type="button" aria-label={`Editar ${article.title}`} onClick={() => editArticle(article)}><Save size={17} /></button><button type="button" aria-label={`Excluir ${article.title}`} onClick={() => deleteArticle(article.id)}><Trash2 size={17} /></button></div></article>) : <div className="empty-state"><p>Ainda não há notícias cadastradas.</p><Plus size={20} /></div>}</div>
        </div>
      </div></section>
    </>
  );
}

function NotFoundPage() {
  return <PageIntro label="Página não encontrada" title="Este caminho ainda não existe." description="Confira o endereço ou volte para a página inicial." />;
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/escola" element={<SchoolPage />} />
        <Route path="/cursos" element={<CoursesPage />} />
        <Route path="/cursos/:slug" element={<CourseDetailPage />} />
        <Route path="/noticias" element={<NewsPage />} />
        <Route path="/noticias/:id" element={<NewsDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
