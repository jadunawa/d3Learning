<?php
/**
 * Plugin Name: D3 Learning
 * Description: I'm learning how to use d3! Shortcode: [d3-learning]
 * Version: 1.0
 * Author: Judson Dunaway-Barlow
 */

function expressions_graph_tablename() {
	global $wpdb;
	return $wpdb->prefix . 'exp_graph_data';
}

function d3_learning_shortcode() {
	global $wpdb;
	?>
	<div id="expressions-graph">
		<h1>Expressions Sites Totals Over Time</h1>
		<div class="graph-1 aGraph">
			<h2>Expressions Individual Sites</h2>
		</div>
		<div class="graph-2 aGraph">
			<h2>Expressions Pro Sites</h2>
		</div>
		<div class="bar-graph zGraph" id="bar-graph">
			<h2> Bar Graph Test</h2>
			<div class="horizontal-bar">
				<h3>Horizontal</h3>
			</div>
			<div class="vertical-bar" id="vertical-bar">
				<h3>Vertical</h3>
			</div>
			<div class="histogram-graph zGraph">
				<h3> Histogram</h2>
			</div>
		</div>
		<div class="pie-chart zGraph">
			<h2> Pie Chart Test</h2>
		</div>
		<div class="line-graph zGraph">
			<h2> Line Graph Test</h2>
			<p> See the first two graphs. </p>
		</div>
		<div class="scatterplot zGraph">
			<h2> Scatterplot Test</h2>
		</div>
		<div class="map-graph zGraph">
			<h2> Map Test</h2>
		</div>
		<div class="word-cloud zGraph">
			<h2>Word Cloud Test</h2>
			<p>The code for this would be hundreds of lines and involve a ton of math. Also, word clouds are rarely a good way to visualize data, and the situations in which they are do not happen to be relevant to university data. </p>
		</div>
		<div class="testing">
			<h2>TESTING</h2>
		</div>
		<div class="reddit-comments-graph">
			<h2>Reddit Comment Analyzer</h2>
		</div>

		<img src="<?php echo plugin_dir_url(__FILE__) . 'built_by_spiders.svg'; ?>" class="bbs-logo">
	</div><?php
	wp_enqueue_style( 'expgraph-style-css', plugin_dir_url(__FILE__) . 'style.css' );
	wp_enqueue_style( 'montserrat', 'http://fonts.googleapis.com/css?family=Montserrat:700' );
	wp_enqueue_script( 'd3-js', plugin_dir_url(__FILE__) . 'd3.v3.min.js', null );
	wp_enqueue_script( 'd3-tip-js', plugin_dir_url(__FILE__) . 'd3.tip.v0.6.3.js', null );
	wp_enqueue_script( 'topojson', plugin_dir_url(__FILE__) . 'topojson.min.js', null );
	wp_enqueue_script( 'expgraph-script-js', plugin_dir_url(__FILE__) . 'script.js', null );
	
	$array_for_data = $wpdb->get_results( 'SELECT indiv_sites, pro_sites, month, day, year FROM ' . expressions_graph_tablename(), ARRAY_N);
	wp_localize_script( 'expgraph-script-js', 'expgraph_data', array( 'data' => $array_for_data,
						'plugin_url'=> plugin_dir_url(__FILE__) ) );
}
add_shortcode( 'd3-learning', 'd3_learning_shortcode' );

function expressions_graph_data_get() {
	global $wpdb;
	$remote_request = wp_remote_get( 'https://expressions.syr.edu/site_count.txt' );
	if ( is_array( $remote_request ) && isset( $remote_request['response']['code'] ) && $remote_request['response']['code'] === 200 && isset( $remote_request['body'] ) && ! empty( $remote_request['body'] ) ) {
		$body = $remote_request['body'];
		
		$matches = null;
		preg_match_all( '/[0-9]+/', $body, $matches );
		$ind_sites = isset( $matches[0][0] ) ? (int)$matches[0][0] : null;
		$pro_sites = isset( $matches[0][1] ) ? (int)$matches[0][1] : null;
		
		$matches = null;
		preg_match_all( '/[0-9]+\-[0-9]+\-[0-9]+/', $body, $matches );
		$date = isset( $matches[0][0] ) ? array_map( 'intval', explode( '-', $matches[0][0] ) ) : null;
		
		$wpdb->insert( expressions_graph_tablename(), array(
			'indiv_sites' => $ind_sites,
			'pro_sites'   => $pro_sites,
			'month'       => $date[1],
			'day'         => $date[2],
			'year'        => $date[0]
		) );
	}
}
add_action( 'expressions_get_graph_data_cron', 'expressions_graph_data_get' );

function expressions_graph_activation(){
	global $wpdb;
	
	$charset_collate = '';
	
	if ( ! empty( $wpdb->charset ) ) {
		$charset_collate = 'DEFAULT CHARACTER SET ' . $wpdb->charset . '';
	}
	
	if ( ! empty( $wpdb->collate ) ) {
		$charset_collate .= ' COLLATE ' . $wpdb->collate . '';
	}
	
	$sql = 'CREATE TABLE ' . expressions_graph_tablename() . ' (
	  id mediumint(9) UNSIGNED NOT NULL AUTO_INCREMENT,
	  indiv_sites mediumint(9) UNSIGNED NOT NULL,
	  pro_sites mediumint(9) UNSIGNED NOT NULL,
	  month mediumint(9) UNSIGNED NOT NULL,
	  day mediumint(9) UNSIGNED NOT NULL,
	  year mediumint(9) UNSIGNED NOT NULL,
	  UNIQUE KEY id (id)
	) ' . $charset_collate . ';';
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta($sql);
	wp_schedule_event( time(), 'daily', 'expressions_get_graph_data_cron' );
}
register_activation_hook( __FILE__, "expressions_graph_activation");